
import request from '@/utils/request';

/** 获取日志列表 GET /devopsCore/logsinflux */
export async function getLogsinfluxListAPI(options: any) {
  return request('/devopsCore/logsinflux', {
    method: 'GET',
    params: options,
  });
}
/** 获取日志列表 GET /devopsCore/logsloki */
export async function getLogsLokiListAPI(options: any) {
  return request('/devopsCore/logsloki', {
    method: 'GET',
    params: options,
    b:'query'
  });
}
/** 获取日志右侧列表 GET /devopsCore/logsloki */
export async function getLogsContextListAPI(options: any) {
  return request('/devopsCore/logsloki', {
    method: 'GET',
    params: options,
    b:'context'
  });
}
