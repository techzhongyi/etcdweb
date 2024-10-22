import request from '@/utils/request';

/** 获取轻卡列表 GET /assets/asset_light */
export async function getLightList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/assets/asset_light', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}

/** 创建轻卡 POST /assets/asset_light */
export async function addLight(options: any) {
  return request('/assets/asset_light', {
    method: 'POST',
    data: options,
  });
}
/** 修改轻卡 PUT /assets/asset_light */
export async function editLight(options: any) {
  return request('/assets/asset_light', {
    method: 'PUT',
    data: options,
    b: 'modify',
  });
}

/** 删除轻卡 PUT /assets/asset_light */
export async function deleteLight(options: any) {
  return request('/assets/asset_light', {
    method: 'DELETE',
    params: options,
  });
}
/** 置为可交付 PUT /assets/asset_light */
export async function setLightStatus(options: any) {
  return request('/assets/asset_light', {
    method: 'PUT',
    data: options,
    b: 'modify',
  });
}
/** 批量可交付 PUT /assets/asset_carriage */
export async function batchDeliveredLight(options: any) {
  return request('/assets/asset_light', {
    method: 'PUT',
    data: options,
    b: 'batch_delivered',
  });
}
