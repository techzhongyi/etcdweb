import request from '@/utils/request';

/** 获取版本列表 GET /devopsCore/yamlfileprojlist */
export async function getApiDocProjectListAPI(options: any) {
  return request('/devopsCore/yamlfileprojlist', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}

/** 获取文档列表 GET /devopsCore/yamlfile */
export async function getApiDocListAPI(options: any) {
  return request('/devopsCore/yamlfile', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}

/** 获取文档详情 GET /devopsCore/yamlfile */
export async function getApiDocDetailAPI(options: any) {
  return request('/devopsCore/yamlfile', {
    method: 'GET',
    params: options,
    b: 'detail',
  });
}

/** 获取组织列表 GET /devopsCore/organizelist */
export async function getApiDocOrganizationListAPI(options: any) {
  return request('/devopsCore/organizelist', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}
