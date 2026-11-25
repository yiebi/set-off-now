const cloud = require('wx-server-sdk')
const crypto = require('crypto')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { studentNo, password } = event

  if (!studentNo || !password) {
    return { code: 400, msg: '学号和密码不能为空' }
  }

  const passwordHash = crypto.createHash('sha256').update(password).digest('hex')
  const res = await db.collection('users').where({ studentNo, passwordHash }).get()

  if (res.data.length === 0) {
    return { code: 401, msg: '学号或密码错误' }
  }

  const u = res.data[0]
  return {
    code: 0,
    msg: '登录成功',
    user: {
      _id: u._id,
      nickname: u.nickname,
      studentNo: u.studentNo,
      role: u.role,
      openid: u.openid
    }
  }
}