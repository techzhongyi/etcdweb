import request from '@/utils/request';

/** 获取结算单列表 GET /devops/order_assets */
export async function getDamagePrepareListList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/devops/order_assets', {
    method: 'GET',
    params: options,
    b: 'damage_prepare_list',
  });
}
/** 获取定损记录列表 GET /devops/order_assets */
export async function getDamageRecordList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/devops/damage_record', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}
/** 运营定损 PUT /devops/order_assets */
export async function getOrderAssets(options: any) {
  return request('/devops/order_assets', {
    method: 'PUT',
    data: options,
    b: 'damage',
  });
}
/** 运营结算 PUT /devops/order_assets */
export async function getSettle(options: any) {
  return request('/devops/order_assets', {
    method: 'GET',
    params: options,
    b: 'settle',
  });
}
/** 运营置为可交付 PUT /devops/order_assets */
export async function setDeliverable(options: any) {
  return request('/devops/order_assets', {
    method: 'PUT',
    data: options,
    b: 'deliverable',
  });
}
/** 获取所有资产结算单的单据 GET /finance/recv_receipt */
export async function getList4assetsList(options: any) {
  return request('/finance/recv_receipt', {
    method: 'GET',
    params: options,
    b: 'list4assets',
  });
}
