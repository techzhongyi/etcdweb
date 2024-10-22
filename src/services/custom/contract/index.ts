import request from '@/utils/request';

/** 获取合同列表 GET /order/contract */
export async function getContractList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/order/contract', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}
/** 新增合同 POST /order/contract */
export async function addContract(options: any) {
  return request('/order/contract', {
    method: 'POST',
    data: options,
  });
}
/** 编辑合同 PUT /order/contract */
export async function editContract(options: any) {
  return request('/order/contract', {
    method: 'PUT',
    data: options,
  });
}
/** 删除合同 DELETE /order/contract */
export async function deleteContract(options: any) {
  return request('/order/contract', {
    method: 'DELETE',
    params: options,
  });
}
