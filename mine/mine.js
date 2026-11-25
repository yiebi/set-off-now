const { PROVINCES, PROVINCE_NAMES } = require('../../data/regions.js')

Page({
  data: {
    user: {},
    hometownText: '未设置，点击补充',
    regionRange: [PROVINCE_NAMES, PROVINCES[0].cities],
    regionIndex: [0, 0],

    mainTab: 'post',          // post=我的帖子, comment=我的评论, like=点赞
    myTabs: ['全部', '安利', '避雷', '求助'],
    activeTab: '全部',
    allPosts: [],
    filteredMyPosts: [],
    likedPosts: [],
    myComments: [],
    commentCount: 0,
    menus: ['账号与安全', '隐私公约', '关于我们']
  },

  onShow() {
    const user = wx.getStorageSync('userInfo') || {}
    this.setData({ user })
    this.syncHometown(user)
    this.loadHometown()

    this.loadCommentCount()
    this.loadMyLiked()

    if (this.data.mainTab === 'post') {
      this.loadMyPosts()
    } else if (this.data.mainTab === 'comment') {
      this.loadMyComments()
    } else {
      this.loadMyLiked()
    }
  },

  // 从数据库拉最新家乡，回写缓存并刷新界面
  loadHometown() {
    const studentNo = this.getStudentNo()
    if (!studentNo) return

    wx.cloud.callFunction({
      name: 'getUserHometown',
      data: { studentNo: studentNo }
    }).then(res => {
      const r = res.result || {}
      if (r.success && r.data) {
        const user = wx.getStorageSync('userInfo') || {}
        user.hometownProvince = r.data.hometownProvince
        user.hometownCity = r.data.hometownCity
        wx.setStorageSync('userInfo', user)
        this.setData({ user: user })
        this.syncHometown(user)
      }
    }).catch(err => {
      console.error(err)
    })
  },

  // 把已保存的家乡回填到选择器
  syncHometown(user) {
    const prov = user.hometownProvince || ''
    const city = user.hometownCity || ''

    let hometownText = '未设置，点击补充'
    if (prov && city) {
      hometownText = prov + ' · ' + city
    } else if (prov) {
      hometownText = prov
    }

    let pIdx = PROVINCE_NAMES.indexOf(prov)
    if (pIdx < 0) pIdx = 0
    const cities = PROVINCES[pIdx].cities
    let cIdx = cities.indexOf(city)
    if (cIdx < 0) cIdx = 0

    this.setData({
      hometownText: hometownText,
      regionRange: [PROVINCE_NAMES, cities],
      regionIndex: [pIdx, cIdx]
    })
  },

  // 切换省份时，联动刷新城市列
  onRegionColumn(e) {
    const column = e.detail.column
    const value = e.detail.value
    if (column !== 0) return

    const province = PROVINCES[value]
    this.setData({
      regionRange: [PROVINCE_NAMES, province.cities],
      regionIndex: [value, 0]
    })
  },

  // 选完确认 → 保存到用户档案
  onRegionChange(e) {
    const idx = e.detail.value || []
    const pIdx = idx[0] || 0
    const cIdx = idx[1] || 0

    const province = PROVINCES[pIdx]
    const city = province.cities[cIdx] || province.cities[0]

    this.saveHometown(province.name, city)
  },

  saveHometown(province, city) {
    const studentNo = this.getStudentNo()
    if (!studentNo) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }

    wx.cloud.callFunction({
      name: 'updateUserHometown',
      data: {
        studentNo: studentNo,
        province: province,
        city: city
      }
    }).then(res => {
      const r = res.result || {}
      if (r.success) {
        const user = wx.getStorageSync('userInfo') || {}
        user.hometownProvince = province
        user.hometownCity = city
        wx.setStorageSync('userInfo', user)

        this.setData({
          user: user,
          hometownText: province + ' · ' + city
        })
        wx.showToast({ title: '家乡已保存', icon: 'success' })
      } else {
        wx.showToast({ title: r.msg || '保存失败', icon: 'none' })
      }
    }).catch(err => {
      console.error(err)
      wx.showToast({ title: '请求异常，请检查云函数', icon: 'none' })
    })
  },

  getStudentNo() {
    const user = wx.getStorageSync('userInfo') || {}
    return user.studentNo || ''
  },

  pickMain(e) {
    const val = e.currentTarget.dataset.val
    this.setData({ mainTab: val })
    if (val === 'post') {
      this.loadMyPosts()
    } else if (val === 'comment') {
      this.loadMyComments()
    } else {
      this.loadMyLiked()
    }
  },

  pickTab(e) {
    const t = e.currentTarget.dataset.t
    this.setData({ activeTab: t })
    this.applyFilter()
  },

  applyFilter() {
    const t = this.data.activeTab
    const all = this.data.allPosts || []
    let list = all
    if (t !== '全部') {
      list = []
      for (let i = 0; i < all.length; i++) {
        if (all[i].type === t) {
          list.push(all[i])
        }
      }
    }
    this.setData({ filteredMyPosts: list })
  },

  loadMyPosts() {
    const studentNo = this.getStudentNo()
    if (!studentNo) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    wx.cloud.callFunction({
      name: 'getMyPosts',
      data: { studentNo: studentNo }
    }).then(res => {
      const r = res.result || {}
      if (r.success) {
        this.setData({ allPosts: r.data || [] })
        this.applyFilter()
      } else {
        wx.showToast({ title: r.msg || '加载失败', icon: 'none' })
      }
    }).catch(err => {
      console.error(err)
      wx.showToast({ title: '请求异常，请检查云函数', icon: 'none' })
    })
  },

  loadMyLiked() {
    const studentNo = this.getStudentNo()
    if (!studentNo) return
    wx.cloud.callFunction({
      name: 'getMyLiked',
      data: { studentNo: studentNo }
    }).then(res => {
      const r = res.result || {}
      if (r.success) {
        this.setData({ likedPosts: r.data || [] })
      }
    }).catch(err => {
      console.error(err)
    })
  },

  loadMyComments() {
    const studentNo = this.getStudentNo()
    if (!studentNo) return
    wx.cloud.callFunction({
      name: 'getMyComments',
      data: { studentNo: studentNo }
    }).then(res => {
      const r = res.result || {}
      if (r.success) {
        this.setData({
          myComments: r.data || [],
          commentCount: r.total || 0
        })
      }
    }).catch(err => {
      console.error(err)
    })
  },

  loadCommentCount() {
    const studentNo = this.getStudentNo()
    if (!studentNo) return
    wx.cloud.callFunction({
      name: 'getMyCommentCount',
      data: { studentNo: studentNo }
    }).then(res => {
      const r = res.result || {}
      if (r.success) {
        this.setData({ commentCount: r.total || 0 })
      }
    }).catch(err => {
      console.error(err)
    })
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    if (!id) return
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id
    })
  },

  onMenu() {
  }
})