import request from '@/utils/request';

/** 获取车辆运营数据列表 GET /statistics/dc4day_data */
export async function getOperateList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/statistics/dc_data', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}
/** 获取车辆运营数据明细 GET /statistics/dc4day_data */
export async function getOperateRecordeList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/statistics/dc4day_data', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}
