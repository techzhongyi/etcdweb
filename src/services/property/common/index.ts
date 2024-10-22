import request from '@/utils/request';

/** 获取所有资产列表 GET /assets/asset_all */
export async function getAllAssetList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/assets/asset_all', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}
/** 获取资产详情 GET /assets/asset_all */
export async function getAssetDetail(options: any) {
  return request('/assets/asset_all', {
    method: 'GET',
    params: options,
    b: 'detail',
  });
}
