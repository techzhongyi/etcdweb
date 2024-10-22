import request from '@/utils/request';

/** 获取应收列表 GET /finance/pay_form */
export async function getPayPormList(options: any) {
  return request('/finance/pay_form', {
    method: 'GET',
    params: options,
    b: 'pay_form_list',
  });
}
/** 获取应付单所属单据列表 GET /finance/pay_form */
export async function getPayReceiptList(options: any) {
  return request('/finance/pay_form', {
    method: 'GET',
    params: options,
    b: 'pay_receipt_list',
  });
}
/** 获取应付单所属单据列表 GET /finance/pay_form */
export async function getPayList(options: any) {
  return request('/finance/pay_form', {
    method: 'GET',
    params: options,
    b: 'pay_list',
  });
}
/**付款 同时生成付款单据关联记录 POST /finance/pay_form */
export async function createPayForm(options: any) {
  return request('/finance/pay_form', {
    method: 'POST',
    data: options,
  });
}
