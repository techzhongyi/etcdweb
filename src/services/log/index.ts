
import request from '@/utils/request';

/** 获取日志列表 GET /devopsCore/logsinflux */
export async function getLogsinfluxListAPI(options: any) {
  return request('/devopsCore/logsinflux', {
    method: 'GET',
    params: options,
  });
}
