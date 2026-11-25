const cloud = require('wx-server-sdk')
const crypto = require('crypto')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { studentNo, password, nickname } = event

  if (!/^\d{8}$/.test(studentNo || '')) {
    return { code: 400, msg: '学号必须是8位数字' }
  }
  if (!password || password.length < 6) {
    return { code: 400, msg: '密码至少6位' }
  }
  if (!nickname || nickname.trim().length < 1 || nickname.length > 12) {
    return { code: 400, msg: '昵称1-12个字' }
  }

  const dup = await db.collection('users').where({ studentNo }).get()
  if (dup.data.length > 0) {
    return { code: 409, msg: '该学号已注册' }
  }

  const passwordHash = crypto.createHash('sha256').update(password).digest('hex')
  const { OPENID } = cloud.getWXContext()

  const res = await db.collection('users').add({
    data: {
      studentNo,
      passwordHash,
      nickname: nickname.trim(),
      role: 0,
      openid: OPENID,
      createTime: db.serverDate()
    }
  })

  return { code: 0, msg: '注册成功', userId: res._id, nickname: nickname.trim() }
}