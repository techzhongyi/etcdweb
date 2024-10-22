import request from '@/utils/request';

/** 获取重卡列表 GET /assets/asset_heavy */
export async function getHeavyList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/assets/asset_heavy', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}

/** 创建重卡 POST /assets/asset_heavy */
export async function addHeavy(options: any) {
  return request('/assets/asset_heavy', {
    method: 'POST',
    data: options,
  });
}
/** 修改重卡 PUT /assets/asset_heavy */
export async function editHeavy(options: any) {
  return request('/assets/asset_heavy', {
    method: 'PUT',
    data: options,
    b: 'modify',
  });
}
/** 置为可交付 PUT /assets/asset_heavy */
export async function setStatus(options: any) {
  return request('/assets/asset_heavy', {
    method: 'PUT',
    data: options,
    b: 'modify',
  });
}

/** 删除重卡 DELETE /assets/asset_heavy */
export async function deleteHeavy(options: any) {
  return request('/assets/asset_heavy', {
    method: 'DELETE',
    params: options,
  });
}
/** 导入数据 轻卡 重卡 POST /assets/load_assets */
export async function importHeavy(options: any) {
  return request('/assets/load_assets', {
    method: 'POST',
    data: options,
  });
}
/** 导入数据 van车 POST /assets/upload_assets_van */
export async function importVan(options: any) {
  return request('/assets/upload_assets_van', {
    method: 'POST',
    data: options,
  });
}
/** 导入数据 车厢 POST /assets/upload_assets_carriage */
export async function importCarriage(options: any) {
  return request('/assets/upload_assets_carriage', {
    method: 'POST',
    data: options,
  });
}
/** 导入数据 挂车 POST /assets/upload_assets_mounted */
export async function importMounted(options: any) {
  return request('/assets/upload_assets_mounted', {
    method: 'POST',
    data: options,
  });
}
/** 一键置为可交付 PUT /assets/asset_heavy */
export async function batchDeliveredHeavy(options: any) {
  return request('/assets/asset_heavy', {
    method: 'PUT',
    data: options,
    b: 'batch_delivered',
  });
}
