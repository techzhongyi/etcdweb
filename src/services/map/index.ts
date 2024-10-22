import request from '@/utils/request';

/** 获取资产下的所有gps列表 GET /assets/asset_loc */
export async function getAssetLocationList(options: any) {
  return request('/assets/asset_loc', {
    method: 'GET',
    params: options,
    b: 'list4gps',
  });
}
/** 获取资产下的所有gps-获取资产详情 GET /assets/asset_loc */
export async function getAssetLocationDetail(options: any) {
  return request('/assets/asset_loc', {
    method: 'GET',
    params: options,
    b: 'detail4gps',
  });
}
/** 查看tbox定位 GET /devops/location */
export async function getDevopsLocation(options: any) {
  return request('/devops/location', {
    method: 'GET',
    params: options,
    b: 'vin_point',
  });
}
/** 查看gps定位 GET /devops/location */
export async function getSnLocation(options: any) {
  return request('/devops/location', {
    method: 'GET',
    params: options,
    b: 'sn_point',
  });
}
/** 查看tbox路径 GET /devops/location */
export async function getVinPath(options: any) {
  return request('/devops/location', {
    method: 'GET',
    params: options,
    b: 'vin_path',
  });
}
/** 查看查看gps路径 GET /devops/location */
export async function getSnPath(options: any) {
  return request('/devops/location', {
    method: 'GET',
    params: options,
    b: 'sn_path',
  });
}
/** 查看地图上所有的车 GET /devops/location */
export async function getMarkerPoint(options: any) {
  return request('/assets/assets_list4loc', {
    method: 'GET',
    params: options,
    b: 'list4loc',
  });
}
