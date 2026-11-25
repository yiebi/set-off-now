Page({
  data: {
    studentNo: '',
    password: '',
    confirmPwd: '',
    nickname: '',
    agree: false,
    isRegister: false,
    pwdShow: false,
    confirmPwdShow: false,
    loading: false
  },

  onStudentNoInput(e) {
    this.setData({ studentNo: e.detail.value })
  },
  onPasswordInput(e) {
    this.setData({ password: e.detail.value })
  },
  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value })
  },
  onConfirmPwdInput(e) {
    this.setData({ confirmPwd: e.detail.value })
  },
  togglePwd() {
    this.setData({ pwdShow: !this.data.pwdShow })
  },
  toggleConfirmPwd() {
    this.setData({ confirmPwdShow: !this.data.confirmPwdShow })
  },
  onAgreeChange(e) {
    this.setData({ agree: e.detail.value.length > 0 })
  },
  toggleMode() {
    this.setData({
      isRegister: !this.data.isRegister,
      password: '',
      confirmPwd: '',
      nickname: ''
    })
  },

  submit() {
    const { studentNo, password, confirmPwd, nickname, agree, isRegister } = this.data
    if (!agree) {
      wx.showToast({ title: '请先同意协议', icon: 'none' })
      return
    }
    if (!studentNo.trim()) {
      wx.showToast({ title: '请输入学号', icon: 'none' })
      return
    }
    if (!password.trim()) {
      wx.showToast({ title: '请输入密码', icon: 'none' })
      return
    }
    if (isRegister && password !== confirmPwd) {
      wx.showToast({ title: '两次密码不一致', icon: 'none' })
      return
    }

    this.setData({ loading: true })
    const submitData = isRegister
      ? { studentNo: studentNo.trim(), password: password, nickname: nickname.trim() }
      : { studentNo: studentNo.trim(), password: password }

    wx.cloud.callFunction({
      name: isRegister ? 'register' : 'login',
      data: submitData
    })
      .then(res => {
        this.setData({ loading: false })
        const result = res.result
        if (result.code === 0) {
          if (isRegister) {
            // 注册成功：切回登录态，用刚注册的账号再登录一次
            wx.showToast({ title: '注册成功，请登录', icon: 'success' })
            this.setData({
              isRegister: false,
              password: '',
              confirmPwd: '',
              nickname: ''
            })
          } else {
            // 登录成功：保存登录态，进入首页
            const app = getApp()
            const user = result.user || {}
            wx.setStorageSync('userInfo', user)
            app.globalData.userInfo = user
            app.globalData.logged = true
            wx.showToast({ title: '登录成功！', icon: 'success' })
            setTimeout(() => {
              wx.switchTab({ url: '/pages/home/home' })
            }, 1200)
          }
        } else {
          wx.showToast({
            title: result.msg || '操作失败',
            icon: 'none'
          })
        }
      })
      .catch(err => {
        console.error(err)
        this.setData({ loading: false })
        wx.showToast({ title: '请求异常，请检查云函数', icon: 'none' })
      })
  }
})