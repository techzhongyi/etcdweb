import request from '@/utils/request';

/** 获取挂车列表 GET /assets/user_defined_asset_trailer */
export async function getUserTrailerListAPI(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/assets/user_defined_asset_trailer', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}

/** 创建挂车 POST /user/admin/role */
export async function addTrailer(options: any) {
  return request('/assets/user_defined_asset_trailer', {
    method: 'POST',
    data: options,
  });
}
/** 修改挂车 PUT /user/admin/role */
export async function editTrailer(options: any) {
  return request('/assets/user_defined_asset_trailer', {
    method: 'PUT',
    data: options,
    b: 'modify',
  });
}
/** 修改挂车状态 PUT /user/admin/role */
export async function setTrailerStatus(options: any) {
  return request('/assets/user_defined_asset_trailer', {
    method: 'PUT',
    data: options,
    b: 'modify',
  });
}

/** 删除挂车 PUT /user/admin/role */
export async function deleteTrailer(options: any) {
  return request('/assets/user_defined_asset_trailer', {
    method: 'DELETE',
    params: options,
  });
}
/** 批量可交付 PUT /assets/asset_carriage */
export async function batchDeliveredTrailer(options: any) {
  return request('/assets/user_defined_asset_trailer', {
    method: 'PUT',
    data: options,
    b: 'batch_delivered',
  });
}
