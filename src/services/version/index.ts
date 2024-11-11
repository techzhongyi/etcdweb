import request from '@/utils/request';

/** 获取版本列表 GET /devopsCore/servicelist */
export async function getOpVersionListAPI(options: any) {
  return request('/devopsCore/version', {
    method: 'GET',
    params: options,
  });
}
