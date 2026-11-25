const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const studentNo = event.studentNo
    if (!studentNo) {
      return { success: false, msg: '请先登录' }
    }

    const res = await db.collection('comments')
      .where({ studentNo: studentNo })
      .count()

    return { success: true, total: res.total }
  } catch (err) {
    console.error(err)
    return { success: false, msg: '获取失败', error: err }
  }
}