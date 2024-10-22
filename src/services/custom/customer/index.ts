import request from '@/utils/request';

/** 获取客户列表 GET /user/admin/customer */
export async function getCustomerList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/user/admin/customer', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}
/** 获取客户详情 GET /user/admin/customer */
export async function getCustomerDetail(options: any) {
  return request('/user/admin/customer', {
    method: 'GET',
    params: options,
    b: 'detail',
  });
}
/** 新增客户 POST /user/admin/customer */
export async function addCustomer(options: any) {
  return request('/user/admin/customer', {
    method: 'POST',
    data: options,
  });
}

//** 编辑客户  PUT /user/admin/customer */
export async function editCustomer(options: any) {
  return request('/user/admin/customer', {
    method: 'PUT',
    data: options,
  });
}
/** 获取客户已租赁资产列表 GET /devops/order_assets */
export async function getCustomerLeaseProperty(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/devops/order_assets', {
    method: 'GET',
    params: options,
    b: 'user_assets',
  });
}
