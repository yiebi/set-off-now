const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

function formatTime(t) {
  if (!t) return '刚刚'
  const d = new Date(t)
  if (isNaN(d.getTime())) return '刚刚'
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 60) return '刚刚'
  if (diff < 3600) return Math.floor(diff / 60) + '分钟前'
  if (diff < 86400) return Math.floor(diff / 3600) + '小时前'
  const m = d.getMonth() + 1
  const day = d.getDate()
  return m + '月' + day + '日'
}

exports.main = async (event, context) => {
  try {
    const keyword = event.keyword || ''
    const type = event.type || '全部'
    const province = event.province || ''
    const city = event.city || ''

    // 【诊断日志】确认云端收到的真实参数
    console.log('=== getPosts 收到参数 ===', JSON.stringify({
      keyword: keyword,
      type: type,
      province: province,
      city: city
    }))

    let query = {}
    if (keyword.trim()) {
      query.title = db.RegExp({
        regexp: keyword,
        options: 'i'
      })
    }
    if (type && type !== '全部') {
      query.type = type
    }
    if (province) {
      query.province = province
    }
    if (city) {
      query.city = city
    }

    // 【诊断日志】最终 where 条件
    console.log('=== 最终 query ===', JSON.stringify(query))

    const res = await db.collection('posts')
      .where(query)
      .orderBy('createTime', 'desc')
      .get()

    console.log('=== 命中条数 ===', res.data.length)

    const list = []
    for (let i = 0; i < res.data.length; i++) {
      const p = res.data[i]
      const cRes = await db.collection('comments')
        .where({ postId: p._id })
        .count()
      list.push(Object.assign({}, p, {
        author: p.nickname || '本校同学',
        time: formatTime(p.createTime),
        replies: cRes.total,
        replyCount: cRes.total
      }))
    }

    return {
      success: true,
      data: list
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      msg: '获取帖子失败',
      error: String(err)
    }
  }
}