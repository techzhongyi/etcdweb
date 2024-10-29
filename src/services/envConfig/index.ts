import request from '@/utils/request';

/** 获取EnvConfig 配置 GET  /devopsCore/env */
export async function getEnvConfigListAPI(options: any) {
  return request('/devopsCore/env', {
    method: 'GET',
    params: options,
  });
}
/** 修改EnvConfig 配置 PUT  /devopsCore/env */
export async function editEnvConfigAPI(options: any) {
  return request('/devopsCore/env', {
    method: 'PUT',
    data: options,
  });
}
