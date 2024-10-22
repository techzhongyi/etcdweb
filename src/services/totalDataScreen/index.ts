import request from '@/utils/request';

/** 获取数据 GET /statistics/assets_maintenance4day */
export async function getAssetsMaintenanceAPI(options: any) {
  return request('/statistics/assets_maintenance4day', {
    method: 'GET',
    params: options,
  });
}
/** 获取数据 GET /statistics/user_info */
export async function getuserInfoAPI(options: any) {
  return request('/statistics/user_info', {
    method: 'GET',
    params: options,
    b: 'info',
  });
}
/** 获取告警进行数据 GET /statistics/alert */
export async function getAlertListAPI(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/statistics/alert', {
    method: 'GET',
    params: options,
  });
}
/**最近七天的运营情况  GET /statistics/customer_assets */
export async function getSevenDayOperateAPI(options: any) {
  return request('/statistics/customer_assets', {
    method: 'GET',
    params: options,
    b: 'seven_day_operate',
  });
}
/**车辆行驶里程排行  GET /statistics/customer_assets */
export async function getMileageRankListAPI(options: any) {
  return request('/statistics/customer_assets', {
    method: 'GET',
    params: options,
    b: 'mileage_rank_list',
  });
}
/** 获取车辆信息数据 GET /statistics/user_info */
export async function getCarDetailInfoAPI(options: any) {
  return request('/statistics/user_info', {
    method: 'GET',
    params: options,
    b: 'vin_info',
  });
}
/** 获取车辆列表数据 GET /statistics/user_info */
export async function getAssetsListAPI(options: any) {
  return request('/statistics/user_info', {
    method: 'GET',
    params: options,
    b: 'assets_list',
  });
}
