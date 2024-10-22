import request from '@/utils/request';

/** 获取开票列表 GET /finance/seller_invoice */
export async function getSellerInvoiceList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/finance/seller_invoice', {
    method: 'GET',
    params: options,
    b: 'order_invoice_list',
  });
}
/** 获取开票列表 申请开票列表 GET /finance/seller_invoice */
export async function getOrderInvoiceList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/finance/seller_invoice', {
    method: 'GET',
    params: options,
    b: 'order_invoice_list',
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
/** 一个订单 可开发票的 已核销的 所有单据列表 GET /finance/seller_invoice */
export async function getAvailableReceiptList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/finance/seller_invoice', {
    method: 'GET',
    params: options,
    b: 'available_receipt_list',
  });
}
/** 申请开票 POST /finance/seller_invoice */
export async function ApplyAvailableReceipt(options: any) {
  return request('/finance/seller_invoice', {
    method: 'POST',
    data: options,
  });
}
/** 申请开票 POST /finance/seller_invoice */
export async function getSellerInvoicedList(options: any) {
  return request('/finance/seller_invoice', {
    method: 'GET',
    params: options,
    b: 'invoiced_list',
  });
}
/**  单据列表 POST /finance/seller_invoice */
export async function getReceiptList(options: any) {
  return request('/finance/seller_invoice', {
    method: 'GET',
    params: options,
    b: 'receipt_list',
  });
}
