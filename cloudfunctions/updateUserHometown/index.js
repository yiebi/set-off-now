const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const studentNo = event.studentNo
    const province = event.province
    const city = event.city

    if (!studentNo) {
      return { success: false, msg: '请先登录' }
    }
    if (!province || !city) {
      return { success: false, msg: '请选择完整的省市' }
    }

    const res = await db.collection('users')
      .where({ studentNo: studentNo })
      .update({
        data: {
          hometownProvince: province,
          hometownCity: city,
          updateTime: db.serverDate()
        }
      })

    return { success: true, msg: '家乡已保存', updated: res.stats.updated }
  } catch (err) {
    console.error(err)
    return { success: false, msg: '保存失败', error: err }
  }
}