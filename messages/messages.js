Page({
  data: {
    tabs: ['回复', '点赞', '系统通知'],
    activeTab: '回复',
    filtered: [],

    allReplies: [],
    allLikes: [],
    allNotices: [],
    loading: false
  },

  onShow() {
    this.loadMessages()
  },

  onPullDownRefresh() {
    this.loadMessages()
  },

  getStudentNo() {
    const user = wx.getStorageSync('userInfo') || {}
    return user.studentNo || ''
  },

  loadMessages() {
    const studentNo = this.getStudentNo()
    if (!studentNo) {
      this.setData({ allReplies: [], allLikes: [], allNotices: [], filtered: [] })
      wx.stopPullDownRefresh()
      return
    }

    this.setData({ loading: true })

    wx.cloud.callFunction({
      name: 'getMessages',
      data: { studentNo: studentNo }
    }).then(res => {
      const r = res.result || {}
      if (r.success) {
        // 转成当前排版需要的字段：icon / title / desc / time / unread / id
        this.setData({
          allReplies: this.buildReplies(r.replies || []),
          allLikes: this.buildLikes(r.likes || []),
          allNotices: this.buildNotices(r.notices || [])
        })
        this.refreshList()
      } else {
        wx.showToast({ title: r.msg || '加载失败', icon: 'none' })
      }
      this.setData({ loading: false })
      wx.stopPullDownRefresh()
    }).catch(err => {
      console.error(err)
      wx.showToast({ title: '请求异常，请检查云函数', icon: 'none' })
      this.setData({ loading: false })
      wx.stopPullDownRefresh()
    })
  },

  // 回复：别人评论了我的帖子
  buildReplies(list) {
    const out = []
    for (let i = 0; i < list.length; i++) {
      const c = list[i]
      out.push({
        id: c.postId,                      // 点进去看那条帖子
        msgId: c.id,
        icon: '💬',
        title: (c.nickName || '同学') + ' 评论了你的帖子',
        desc: c.content || '',
        time: (c.postTitle || '我的帖子') + ' · ' + c.time,
        unread: i === 0
      })
    }
    return out
  },

  // 点赞：别人点赞了我的帖子
  buildLikes(list) {
    const out = []
    for (let i = 0; i < list.length; i++) {
      const l = list[i]
      out.push({
        id: l.postId,
        msgId: l.id,
        icon: '❤️',
        title: (l.nickName || '同学') + ' 点赞了你的帖子',
        desc: l.postTitle || '我的帖子',
        time: l.time,
        unread: i === 0
      })
    }
    return out
  },

  // 系统通知：家乡动态等
  buildNotices(list) {
    const out = []
    for (let i = 0; i < list.length; i++) {
      const n = list[i]
      out.push({
        id: n.postId || '',
        msgId: n.id,
        icon: '📢',
        title: n.title || '系统通知',
        desc: n.content || '',
        time: n.time,
        unread: i === 0
      })
    }
    return out
  },

  refreshList() {
    const t = this.data.activeTab
    let list = []
    if (t === '回复') {
      list = this.data.allReplies
    } else if (t === '点赞') {
      list = this.data.allLikes
    } else {
      list = this.data.allNotices
    }
    this.setData({ filtered: list })
  },

  pickTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.t })
    this.refreshList()
  },

  // 点消息 → 进对应帖子
  openNotice(e) {
    const id = e.currentTarget.dataset.id
    if (!id) {
      wx.showToast({ title: '该通知没有对应帖子', icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/detail/detail?id=' + id })
  }
})