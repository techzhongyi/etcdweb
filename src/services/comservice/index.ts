

import request from '@/utils/request';

/** 获取服务列表 GET /devopsCore/service */
export async function getServiceListAPI(options: any) {
  return request('/devopsCore/service', {
    method: 'GET',
    params: options,
  });
}
