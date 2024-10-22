import request from '@/utils/request';

/**  GET /statistics/assets_maintenance */
export async function getAssetsMaintenance(options: any) {
  return request('/statistics/assets_maintenance', {
    method: 'GET',
    params: options,
  });
}
/**  GET /statistics/screen */
export async function getLeftScreen(options: any) {
  return request('/statistics/screen', {
    method: 'GET',
    params: options,
    b: 'left',
  });
}
/**  GET /statistics/screen */
export async function getDownScreen(options: any) {
  return request('/statistics/screen', {
    method: 'GET',
    params: options,
    b: 'down',
  });
}
/**地图  GET /statistics/devops_data */
export async function getDevopsData(options: any) {
  return request('/statistics/devops_data', {
    method: 'GET',
    params: options,
  });
}

/**地图  GET /statistics/customer_assets */
export async function getCustomerData(options: any) {
  return request('/statistics/customer_assets', {
    method: 'GET',
    params: options,
    b: 'distribution_list',
  });
}
