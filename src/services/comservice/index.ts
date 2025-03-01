

import request from '@/utils/request';

/** 获取服务列表 GET /devopsCore/service */
export async function getServiceListAPI(options: any) {
  return request('/devopsCore/service', {
    method: 'GET',
    params: options,
  });
}
/** 常链接 应用按钮点击完之后调用接口 GET /devopsCore/service */
export async function getSqlconfirmAPI(options: any) {
  return request('/devopsCore/sqlconfirm', {
    method: 'GET',
    params: options,
  });
}
/** 常链接 应用按钮点击完之后 回调确认接口 GET /devopsCore/service */
export async function finishedSqlconfirmAPI(options: any) {
  return request('/devopsCore/sqlconfirm', {
    method: 'PUT',
    data: options,
  });
}
/** 获取apply 执行结果 GET /devopsCore/lastugp */
export async function getFinishedLastugpAPI(options: any) {
  return request('/devopsCore/lastugp', {
    method: 'GET',
    params: options,
  });
}
/** 获取depoly 执行结果 GET /devopsCore/lastugp */
export async function getDepolyFinishedLastugpAPI(options: any) {
  return request('/devopsCore/webdistlist', {
    method: 'GET',
    params: options,
  });
}
