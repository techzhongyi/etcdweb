import request from '@/utils/request';

/** 获取财务开票列表 GET /finance/finance_invoice */
export async function getFinanceInvoiceList(options: any) {
  return request('/finance/finance_invoice', {
    method: 'GET',
    params: options,
  });
}
/** 获取应付单所属单据列表 GET /finance/finance_invoice */
export async function getPayReceiptList(options: any) {
  return request('/finance/finance_invoice', {
    method: 'GET',
    params: options,
    b: 'pay_receipt_list',
  });
}
/** 获取应付单所属单据列表 GET /finance/finance_invoice */
export async function getPayList(options: any) {
  return request('/finance/finance_invoice', {
    method: 'GET',
    params: options,
    b: 'pay_list',
  });
}
/**作废 PUT /finance/finance_invoice */
export async function cancellation(options: any) {
  return request('/finance/finance_invoice', {
    method: 'PUT',
    data: options,
    b: 'cancellation',
  });
}
/**开票 PUT /finance/finance_invoice */
export async function createInvoice(options: any) {
  return request('/finance/finance_invoice', {
    method: 'PUT',
    data: options,
    b: 'supplementary',
  });
}
