Page({
  data: {
    post: null,
    draft: ''
  },

  onLoad(options) {
    if (options.id) {
      this.loadPost(options.id)
    }
  },

  // 取当前登录学号
  getStudentNo() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    return userInfo.studentNo || ''
  },

  loadPost(id) {
    wx.cloud.callFunction({
      name: 'getPostDetail',
      data: {
        id: id,
        studentNo: this.getStudentNo()
      }
    }).then(res => {
      const result = res.result || {}
      if (!result.success) {
        wx.showToast({ title: result.msg || '加载失败', icon: 'none' })
        return
      }
      const raw = result.data || {}
      const oldPolls = raw.polls || []
      const c0 = oldPolls[0] ? (Number(oldPolls[0].count) || 0) : 0
      const c1 = oldPolls[1] ? (Number(oldPolls[1].count) || 0) : 0
      const c2 = oldPolls[2] ? (Number(oldPolls[2].count) || 0) : 0
      const rawPolls = [
        { label: '强烈推荐', count: c0 },
        { label: '观望一下', count: c1 },
        { label: '不太推荐', count: c2 }
      ]
      const post = {
        _id: raw._id,
        type: raw.type,
        title: raw.title,
        author: raw.nickname || '本校同学',
        time: this.formatTime(raw.createTime),
        province: raw.province || '',
        city: raw.city || '',
        district: raw.district || '',
        content: raw.content || '',
        tags: raw.tags || [],
        polls: rawPolls,
        comments: raw.comments || [],
        likeCount: raw.likeCount || 0,
        isLiked: !!raw.isLiked
      }
      post.polls = this.buildPolls(post.polls, result.votedIndex)
      this.setData({ post })
    }).catch(err => {
      console.error(err)
      wx.showToast({ title: '请求异常', icon: 'none' })
    })
  },

  buildPolls(polls, votedIndex) {
    const total = polls.reduce((sum, cur) => sum + (Number(cur.count) || 0), 0)
    return polls.map((p, i) => {
      let val = 0
      if (total > 0) {
        val = (Number(p.count) / total) * 100
      }
      return {
        label: p.label,
        count: Number(p.count) || 0,
        active: votedIndex === i,
        percentStr: val.toFixed(1) + '%'
      }
    })
  },

  formatTime(t) {
    if (!t) return '刚刚'
    const d = new Date(t)
    if (isNaN(d.getTime())) return '刚刚'
    const now = new Date()
    const diff = (now.getTime() - d.getTime()) / 1000
    if (diff < 60) return '刚刚'
    if (diff < 3600) return Math.floor(diff / 60) + '分钟前'
    if (diff < 86400) return Math.floor(diff / 3600) + '小时前'
    const m = d.getMonth() + 1
    const day = d.getDate()
    return m + '月' + day + '日'
  },

  onDraft(e) {
    this.setData({ draft: e.detail.value })
  },

  togglePoll(e) {
    const idx = e.currentTarget.dataset.index
    const post = this.data.post
    if (!post || !post.polls[idx]) return

    wx.cloud.callFunction({
      name: 'votePost',
      data: {
        postId: post._id,
        idx: idx,
        studentNo: this.getStudentNo()
      }
    }).then(res => {
      const r = res.result || {}
      wx.showToast({ title: r.msg || '操作失败', icon: 'none' })
      if (r.success) {
        this.loadPost(post._id)
      }
    }).catch(err => {
      console.error(err)
      wx.showToast({ title: '请求异常，请检查云函数', icon: 'none' })
    })
  },

  toggleLike() {
    const post = this.data.post
    if (!post) return

    wx.cloud.callFunction({
      name: 'toggleLike',
      data: {
        postId: post._id,
        studentNo: this.getStudentNo()
      }
    }).then(res => {
      const r = res.result || {}
      wx.showToast({ title: r.msg || '操作失败', icon: 'none' })
      if (r.success) {
        this.loadPost(post._id)
      }
    }).catch(err => {
      console.error(err)
      wx.showToast({ title: '请求异常，请检查云函数', icon: 'none' })
    })
  },

  onSend() {
    const content = this.data.draft.trim()
    if (!content) {
      wx.showToast({ title: '请输入评论内容', icon: 'none' })
      return
    }
    const postId = this.data.post._id

    wx.cloud.callFunction({
      name: 'addComment',
      data: {
        postId: postId,
        content: content,
        studentNo: this.getStudentNo()
      }
    }).then(res => {
      const r = res.result || {}
      wx.showToast({ title: r.msg || '操作失败', icon: 'none' })
      if (r.success) {
        this.setData({ draft: '' })
        this.loadPost(postId)
      }
    }).catch(err => {
      console.error(err)
      wx.showToast({ title: '请求异常，请检查云函数', icon: 'none' })
    })
  }
})