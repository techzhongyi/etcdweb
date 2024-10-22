import request from '@/utils/request';

/** 获取发车单列表 GET /devops/send_form */
export async function getSendFormList(options: any) {
  return request('/devops/send_form', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}
/** 运营配车 GET /devops/order_assets*/
export async function configDevopsOrderAssets(options: any) {
  return request('/devops/order_assets', {
    method: 'GET',
    params: options,
    b: 'deploy',
  });
}
/** 运营发车 GET /devops/order_assets*/
export async function sendDevopsOrderAssets(options: any) {
  return request('/devops/order_assets', {
    method: 'GET',
    params: options,
    b: 'send',
  });
}
/** 运营取消发车 GET /devops/order_assets*/
export async function cancelSendDevopsOrderAssets(options: any) {
  return request('/devops/order_assets', {
    method: 'GET',
    params: options,
    b: 'cancel_send',
  });
}
/** 运营移除发车 PUT /devops/order_assets*/
export async function removeOrderAssets(options: any) {
  return request('/devops/order_assets', {
    method: 'PUT',
    data: options,
    b: 'remove',
  });
}
/** 运营全部发车 GET /devops/order_assets*/
export async function sendAllDevopsOrderAssets(options: any) {
  return request('/devops/order_assets', {
    method: 'GET',
    params: options,
    b: 'send_all',
  });
}

/** 新增维修信息 POST /devops/send_form*/
export async function addMaintenance(options: any) {
  return request('/devops/send_form', {
    method: 'POST',
    data: options,
  });
}
/** 修改维修信息 PUT /devops/send_form*/
export async function editMaintenance(options: any) {
  return request('/devops/send_form', {
    method: 'PUT',
    data: options,
  });
}
/** 根据资产编号 获取对应信息 PUT /devops/order_assets*/
export async function getorderDetail(options: any) {
  return request('/devops/order_assets', {
    method: 'GET',
    params: options,
    b: 'assets_info_4repair',
  });
}
