import request from '@/utils/request';

/** 获取应收列表 GET /finance/recv_form */
export async function getRecvFormList(options: any) {
  return request('/finance/recv_form', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}
/** 核销 GET /finance/confirm */
export async function getConfirm(options: any) {
  return request('/finance/confirm', {
    method: 'GET',
    params: options,
  });
}
/** 应付单所属单据列表 GET /finance/recv_form */
export async function getPayForm(options: any) {
  return request('/finance/pay_form', {
    method: 'GET',
    params: options,
    b: 'pay_receipt_list',
  });
}
/** 应收单所属单据列表 GET /finance/recv_form */
export async function getRecvReceiptList(options: any) {
  return request('/finance/recv_receipt', {
    method: 'GET',
    params: options,
    b: 'list4recv_form',
  });
}
