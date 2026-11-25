const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const postId = event.postId
    const studentNo = event.studentNo
    const openid = cloud.getWXContext().OPENID

    if (!postId) {
      return { success: false, msg: '参数缺失' }
    }
    if (!studentNo) {
      return { success: false, msg: '请先登录' }
    }

    // 按学号判重（不再用 openid）
    const likeRes = await db.collection('likes')
      .where({ postId: postId, studentNo: studentNo })
      .get()

    let isLiked = false
    let msg = ''

    if (likeRes.data.length > 0) {
      await db.collection('likes').doc(likeRes.data[0]._id).remove()
      isLiked = false
      msg = '已取消点赞'
    } else {
      await db.collection('likes').add({
        data: {
          postId: postId,
          studentNo: studentNo,
          openid: openid || '',
          createTime: new Date()
        }
      })
      isLiked = true
      msg = '点赞成功'
    }

    // 返回最新总数
    const totalRes = await db.collection('likes')
      .where({ postId: postId })
      .count()

    return {
      success: true,
      msg: msg,
      isLiked: isLiked,
      likeCount: totalRes.total
    }
  } catch (err) {
    console.error(err)
    return { success: false, msg: '操作失败', error: err }
  }
}