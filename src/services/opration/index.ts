import request from '@/utils/request';

/** 获取service列表 GET /devopsCore/servicelist */
export async function getOpServiceListAPI(options: any) {
  return request('/devopsCore/servicelist', {
    method: 'GET',
    params: options,
  });
}
