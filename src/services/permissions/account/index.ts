import request from '@/utils/request';

/** 获取账号列表 GET /user/admin/account */
export async function getAccountList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/user/admin/account', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}

/** 创建账号 POST /user/admin/role */
export async function addAccount(options: any) {
  return request('/user/admin/account', {
    method: 'POST',
    data: options,
  });
}
/** 修改账号 PUT /user/admin/role */
export async function editAccount(options: any) {
  return request('/user/admin/account', {
    method: 'PUT',
    data: options,
  });
}

/** 禁用启用账号 PUT /user/admin/role */
export async function lockAccount(options: any) {
  return request('/user/admin/account', {
    method: 'PUT',
    data: options,
  });
}
/** 删除账号 PUT /user/admin/role */
export async function deleteAccount(options: any) {
  return request('/user/admin/account', {
    method: 'DELETE',
    params: options,
  });
}
