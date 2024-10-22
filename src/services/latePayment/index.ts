import request from '@/utils/request';

/** 获取逾期单据列表 GET /finance/recv_receipt */
export async function getLatePaymentList(options: any) {
  return request('/finance/recv_receipt', {
    method: 'GET',
    params: options,
    b: 'list_late_payment',
  });
}
