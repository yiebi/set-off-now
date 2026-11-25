// app.js 全局逻辑
App({
  globalData: {
    // 当前登录学生（登录成功后由 login 页写入缓存并同步到这里）
    userInfo: null,
    // 是否已经通过学号登录
    logged: false,
    // 地区页点了城市后，回首页临时带过来的筛选目标
    pendingCity: null
  },

  onLaunch() {
    // 云开发初始化（环境 ID 对应 cloud1）
    if (!wx.cloud) {
      console.error('基础库版本过低，请升级微信开发者工具')
      return
    }
    wx.cloud.init({
      env: 'cloud1-d3g53dkyia749e171',
      traceUser: true
    })

    // 读取本地缓存的登录态，刷新 / 重进小程序后仍保持登录
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo && userInfo.studentNo) {
      this.globalData.userInfo = userInfo
      this.globalData.logged = true
    }
  }
})