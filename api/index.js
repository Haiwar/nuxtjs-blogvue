import api from '@/plugins/axios';

// 系统config值
export function systemConfig() {
  return api({
    url: '/api/conf',
    method: 'post',
  });
}
// 友情链接
export function friendLinks() {
  return api({
    url: '/api/link',
    method: 'post',
  });
}
// 右侧导航栏
export function navigations() {
  return api({
    url: '/api/nav',
    method: 'post',
  });
}
// 关于我
export function homeAbout(data) {
  return api({
    url: '/api/about',
    method: 'post',
    data
  });
}
// 推荐文章
export function hotList() {
  return api({
    url: '/api/hot',
    method: 'post',
  });
}
// 文章列表
export function indexList(data) {
  return api({
    url: '/api/indexlist',
    method: 'get',
    data
  });
}
// 文章详情
export function getArticle(data) {
  return api({
    url: '/api/post',
    method: 'get',
    data
  });
}

// 评论列表
export function commentList(data) {
  return api({
    url: '/api/comment',
    method: 'get',
    data
  });
}

// 时间轴
export function timeline(data) {
  return api({
    url: '/api/timeline',
    method: 'get',
    data
  });
}
// 文章归档
export function timelist(data) {
  return api({
    url: '/api/timelist',
    method: 'get',
    data
  });
}
// 关于我
export function aboutMe(data) {
  return api({
    url: '/api/about',
    method: 'get',
    data
  });
}
// 添加评论
export function addComment(data) {
  return api({
    url: '/api/add_comment',
    method: 'post',
    data
  });
}
// 添加回复
export function addReply(data) {
  return api({
    url: '/api/add_reply',
    method: 'post',
    data
  });
}

// 获取上下页
export function getPage(data) {
  return api({
    url: '/api/page',
    method: 'get',
    data
  });
}
// 获取相似文章
export function getLikeArticle(data) {
  return api({
    url: '/api/like_article',
    method: 'get',
    data
  });
}
