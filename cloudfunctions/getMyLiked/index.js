const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

function formatTime(t) {
  if (!t) return '刚刚'
  const d = new Date(t)
  if (isNaN(d.getTime())) return '刚刚'
  const diff = Math.floor((Date.now() - d.getTime()) / 1000)
  if (diff < 60) return '刚刚'
  if (diff < 3600) return Math.floor(diff / 60) + '分钟前'
  if (diff < 86400) return Math.floor(diff / 3600) + '小时前'
  const m = d.getMonth() + 1
  const day = d.getDate()
  return m + '月' + day + '日'
}

exports.main = async (event, context) => {
  try {
    const studentNo = event.studentNo
    if (!studentNo) {
      return { success: false, msg: '请先登录' }
    }

    // 按学号查我点过赞的记录
    const likeRes = await db.collection('likes')
      .where({ studentNo: studentNo })
      .get()

    const ids = likeRes.data.map(function (v) { return v.postId })
    if (ids.length === 0) {
      return { success: true, data: [] }
    }

    const postRes = await db.collection('posts')
      .where({ _id: db.command.in(ids) })
      .orderBy('createTime', 'desc')
      .get()

    const list = postRes.data.map(function (item) {
      return Object.assign({}, item, {
        time: formatTime(item.createTime)
      })
    })

    return { success: true, data: list }
  } catch (err) {
    console.error(err)
    return { success: false, msg: '加载失败', error: err }
  }
}