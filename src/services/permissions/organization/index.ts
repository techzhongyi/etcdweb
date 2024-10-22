import request from '@/utils/request';

/** 获取组织列表 GET /user/admin/depart */
export async function getDepartList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/user/admin/depart', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}

/** 新增组织 POST /user/admin/depart */
export async function addDepart(options: any) {
  return request('/user/admin/depart', {
    method: 'POST',
    data: options,
  });
}
/** 修改组织信息 PUT /user/admin/depart */
export async function editDepart(options: any) {
  return request('/user/admin/depart', {
    method: 'PUT',
    data: options,
  });
}
/** 禁用or启用组织 PUT /user/admin/depart */
export async function lockDepart(options: any) {
  return request('/user/admin/depart', {
    method: 'PUT',
    data: options,
  });
}

/** 删除组织 PUT /user/admin/depart */
export async function deleteDepart(options: any) {
  return request('/user/admin/depart', {
    method: 'DELETE',
    params: options,
  });
}
