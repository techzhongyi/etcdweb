import request from '@/utils/request';

/** 获取保险列表 GET /devops/insurance */
export async function getInsurance(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/devops/insurance', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}
/** 获取保险详情 GET /devops/insurance */
export async function getInsuranceDetail(options: any) {
  return request('/devops/insurance', {
    method: 'GET',
    params: options,
    b: 'detail',
  });
}

/** 新增保险信息 POST /devops/insurance*/
export async function addInsurance(options: any) {
  return request('/devops/insurance', {
    method: 'POST',
    data: options,
  });
}
/** 修改保险信息 PUT /devops/insurance*/
export async function editInsurance(options: any) {
  return request('/devops/insurance', {
    method: 'PUT',
    data: options,
  });
}

/** 删除保险 PUT /devops/insurance */
export async function deleteInsurance(options: any) {
  return request('/devops/insurance', {
    method: 'DELETE',
    params: options,
  });
}
