const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

function formatTime(t) {
  if (!t) return '刚刚'
  const d = new Date(t)
  if (isNaN(d.getTime())) return '刚刚'
  const diff = Math.floor((Date.now() - d.getTime()) / 1000)
  if (diff < 0) return '刚刚'
  if (diff < 60) return '刚刚'
  if (diff < 3600) return Math.floor(diff / 60) + '分钟前'
  if (diff < 86400) return Math.floor(diff / 3600) + '小时前'
  const m = d.getMonth() + 1
  const day = d.getDate()
  return m + '月' + day + '日'
}

exports.main = async (event, context) => {
  try {
    const id = event.id
    const studentNo = event.studentNo

    if (!id) {
      return { success: false, msg: '缺少帖子id' }
    }

    // 帖子本体
    const res = await db.collection('posts').doc(id).get()
    const postData = res.data

    // 评论列表
    const commentRes = await db.collection('comments')
      .where({ postId: id })
      .orderBy('createTime', 'desc')
      .get()

    const comments = commentRes.data.map(function (item) {
      return Object.assign({}, item, {
        author: item.nickName || item.author || '本校同学',
        text: item.content || item.text || '',
        time: formatTime(item.createTime)
      })
    })

    // 投票状态（按学号）
    let votedIndex = null
    if (studentNo) {
      const voteRes = await db.collection('voteRecords')
        .where({ postId: id, studentNo: studentNo })
        .get()
      if (voteRes.data.length > 0) {
        votedIndex = voteRes.data[0].selectIndex
      }
    }

    // 点赞总数
    const allLikeRes = await db.collection('likes').where({ postId: id }).get()
    const totalLike = allLikeRes.data.length

    // 我是否点赞（按学号）
    let isLiked = false
    if (studentNo) {
      const userLikeRes = await db.collection('likes')
        .where({ postId: id, studentNo: studentNo })
        .get()
      isLiked = userLikeRes.data.length > 0
    }

    return {
      success: true,
      data: Object.assign({}, postData, {
        comments: comments,
        likeCount: totalLike,
        isLiked: isLiked
      }),
      votedIndex: votedIndex
    }
  } catch (err) {
    console.error(err)
    return { success: false, msg: '帖子不存在或已删除', error: err }
  }
}