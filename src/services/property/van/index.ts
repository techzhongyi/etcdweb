import request from '@/utils/request';

/** 获取VAN车列表 GET /assets/asset_van */
export async function getVanList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/assets/asset_van', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}

/** 创建VAN车 POST /assets/asset_van */
export async function addVan(options: any) {
  return request('/assets/asset_van', {
    method: 'POST',
    data: options,
  });
}
/** 修改VAN车 PUT /assets/asset_van */
export async function editVan(options: any) {
  return request('/assets/asset_van', {
    method: 'PUT',
    data: options,
    b: 'modify',
  });
}

/** 删除VAN车 PUT /assets/asset_van */
export async function deleteVan(options: any) {
  return request('/assets/asset_van', {
    method: 'DELETE',
    params: options,
  });
}
/** 修改VAN车 PUT /assets/asset_van */
export async function setVanStatus(options: any) {
  return request('/assets/asset_van', {
    method: 'PUT',
    data: options,
    b: 'modify',
  });
}
/** 批量可交付 PUT /assets/asset_van */
export async function batchDeliveredVan(options: any) {
  return request('/assets/asset_van', {
    method: 'PUT',
    data: options,
    b: 'batch_delivered',
  });
}
