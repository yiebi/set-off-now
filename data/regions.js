// data/regions.js 全国省 / 市离线数据
// 用途：地区页省份全列表、城市搜索、首页省份筛选、发布页省市选择
// 结构：PROVINCES = [{ name, cities: [城市名...] }]

const PROVINCES = [
  { name: '北京', cities: ['北京'] },
  { name: '天津', cities: ['天津'] },
  { name: '河北', cities: ['石家庄', '唐山', '秦皇岛', '邯郸', '邢台', '保定', '张家口', '承德', '沧州', '廊坊', '衡水'] },
  { name: '山西', cities: ['太原', '大同', '阳泉', '长治', '晋城', '朔州', '晋中', '运城', '忻州', '临汾', '吕梁'] },
  { name: '内蒙古', cities: ['呼和浩特', '包头', '乌海', '赤峰', '通辽', '鄂尔多斯', '呼伦贝尔', '巴彦淖尔', '乌兰察布', '兴安盟', '锡林郭勒盟', '阿拉善盟'] },
  { name: '辽宁', cities: ['沈阳', '大连', '鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '阜新', '辽阳', '盘锦', '铁岭', '朝阳', '葫芦岛'] },
  { name: '吉林', cities: ['长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城', '延边'] },
  { name: '黑龙江', cities: ['哈尔滨', '齐齐哈尔', '鸡西', '鹤岗', '双鸭山', '大庆', '伊春', '佳木斯', '七台河', '牡丹江', '黑河', '绥化', '大兴安岭'] },
  { name: '上海', cities: ['上海'] },
  { name: '江苏', cities: ['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁'] },
  { name: '浙江', cities: ['杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水'] },
  { name: '安徽', cities: ['合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '阜阳', '宿州', '六安', '亳州', '池州', '宣城'] },
  { name: '福建', cities: ['福州', '厦门', '莆田', '三明', '泉州', '漳州', '南平', '龙岩', '宁德'] },
  { name: '江西', cities: ['南昌', '景德镇', '萍乡', '九江', '新余', '鹰潭', '赣州', '吉安', '宜春', '抚州', '上饶'] },
  { name: '山东', cities: ['济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '威海', '日照', '临沂', '德州', '聊城', '滨州', '菏泽', '泰安'] },
  { name: '河南', cities: ['郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '南阳', '商丘', '信阳', '周口', '驻马店', '济源'] },
  { name: '湖北', cities: ['武汉', '黄石', '十堰', '宜昌', '襄阳', '鄂州', '荆门', '孝感', '荆州', '黄冈', '咸宁', '随州', '恩施'] },
  { name: '湖南', cities: ['长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州', '怀化', '娄底', '湘西'] },
  { name: '广东', cities: ['广州', '深圳', '珠海', '汕头', '佛山', '东莞', '中山', '惠州', '江门', '肇庆', '湛江', '茂名', '阳江', '清远', '韶关', '河源', '梅州', '潮州', '揭阳', '云浮', '汕尾'] },
  { name: '广西', cities: ['南宁', '柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '百色', '河池', '来宾', '崇左', '贺州'] },
  { name: '海南', cities: ['海口', '三亚', '儋州', '三沙'] },
  { name: '重庆', cities: ['重庆'] },
  { name: '四川', cities: ['成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '遂宁', '南充', '广元', '广安', '达州', '眉山', '乐山', '雅安', '内江', '资阳', '宜宾', '巴中', '阿坝', '甘孜', '凉山'] },
  { name: '贵州', cities: ['贵阳', '遵义', '六盘水', '安顺', '毕节', '铜仁', '黔东南', '黔南', '黔西南'] },
  { name: '云南', cities: ['昆明', '曲靖', '玉溪', '保山', '昭通', '丽江', '普洱', '临沧', '楚雄', '红河', '文山', '西双版纳', '大理', '德宏', '怒江', '迪庆'] },
  { name: '西藏', cities: ['拉萨', '日喀则', '昌都', '林芝', '山南', '那曲', '阿里'] },
  { name: '陕西', cities: ['西安', '铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '安康', '商洛'] },
  { name: '甘肃', cities: ['兰州', '嘉峪关', '金昌', '白银', '天水', '武威', '张掖', '酒泉', '平凉', '庆阳', '定西', '陇南', '临夏', '甘南'] },
  { name: '青海', cities: ['西宁', '海东', '海北', '黄南', '海南州', '果洛', '玉树', '海西'] },
  { name: '宁夏', cities: ['银川', '石嘴山', '吴忠', '固原', '中卫'] },
  { name: '新疆', cities: ['乌鲁木齐', '克拉玛依', '吐鲁番', '哈密', '昌吉', '博尔塔拉', '巴音郭楞', '阿克苏', '克孜勒苏', '喀什', '和田', '伊犁', '塔城', '阿勒泰'] },
  { name: '香港', cities: ['香港'] },
  { name: '澳门', cities: ['澳门'] },
  { name: '台湾', cities: ['台北', '新北', '桃园', '台中', '台南', '高雄'] }
];

const PROVINCE_NAMES = PROVINCES.map(p => p.name);

// 省级行政区类型：直辖市 / 特别行政区 / 普通省
const MUNICIPALITY_NAMES = ['北京', '天津', '上海', '重庆'];
const SAR_NAMES = ['香港', '澳门'];
PROVINCES.forEach(function (p) {
  if (SAR_NAMES.indexOf(p.name) >= 0) {
    p.type = 'sar';
  } else if (MUNICIPALITY_NAMES.indexOf(p.name) >= 0) {
    p.type = 'municipality';
  } else {
    p.type = 'province';
  }
});

// 扁平城市索引，供搜索与跳转
const ALL_CITIES = [];
PROVINCES.forEach(function (p) {
  p.cities.forEach(function (c) {
    ALL_CITIES.push({
      city: c,
      province: p.name,
      key: p.name + '-' + c
    });
  });
});

function getProvince(name) {
  return PROVINCES.filter(p => p.name === name)[0] || null;
}

function getCities(provinceName) {
  const p = getProvince(provinceName);
  return p ? p.cities : [];
}

// 搜索：省名完全命中 -> 列该省全部城市；否则城市名优先、省份次之
function searchCities(keyword, limit) {
  const kw = (keyword || '').trim();
  if (!kw) return [];
  const max = limit || 60;

  const exactProvince = PROVINCES.filter(p => p.name === kw)[0];
  if (exactProvince) {
    return exactProvince.cities.map(c => ({
      city: c,
      province: exactProvince.name,
      key: exactProvince.name + '-' + c
    })).slice(0, max);
  }

  const hit = ALL_CITIES.filter(c => c.city.indexOf(kw) >= 0 || c.province.indexOf(kw) >= 0);
  hit.sort(function (a, b) {
    const aStarts = a.city.indexOf(kw) === 0 ? 0 : 1;
    const bStarts = b.city.indexOf(kw) === 0 ? 0 : 1;
    if (aStarts !== bStarts) return aStarts - bStarts;
    if (a.city.length !== b.city.length) return a.city.length - b.city.length;
    return a.province.localeCompare(b.province);
  });
  return hit.slice(0, max);
}

module.exports = {
  PROVINCES,
  PROVINCE_NAMES,
  ALL_CITIES,
  getProvince,
  getCities,
  searchCities
};