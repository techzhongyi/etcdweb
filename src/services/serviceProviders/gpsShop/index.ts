import request from '@/utils/request';

/** 获取GPS供应商列表 GET /user/admin/provider_gps */
export async function getGpsShopList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/user/admin/provider_gps', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}
/** 新增GPS供应商 POST /user/admin/provider_gps */
export async function addGpsShop(options: any) {
  return request('/user/admin/provider_gps', {
    method: 'POST',
    data: options,
  });
}

//** 编辑GPS供应商  PUT /user/admin/provider_gps */
export async function editGpsShop(options: any) {
  return request('/user/admin/provider_gps', {
    method: 'PUT',
    data: options,
  });
}

/** 删除GPS供应商 DELETE /user/admin/provider_gps*/
export async function deleteGpsShop(options: any) {
  return request('/user/admin/provider_gps', {
    method: 'DELETE',
    params: options,
  });
}

/** 供应商详情 GET /user/admin/provider_gps*/
export async function repairGpsShop(options: any) {
  return request('/user/admin/provider_gps', {
    method: 'GET',
    params: options,
  });
}
