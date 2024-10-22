import request from '@/utils/request';

/** 获取角色列表 GET /user/admin/role */
export async function getRoleList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/user/admin/role', {
    method: 'GET',
    params: options,
  });
}
/** 创建角色 POST /user/admin/role */
export async function addRole(options: any) {
  return request('/user/admin/role', {
    method: 'POST',
    data: options,
  });
}

//** 编辑角色 PUT /user/admin/role */
export async function editRole(options: any) {
  return request('/user/admin/role', {
    method: 'PUT',
    data: options,
  });
}

/** 删除角色 DELETE /user/admin/role */
export async function deleteRole(options: any) {
  return request('/user/admin/role', {
    method: 'DELETE',
    params: options,
  });
}

/** 获取tree列表 GET /user/admin/role */
export async function getResourceList(options: any) {
  return request('/user/admin/resource', {
    method: 'GET',
    params: options,
    b: 'ztree',
  });
}

/** 获取tree及选中列表 GET /user/admin/role */
export async function getSelectedResourceList(options: any) {
  return request('/user/admin/resource', {
    method: 'GET',
    params: options,
    b: 'ztree_sub',
  });
}
