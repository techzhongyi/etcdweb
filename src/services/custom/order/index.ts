import request from '@/utils/request';

/** 获取租赁订单列表 GET /order/order */
export async function getLeaseList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/order/order', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}
/** 生成租金计划 GET /order/order */
export async function getRentplanList(options: any) {
  return request('/order/order', {
    method: 'GET',
    params: options,
    b: 'rent_plan',
  });
}
/** 订单详情 GET /order/order */
export async function getOrderDetail(options: any) {
  return request('/order/order', {
    method: 'GET',
    params: options,
    b: 'detail',
  });
}
/** 新增租赁订单 POST /order/order */
export async function oprateLeaseOrder(options: any) {
  return request('/order/order', {
    method: 'POST',
    data: options,
    b: 'draft',
  });
}
/** 租赁订单作废 POST /order/order */
export async function oprateOrderInvalid(options: any) {
  return request('/order/order', {
    method: 'POST',
    data: options,
    b: 'invalid',
  });
}

//** 提交财务审核  PUT /order/order */
export async function submitOrder(options: any) {
  return request('/order/order', {
    method: 'GET',
    params: options,
    b: 'commit',
  });
}

/** 获取应收单-申请核销应收单据列表 GET /finance/recv_receipt */
export async function getRecvPeceiptList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/finance/recv_receipt', {
    method: 'GET',
    params: options,
    b: 'list4order',
  });
}
/** 获取应收单-申请核销应收单据列表 GET /finance/recv_form */
export async function getRecvForm(options: any) {
  return request('/finance/recv_form', {
    method: 'POST',
    data: options,
  });
}
/** 获取应收单-当月单据列表 GET /finance/recv_receipt */
export async function getMonthRecvList(options: any) {
  return request('/finance/recv_receipt', {
    method: 'GET',
    params: options,
    b: 'list4month',
  });
}
/** 获取订单剩余未核销单据列表 GET /finance/recv_receipt */
export async function getRemainRecvList(options: any) {
  return request('/finance/recv_receipt', {
    method: 'GET',
    params: options,
    b: 'list4remain',
  });
}

/** 删除对冲单 DELETE /finance/recv_receipt */
export async function deleteRecvReceipt(options: any) {
  return request('/finance/recv_receipt', {
    method: 'DELETE',
    params: options,
  });
}
/** 创建对冲单 POST /finance/recv_receipt */
export async function createRecvReceipt(options: any) {
  return request('/finance/recv_receipt', {
    method: 'POST',
    data: options,
  });
}
/** 获取带租金的资产列表 POST /devops/order_assets */
export async function getOrderAssetsInRentList(options: any) {
  return request('/devops/order_assets', {
    method: 'GET',
    params: options,
    b: 'order_assets_in_rent',
  });
}
