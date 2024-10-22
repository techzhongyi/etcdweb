import request from '@/utils/request';

/** 获取单车账本列表 GET /finance/assets_accounts */
export async function getBicycleAccountBookList(options: any) {
  return request('/finance/assets_accounts', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}
/** 获取单车账本列表 GET /finance/recv_receipt */
export async function getbicycleAccountBookDetail(options: any) {
  return request('/finance/recv_receipt', {
    method: 'GET',
    params: options,
    b: 'list4assets',
  });
}
