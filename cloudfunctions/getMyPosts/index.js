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

    const res = await db.collection('posts')
      .where({ authorStudentNo: studentNo })
      .orderBy('createTime', 'desc')
      .get()

    const list = res.data.map(function (item) {
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