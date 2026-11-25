const { PROVINCES, PROVINCE_NAMES } = require('../../data/regions.js');
const DEFAULT_PROVINCE = '浙江';
const defaultProvinceIndex = Math.max(0, PROVINCE_NAMES.indexOf(DEFAULT_PROVINCE));
const defaultCities = PROVINCES[defaultProvinceIndex].cities;
const defaultCityIndex = Math.max(0, defaultCities.indexOf('杭州'));

Page({
  data: {
    role: 'ask',
    shareType: '安利',
    title: '',
    content: '',
    place: '',
    regionRange: [PROVINCE_NAMES, defaultCities],
    regionIndex: [defaultProvinceIndex, defaultCityIndex],
    provinceText: PROVINCE_NAMES[defaultProvinceIndex],
    cityText: defaultCities[defaultCityIndex],
    expects: [
      { label: '求真实体验', active: false },
      { label: '求性价比', active: false },
      { label: '求避雷提醒', active: false },
      { label: '求出行攻略', active: false }
    ]
  },

  pickRole(e) {
    this.setData({ role: e.currentTarget.dataset.role });
  },
  pickShareType(e) {
    this.setData({ shareType: e.currentTarget.dataset.t });
  },
  onTitle(e) {
    this.setData({ title: e.detail.value });
  },
  onContent(e) {
    this.setData({ content: e.detail.value });
  },
  onPlace(e) {
    this.setData({ place: e.detail.value });
  },

  onRegionColumn(e) {
    const column = e.detail.column;
    const value = e.detail.value;
    if (column !== 0) return;
    const province = PROVINCES[value];
    this.setData({
      regionRange: [PROVINCE_NAMES, province.cities],
      regionIndex: [value, 0],
      provinceText: province.name,
      cityText: province.cities[0]
    });
  },
  onRegionChange(e) {
    const idx = e.detail.value || [];
    const pIdx = idx[0] || 0;
    const cIdx = idx[1] || 0;
    const province = PROVINCES[pIdx];
    const city = province.cities[cIdx] || province.cities[0];
    this.setData({
      regionIndex: [pIdx, cIdx],
      provinceText: province.name,
      cityText: city
    });
  },

  toggleExpect(e) {
    const i = e.currentTarget.dataset.index;
    const expects = this.data.expects.slice();
    const item = expects[i];
    expects[i] = { label: item.label, count: item.count, active: !item.active };
    this.setData({ expects });
  },

  buildPolls(role, shareType, expects) {
    if (role === 'share' && shareType === '安利') {
      return [
        { label: '强烈推荐', count: 0, active: false },
        { label: '观望一下', count: 0, active: false },
        { label: '不太推荐', count: 0, active: false }
      ];
    }
    if (role === 'share' && shareType === '避雷') {
      return [
        { label: '已避雷', count: 0, active: false },
        { label: '感谢提醒', count: 0, active: false },
        { label: '我觉得还行', count: 0, active: false }
      ];
    }
    const picked = expects.filter(x => x.active).map(x => ({ label: x.label, count: 0, active: false }));
    return picked.length ? picked : [
      { label: '求真实体验', count: 0, active: false },
      { label: '求性价比', count: 0, active: false }
    ];
  },

  onPublish() {
    const { role, shareType, title, content, place, expects, provinceText, cityText } = this.data;

    if (!title.trim()) {
      wx.showToast({ title: '先写一句话标题', icon: 'none' });
      return;
    }
    if (!content.trim()) {
      wx.showToast({ title: '补充一点正文内容', icon: 'none' });
      return;
    }

    const type = role === 'share' ? shareType : '求助';
    const user = wx.getStorageSync('userInfo') || {};
    const nickname = user.nickname || (user.studentNo ? ('学号' + user.studentNo + '同学') : '本校同学');
    const studentNo = user.studentNo || '';
    const pickedTags = expects.filter(x => x.active).map(x => x.label);
    const detailPlace = place.trim();
    const city = detailPlace ? (cityText + '·' + detailPlace) : cityText;

    wx.showLoading({ title: '发布中...' });

    wx.cloud.callFunction({
      name: 'addPost',
      data: {
        title: title.trim(),
        content: content.trim(),
        province: provinceText,
        city: city,
        type: type,
        tags: pickedTags,
        polls: this.buildPolls(role, shareType, expects),
        nickname: nickname,
        studentNo: studentNo
      }
    }).then(res => {
      wx.hideLoading();
      const result = res.result || {};
      if (result.success) {
        wx.showToast({ title: '发布成功', icon: 'success' });
        setTimeout(() => {
          wx.switchTab({ url: '/pages/home/home' });
        }, 700);
      } else {
        wx.showToast({ title: result.msg || '发布失败', icon: 'none' });
      }
    }).catch(err => {
      wx.hideLoading();
      console.error(err);
      wx.showToast({ title: '请求异常，请检查云函数', icon: 'none' });
    });
  }
});