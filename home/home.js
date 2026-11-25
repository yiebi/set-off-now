const { PROVINCE_NAMES } = require('../../data/regions.js');
const app = getApp();

Page({
  data: {
    keyword: '',
    activeType: '全部',
    activeRegion: '全部地区',
    activeCity: '',
    activeCityProvince: '',
    hometownProvince: '',
    hometownCity: '',
    types: ['全部', '安利', '避雷', '求助'],
    regions: ['全部地区', '我的家乡', '本地'].concat(PROVINCE_NAMES),
    list: []
  },

  onShow() {
    const user = wx.getStorageSync('userInfo') || {};
    const hp = user.hometownProvince || '';
    const hc = user.hometownCity || '';

    console.log('【1 进首页】storage 里的家乡 =', hp, '|', hc);
    console.log('【1 进首页】studentNo =', user.studentNo);

    this.setData({
      hometownProvince: hp,
      hometownCity: hc
    });

    const pending = app.globalData.pendingCity;
    if (pending && pending.city) {
      console.log('【1 进首页】收到地区页跳转 =', pending.province, pending.city);
      this.setData({
        activeRegion: '全部地区',
        activeCityProvince: pending.province,
        activeCity: pending.city,
        keyword: ''
      });
      app.globalData.pendingCity = null;
    }

    this.applyFilter();
  },

  onPullDownRefresh() {
    this.applyFilter();
  },

  onKeyword(e) {
    this.setData({ keyword: e.detail.value });
  },

  pickType(e) {
    this.setData({ activeType: e.currentTarget.dataset.t }, () => {
      this.applyFilter();
    });
  },

  pickRegion(e) {
    const r = e.currentTarget.dataset.r;
    const user = wx.getStorageSync('userInfo') || {};
    const hp = user.hometownProvince || '';
    const hc = user.hometownCity || '';

    console.log('【2 点标签】dataset.r =', r);
    console.log('【2 点标签】storage 家乡 =', hp, '|', hc);

    if (r === '我的家乡') {
      if (!hp) {
        wx.showToast({ title: '请先到「我的」补充家乡', icon: 'none' });
        return;
      }
      this.setData({
        activeRegion: '我的家乡',
        activeCityProvince: hp,
        activeCity: hc
      }, () => {
        this.applyFilter();
      });
    } else if (r === '全部地区' || r === '本地') {
      this.setData({
        activeRegion: r,
        activeCityProvince: '',
        activeCity: ''
      }, () => {
        this.applyFilter();
      });
    } else {
      this.setData({
        activeRegion: r,
        activeCityProvince: r,
        activeCity: ''
      }, () => {
        this.applyFilter();
      });
    }
  },

  clearCity() {
    this.setData({
      activeCity: '',
      activeCityProvince: '',
      activeRegion: '全部地区'
    }, () => {
      this.applyFilter();
    });
  },

  applyFilter() {
    const d = this.data;
    let province = '';
    let city = '';

    if (d.activeRegion === '我的家乡') {
      province = d.hometownProvince;
      city = d.hometownCity;
    } else if (d.activeCityProvince) {
      province = d.activeCityProvince;
      city = d.activeCity;
    }

    console.log('【3 发请求】activeRegion =', d.activeRegion);
    console.log('【3 发请求】final =', province, '|', city);

    wx.cloud.callFunction({
      name: 'getPosts',
      data: {
        keyword: d.keyword,
        type: d.activeType,
        province: province,
        city: city
      }
    }).then(res => {
      const result = res.result || {};
      if (result.success) {
        console.log('【4 返回】条数 =', (result.data || []).length);
        this.setData({ list: result.data });
      } else {
        wx.showToast({ title: result.msg || '获取帖子失败', icon: 'none' });
      }
      wx.stopPullDownRefresh();
    }).catch(err => {
      console.error(err);
      wx.showToast({ title: '请求异常', icon: 'none' });
      wx.stopPullDownRefresh();
    });
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id });
  },

  goRegion() {
    wx.switchTab({ url: '/pages/region/region' });
  }
});