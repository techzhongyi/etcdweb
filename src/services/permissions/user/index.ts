import request from '@/utils/request';

/** 获取用户列表 GET /user/admin/user */
export async function getUserList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/user/admin/user', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}

/** 新增用户 POST /user/admin/user */
export async function addUser(options: any) {
  return request('/user/admin/user', {
    method: 'POST',
    data: options,
  });
}
/** 修改用户信息 PUT /user/admin/user */
export async function editUser(options: any) {
  return request('/user/admin/user', {
    method: 'PUT',
    data: options,
  });
}

/** 禁用or启用组织 PUT /user/admin/user  */
export async function lockUser(options: any) {
  return request('/user/admin/user ', {
    method: 'PUT',
    data: options,
  });
}

/** 删除用户 PUT /user/admin/user */
export async function deleteUser(options: any) {
  return request('/user/admin/user', {
    method: 'DELETE',
    params: options,
  });
}
