const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const {
      title,
      content,
      province,
      city,
      type,
      tags,
      polls,
      nickname,
      studentNo
    } = event

    if (!title || !type) {
      return { success: false, msg: '标题和类型不能为空' }
    }

    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID

    const res = await db.collection('posts').add({
      data: {
        title: title,
        content: content || '',
        province: province || '',
        city: city || '',
        type: type,
        tags: tags || [],
        polls: polls || [],
        nickname: nickname || '本校同学',
        studentNo: studentNo || '',
        authorOpenid: openid,
        authorStudentNo: studentNo || '',
        wantGo: 0,
        avoidCount: 0,
        replies: 0,
        likeCount: 0,
        createTime: db.serverDate()
      }
    })

    return { success: true, msg: '发布成功', _id: res._id }
  } catch (err) {
    console.error(err)
    return { success: false, msg: '发布失败', error: err }
  }
}