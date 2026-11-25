// data/store.js 雏形版本地数据层
// 把用户新发的帖子、新发的评论写入本地缓存，和 mock 基础数据合并；
// 下一版接云数据库时，只需把这里的读写换成云调用，页面不用改。

const { posts: basePosts } = require('./mock.js');

const LOCAL_POSTS_KEY = 'local_posts';
const LOCAL_COMMENTS_KEY = 'local_comments';

function clone(arr) {
  return JSON.parse(JSON.stringify(arr));
}

// 基础 mock 帖（深拷贝，避免改到常量）
function getBasePosts() {
  return clone(basePosts);
}

// 用户在本机发过的帖子
function getLocalPosts() {
  return wx.getStorageSync(LOCAL_POSTS_KEY) || [];
}

// 全部帖子：本地新帖在前，基础帖在后
function getAllPosts() {
  return getLocalPosts().concat(getBasePosts());
}

// 新增一篇本地帖
function addPost(post) {
  const local = getLocalPosts();
  local.unshift(post);
  wx.setStorageSync(LOCAL_POSTS_KEY, local);
  return post;
}

// 某篇帖的本地新评论（按帖子 id 存）
function getLocalComments(postId) {
  const map = wx.getStorageSync(LOCAL_COMMENTS_KEY) || {};
  return map[postId] || [];
}

// 追加一条本地评论，返回该帖全部本地评论
function addComment(postId, comment) {
  const map = wx.getStorageSync(LOCAL_COMMENTS_KEY) || {};
  if (!map[postId]) map[postId] = [];
  map[postId].push(comment);
  wx.setStorageSync(LOCAL_COMMENTS_KEY, map);
  return map[postId];
}

// 一篇帖的全部评论 = 基础评论 + 本地新评论
function getComments(post) {
  return (post.comments || []).concat(getLocalComments(post.id));
}

module.exports = {
  getAllPosts,
  getLocalPosts,
  getBasePosts,
  addPost,
  getComments,
  addComment
};