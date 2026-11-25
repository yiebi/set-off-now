const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event) => {
  const { content } = event

  if (!content || !content.trim()) {
    return { pass: false, msg: '内容不能为空' }
  }

  const { OPENID } = cloud.getWXContext()

  try {
    const res = await cloud.openapi.security.msgSecCheck({
      content: content,
      version: 2,
      scene: 2,
      openid: OPENID
    })

    if (res.result && res.result.suggest === 'risky') {
      return { pass: false, msg: '内容含违规信息，请修改后再发' }
    }
    return { pass: true }
  } catch (e) {
    // 接口未开通或超限时放行，转人工审核
    return { pass: false, pending: true, msg: '接口暂不可用，转人工审核' }
  }
}