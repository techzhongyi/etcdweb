import request from '@/utils/request';

/** 获取违章列表 GET /devops/violation */
export async function getRegulations(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/devops/violation', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}
/** 获取违章详情 GET /devops/violation*/
export async function getRegulationsDetail(options: any) {
  return request('/devops/violation', {
    method: 'GET',
    params: options,
    b: 'detail',
  });
}

/** 新增违章信息 POST /devops/violation*/
export async function addRegulations(options: any) {
  return request('/devops/violation', {
    method: 'POST',
    data: options,
  });
}
/** 修改违章信息 PUT /devops/violation*/
export async function editRegulations(options: any) {
  return request('/devops/violation', {
    method: 'PUT',
    data: options,
  });
}
/** 删除违章信息 DELETE /devops/violation */
export async function deleteRegulations(options: any) {
  return request('/devops/violation', {
    method: 'DELETE',
    params: options,
  });
}
/** 导入违章列表 POST /devops/upload_violation */
export async function importRegulations(options: any) {
  return request('/devops/upload_violation', {
    method: 'POST',
    data: options,
  });
}
