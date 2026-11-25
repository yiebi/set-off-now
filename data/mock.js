// data/mock.js 雏形版本地模拟数据（下一版替换为云数据库）
// type: 安利 / 避雷 / 求助

const posts = [
  {
    id: 1,
    type: '安利',
    title: '西湖边的山景咖啡馆，人均20还能看落日',
    author: '计科22级同学',
    time: '2小时前',
    province: '浙江',
    city: '杭州',
    district: '西湖区',
    content: '周末和同学专门去的，店在半山腰不用爬很久，窗边位置正对落日，一杯拿铁20块左右，没有低消，学生友好。唯一缺点是周末座位紧，建议五点前到。',
    tags: ['种草了', '想去打卡'],
    wantGo: 128,
    replies: 36,
    polls: [
      { label: '种草了', count: 86, active: false },
      { label: '想去打卡', count: 128, active: false },
      { label: '已去过，好评', count: 34, active: false },
      { label: '再观望', count: 12, active: false },
      { label: '觉得一般', count: 5, active: false }
    ],
    comments: [
      { author: '通信23级', time: '2小时前', text: '上周刚去，落日位真的绝！' },
      { author: '电子22级', time: '3小时前', text: '请问雨天去还好看吗？' }
    ]
  },
  {
    id: 2,
    type: '避雷',
    title: '某古镇商业街小吃溢价严重，不推荐专程前往',
    author: '电子23级同学',
    time: '昨天',
    province: '浙江',
    city: '嘉兴',
    district: '西塘',
    content: '整条街都是同款网红小吃，价格比市区贵一倍，味道普通，商业化很重，没必要专门坐车过去。顺路逛逛可以，专程不建议。',
    tags: ['已避雷', '感谢提醒'],
    wantGo: 0,
    replies: 52,
    avoidCount: 89,
    polls: [
      { label: '已避雷', count: 89, active: false },
      { label: '感谢提醒', count: 41, active: false },
      { label: '我觉得还行', count: 18, active: false }
    ],
    comments: [
      { author: '计科21级', time: '5小时前', text: '同感，物价确实离谱。' },
      { author: '外国语23级', time: '昨天', text: '那是不是傍晚去人少一点？' }
    ]
  },
  {
    id: 3,
    type: '求助',
    title: '有没有同学去过莫干山？求真实体验和性价比',
    author: '通信23级同学',
    time: '3小时前',
    province: '浙江',
    city: '湖州',
    district: '莫干山',
    content: '周末想和室友去住一晚，看网上评价差别很大，想问问真实花费、要不要门票、值不值得专门从杭州过去，学生党预算有限。',
    tags: ['去过，说真话', '劝退'],
    wantGo: 0,
    replies: 18,
    polls: [
      { label: '去过，说真话', count: 42, active: false },
      { label: '值得去', count: 28, active: false },
      { label: '一般般', count: 11, active: false },
      { label: '劝退', count: 9, active: false }
    ],
    comments: [
      { author: '电子22级', time: '1小时前', text: '上周刚住过，民宿人均150左右，景区不强制门票，想安静可以去，爱热闹会觉得无聊。' },
      { author: '计科21级', time: '2小时前', text: '杭州过去自驾一个半小时，公共交通不太方便，建议结伴。' }
    ]
  },
  {
    id: 4,
    type: '安利',
    title: '苏州平江路旁边的园林小馆，学生票半价很值',
    author: '机电22级同学',
    time: '5小时前',
    province: '江苏',
    city: '苏州',
    district: '姑苏区',
    content: '不在主街里面，人少安静，凭学生证半价，园林布局精致，逛完顺路吃个苏面，半天刚好。',
    tags: ['种草了', '想去打卡'],
    wantGo: 64,
    replies: 21,
    polls: [
      { label: '种草了', count: 40, active: false },
      { label: '想去打卡', count: 64, active: false },
      { label: '已去过，好评', count: 19, active: false }
    ],
    comments: [
      { author: '经管23级', time: '1小时前', text: '学生证直接门口买就行对吧？' }
    ]
  }
];

// 地区页：大家评价过的城市
const cities = [
  { city: '杭州', province: '浙江', count: 42, trend: '安利居多' },
  { city: '嘉兴', province: '浙江', count: 18, trend: '避雷较多' },
  { city: '苏州', province: '江苏', count: 25, trend: '安利居多' },
  { city: '上海', province: '上海', count: 31, trend: '褒贬不一' },
  { city: '黄山', province: '安徽', count: 12, trend: '安利居多' }
];

// 家乡专区
const hometowns = [
  { name: '贵州 · 黔东南', people: 6 },
  { name: '四川 · 乐山', people: 4 }
];

module.exports = { posts, cities, hometowns };