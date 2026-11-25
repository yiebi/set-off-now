const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const studentNo = event.studentNo
    if (!studentNo) {
      return { success: false, msg: '请先登录' }
    }

    const res = await db.collection('users')
      .where({ studentNo: studentNo })
      .get()

    if (res.data.length === 0) {
      return { success: false, msg: '用户不存在' }
    }

    const u = res.data[0]
    return {
      success: true,
      data: {
        hometownProvince: u.hometownProvince || '',
        hometownCity: u.hometownCity || ''
      }
    }
  } catch (err) {
    console.error(err)
    return { success: false, msg: '查询失败', error: err }
  }
}