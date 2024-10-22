import request from '@/utils/request';

/** 获取修理厂供应商列表 GET /user/admin/provider_repair */
export async function getRepairShop(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/user/admin/provider_repair', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}
/** 新增修理厂供应商 POST /user/admin/provider_repair */
export async function addRepairShop(options: any) {
  return request('/user/admin/provider_repair', {
    method: 'POST',
    data: options,
  });
}

//** 编辑修理厂供应商  PUT /user/admin/provider_repair */
export async function editRepairShop(options: any) {
  return request('/user/admin/provider_repair', {
    method: 'PUT',
    data: options,
  });
}

/** 删除修理厂供应商 DELETE /user/admin/provider_repair*/
export async function deleteRepairShop(options: any) {
  return request('/user/admin/provider_repair', {
    method: 'DELETE',
    params: options,
  });
}

/** 修理厂供应商详情 get /user/admin/provider_repair*/
export async function getRepairShopDetail(options: any) {
  return request('/user/admin/provider_repair', {
    method: 'GET',
    params: options,
    b: 'detail',
  });
}
