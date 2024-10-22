import request from '@/utils/request';

/** 获取工单列表 GET /work_order/work_order */
export async function getWorkOrderListAPI(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/work_order/work_order', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}
/** 获取工单详情 GET /work_order/work_order_ws */
export async function getWorkOrderDetailAPI(options: any) {
  return request('/work_order/work_order', {
    method: 'GET',
    params: options,
    b: 'detail',
  });
}
/** 获取工单跟进列表 GET /work_order/work_order_ws */
export async function getWorkOrderProcessListAPI(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/work_order/process', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}

/** 创建工单 POST /work_order/work_order */
export async function addWorkOrderAPI(options: any) {
  return request('/work_order/work_order', {
    method: 'POST',
    data: options,
  });
}
/** 修改工单 PUT /work_order/work_order */
export async function editWorkOrderAPI(options: any) {
  return request('/work_order/work_order', {
    method: 'PUT',
    data: options,
  });
}
/** 跟进工单 PUT /work_order/process */
export async function getWorkOrderProcessAPI(options: any) {
  return request('/work_order/process', {
    method: 'POST',
    data: options,
  });
}

/** 删除服务站 PUT /work_order/work_order */
export async function deleteProblemTypeAPI(options: any) {
  return request('/work_order/work_order', {
    method: 'DELETE',
    params: options,
  });
}
