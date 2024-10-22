import request from '@/utils/request';

/** 获取回收列表 GET /devops/recycle */
export async function getRecovery(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/devops/recycle', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}
/** 获取回收详情 GET /devops/recycle*/
export async function getRecoveryDetail(options: any) {
  return request('/devops/recycle', {
    method: 'GET',
    params: options,
    b: 'detail',
  });
}

/** 新增回收信息 POST /devops/recycle*/
export async function addRecovery(options: any) {
  return request('/devops/recycle', {
    method: 'POST',
    data: options,
  });
}
/** 修改回收信息 PUT /devops/recycle*/
export async function editRecovery(options: any) {
  return request('/devops/recycle', {
    method: 'PUT',
    data: options,
  });
}
/** 导入回收列表 POST /devops/upload_recycle  */
export async function importRecovery(options: any) {
  return request('/devops/upload_recycle', {
    method: 'POST',
    data: options,
  });
}
/** 删除回收列表 DELETE /devops/recycle*/
export async function deleteRecovery(options: any) {
  return request('/devops/recycle', {
    method: 'DELETE',
    params: options,
  });
}
