const { PROVINCES, ALL_CITIES, getCities, searchCities } = require('../../data/regions.js');
const { cities: hotCities } = require('../../data/mock.js');
const app = getApp();

Page({
  data: {
    keyword: '',
    activeProvince: '',
    provinces: [],
    cityList: [],
    searchResult: [],
    hotCities,
    cityTotal: ALL_CITIES.length,

    // 我的家乡（从用户档案来）
    myHometownProvince: '',
    myHometownCity: ''
  },

  onLoad() {
    // 省份列表：直辖市、特别行政区不显示"1市"
    const provinces = PROVINCES.map(function (p) {
      let label;
      if (p.type === 'municipality') {
        label = '直辖市';
      } else if (p.type === 'sar') {
        label = '特别行政区';
      } else {
        label = p.cities.length + '市';
      }
      return { name: p.name, count: p.cities.length, label: label };
    });
    this.setData({ provinces: provinces });
  },

  // 每次进来同步真实家乡（在「我的」改完回来立即生效）
  onShow() {
    const user = wx.getStorageSync('userInfo') || {};
    this.setData({
      myHometownProvince: user.hometownProvince || '',
      myHometownCity: user.hometownCity || ''
    });
  },

  onKeyword(e) {
    const keyword = e.detail.value;
    this.setData({
      keyword: keyword,
      searchResult: keyword ? searchCities(keyword) : [],
      activeProvince: keyword ? '' : this.data.activeProvince
    });
  },

  clearKeyword() {
    this.setData({ keyword: '', searchResult: [] });
  },

  pickProvince(e) {
    const name = e.currentTarget.dataset.name;
    this.setData({
      activeProvince: name,
      cityList: getCities(name),
      keyword: '',
      searchResult: []
    });
  },

  backProvince() {
    this.setData({ activeProvince: '', cityList: [] });
  },

  // 点城市 → 回首页看该城市的帖子
  goCity(e) {
    const city = e.currentTarget.dataset.city;
    const province = e.currentTarget.dataset.province;
    app.globalData.pendingCity = { city: city, province: province };
    wx.switchTab({ url: '/pages/home/home' });
  },

  // 点「我的家乡」→ 回首页看同乡帖子
  goMyHometown() {
    const prov = this.data.myHometownProvince;
    const city = this.data.myHometownCity;

    if (!prov || !city) {
      wx.showToast({ title: '请先到「我的」补充家乡', icon: 'none' });
      return;
    }

    app.globalData.pendingCity = { city: city, province: prov };
    wx.switchTab({ url: '/pages/home/home' });
  },

  // 未设置家乡 → 引导去「我的」
  goMine() {
    wx.switchTab({ url: '/pages/mine/mine' });
  },

  scrollToProvince() {}
});