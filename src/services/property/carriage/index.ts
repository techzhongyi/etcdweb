import request from '@/utils/request';

/** 获取车厢列表 GET /assets/asset_carriage */
export async function getCarriageList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/assets/asset_carriage', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}

/** 创建车厢 POST /assets/asset_carriage */
export async function addCarriage(options: any) {
  return request('/assets/asset_carriage', {
    method: 'POST',
    data: options,
  });
}
/** 修改车厢 PUT /assets/asset_carriage */
export async function editCarriage(options: any) {
  return request('/assets/asset_carriage', {
    method: 'PUT',
    data: options,
    b: 'modify',
  });
}
/** 修改车厢状态 PUT /assets/asset_carriage */
export async function setCarriageStatus(options: any) {
  return request('/assets/asset_carriage', {
    method: 'PUT',
    data: options,
    b: 'modify',
  });
}

/** 删除车厢 PUT /assets/asset_carriage */
export async function deleteCarriage(options: any) {
  return request('/assets/asset_carriage', {
    method: 'DELETE',
    params: options,
  });
}
/** 批量可交付 PUT /assets/asset_carriage */
export async function batchDeliveredCarriage(options: any) {
  return request('/assets/asset_carriage', {
    method: 'PUT',
    data: options,
    b: 'batch_delivered',
  });
}
