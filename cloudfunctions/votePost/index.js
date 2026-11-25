const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

const DEFAULT_POLLS = [
  { label: '强烈推荐', count: 0 },
  { label: '观望一下', count: 0 },
  { label: '不太推荐', count: 0 }
]

exports.main = async (event, context) => {
  const postId = event.postId
  const index = Number(event.idx)
  const studentNo = event.studentNo
  const openid = cloud.getWXContext().OPENID

  if (!postId) {
    return { success: false, msg: '缺少帖子id' }
  }
  if (isNaN(index)) {
    return { success: false, msg: '参数错误' }
  }
  if (!studentNo) {
    return { success: false, msg: '请先登录' }
  }

  try {
    // 1. 取帖子，检查 polls
    const postRes = await db.collection('posts').doc(postId).get()
    const post = postRes.data
    let polls = post.polls

    if (!polls || polls.length === 0) {
      polls = DEFAULT_POLLS
      await db.collection('posts').doc(postId).update({
        data: { polls: DEFAULT_POLLS }
      })
    }

    if (index < 0 || index >= polls.length) {
      return { success: false, msg: '选项不存在' }
    }

    // 票数兜底，负数当 0
    const getCount = function (i) {
      if (!polls[i]) return 0
      const n = Number(polls[i].count) || 0
      return n < 0 ? 0 : n
    }

    // 2. 按学号查投票记录（不再用 openid）
    const recordRes = await db.collection('voteRecords')
      .where({ postId: postId, studentNo: studentNo })
      .get()
    const oldRecord = recordRes.data[0]

    // 情况 A：没投过
    if (!oldRecord) {
      await db.collection('voteRecords').add({
        data: {
          postId: postId,
          studentNo: studentNo,
          openid: openid || '',
          selectIndex: index,
          createTime: db.serverDate()
        }
      })
      const updA = {}
      updA['polls.' + index + '.count'] = getCount(index) + 1
      await db.collection('posts').doc(postId).update({ data: updA })
      return { success: true, msg: '投票成功' }
    }

    // 情况 B：点同一项 → 取消，最低到 0
    if (oldRecord.selectIndex === index) {
      await db.collection('voteRecords').doc(oldRecord._id).remove()
      const updB = {}
      const cur = getCount(index)
      updB['polls.' + index + '.count'] = cur > 0 ? cur - 1 : 0
      await db.collection('posts').doc(postId).update({ data: updB })
      return { success: true, msg: '已取消投票' }
    }

    // 情况 C：换成另一项
    const oldIdx = oldRecord.selectIndex
    await db.collection('voteRecords').doc(oldRecord._id).update({
      data: { selectIndex: index }
    })

    const updC = {}
    const oldCur = getCount(oldIdx)
    updC['polls.' + oldIdx + '.count'] = oldCur > 0 ? oldCur - 1 : 0
    updC['polls.' + index + '.count'] = getCount(index) + 1
    await db.collection('posts').doc(postId).update({ data: updC })
    return { success: true, msg: '已切换投票' }

  } catch (err) {
    console.error('votePost error:', err)
    return {
      success: false,
      msg: (err && err.message) ? err.message : '操作失败',
      error: String(err)
    }
  }
}