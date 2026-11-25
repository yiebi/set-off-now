const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

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

    // 1. 我发过的帖子
    const postRes = await db.collection('posts')
      .where({ authorStudentNo: studentNo })
      .get()

    const myPosts = postRes.data || []
    const postIds = myPosts.map(function (p) { return p._id })

    if (postIds.length === 0) {
      return { success: true, replies: [], likes: [], notices: [] }
    }

    // 帖子 id → 标题
    const titleMap = {}
    for (let i = 0; i < myPosts.length; i++) {
      titleMap[myPosts[i]._id] = myPosts[i].title || '我的帖子'
    }

    // 2. 回复：别人评论了我的帖子
    const commentRes = await db.collection('comments')
      .where({ postId: _.in(postIds) })
      .orderBy('createTime', 'desc')
      .get()

    const replies = []
    const cList = commentRes.data || []
    for (let i = 0; i < cList.length; i++) {
      const c = cList[i]
      if (c.studentNo === studentNo) continue   // 自己评论的不算消息
      replies.push({
        id: c._id,
        postId: c.postId,
        postTitle: titleMap[c.postId] || '我的帖子',
        nickName: c.nickName || '同学',
        content: c.content || c.text || '',
        time: formatTime(c.createTime),
        rawTime: c.createTime
      })
    }

    // 3. 点赞：别人点赞了我的帖子
    const likeRes = await db.collection('likes')
      .where({ postId: _.in(postIds) })
      .orderBy('createTime', 'desc')
      .get()

    const lList = likeRes.data || []

    // 拿到点赞人的学号，去 users 查昵称
    const likerNos = []
    for (let i = 0; i < lList.length; i++) {
      if (lList[i].studentNo && lList[i].studentNo !== studentNo) {
        likerNos.push(lList[i].studentNo)
      }
    }

    let nameMap = {}
    if (likerNos.length > 0) {
      const userRes = await db.collection('users')
        .where({ studentNo: _.in(likerNos) })
        .get()
      const users = userRes.data || []
      for (let i = 0; i < users.length; i++) {
        nameMap[users[i].studentNo] = users[i].nickname || '同学'
      }
    }

    const likes = []
    for (let i = 0; i < lList.length; i++) {
      const l = lList[i]
      if (!l.studentNo || l.studentNo === studentNo) continue
      likes.push({
        id: l._id,
        postId: l.postId,
        postTitle: titleMap[l.postId] || '我的帖子',
        nickName: nameMap[l.studentNo] || '同学',
        time: formatTime(l.createTime),
        rawTime: l.createTime
      })
    }

    // 4. 系统通知（notices 集合，没有就返回空）
    let notices = []
    try {
      const noticeRes = await db.collection('notices')
        .where({ toStudentNo: studentNo })
        .orderBy('createTime', 'desc')
        .get()
      const nList = noticeRes.data || []
      for (let i = 0; i < nList.length; i++) {
        const n = nList[i]
        notices.push({
          id: n._id,
          title: n.title || '系统通知',
          content: n.content || '',
          postId: n.postId || '',
          time: formatTime(n.createTime),
          rawTime: n.createTime
        })
      }
    } catch (e) {
      notices = []
    }

    return {
      success: true,
      replies: replies,
      likes: likes,
      notices: notices
    }
  } catch (err) {
    console.error(err)
    return { success: false, msg: '获取消息失败', error: err }
  }
}