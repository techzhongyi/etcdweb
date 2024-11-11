import request from '@/utils/request';

/** 获取版本列表 GET /devopsCore/servicelist */
export async function getOpVersionListAPI(options: any) {
  return request('/devopsCore/version', {
    method: 'GET',
    params: options,
    b:'list'
  });
}
/** 获取版本详情 GET /devopsCore/servicelist */
export async function getOpVersionDetailAPI(options: any) {
  return request('/devopsCore/version', {
    method: 'GET',
    params: options,
    b:'detail'
  });
}
/** 版本评论 PUT /devopsCore/servicelist */
export async function getCommentVersionAPI(options: any) {
  return request('/devopsCore/version', {
    method: 'PUT',
    data: options,
    b:'comment'
  });
}
/** 版本修订 PUT /devopsCore/servicelist */
export async function getRevisionVersionAPI(options: any) {
  return request('/devopsCore/version', {
    method: 'PUT',
    data: options,
    b:'revision'
  });
}
/** service 配置 GET /devopsCore/sconf */
export async function getSconfAPI(options: any) {
  return request('/devopsCore/sconf', {
    method: 'GET',
    params: options,
  });
}
/** service 接口 GET /devopsCore/sconf */
export async function getApiAPI(options: any) {
  return request('/devopsCore/api', {
    method: 'GET',
    params: options,
  });
}

