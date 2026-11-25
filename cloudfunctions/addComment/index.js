const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const postId = event.postId
    const content = event.content
    const studentNo = event.studentNo
    const openid = cloud.getWXContext().OPENID

    if (!postId || !content || !content.trim()) {
      return { success: false, msg: '内容不能为空' }
    }
    if (!studentNo) {
      return { success: false, msg: '请先登录' }
    }

    // 按学号查昵称（学号唯一，不会串号）
    let nickName = '本校同学'
    const u = await db.collection('users').where({ studentNo: studentNo }).get()
    if (u.data.length > 0 && u.data[0].nickname) {
      nickName = u.data[0].nickname
    }

    const text = content.trim()

    await db.collection('comments').add({
      data: {
        postId: postId,
        openid: openid || '',
        studentNo: studentNo,
        nickName: nickName,
        content: text,
        author: nickName,
        text: text,
        createTime: new Date()
      }
    })

    return { success: true, msg: '评论成功' }
  } catch (err) {
    console.error(err)
    return { success: false, msg: '评论失败' }
  }
}