import request from '@/utils/request';

/** 获取年检记录列表 GET /devops/annual_inspection */
export async function getInsuranceAnnually(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/devops/annual_inspection', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}
/** 获取年检详情 GET /devops/annual_inspection*/
export async function getInsuranceAnnuallyDetail(options: any) {
  return request('/devops/annual_inspection', {
    method: 'GET',
    params: options,
    b: 'detail',
  });
}

/** 新增年检信息 POST /devops/annual_inspection*/
export async function addInspectAnnually(options: any) {
  return request('/devops/annual_inspection', {
    method: 'POST',
    data: options,
  });
}
/** 修改保险信息 PUT /devops/annual_inspection*/
export async function editInspectAnnually(options: any) {
  return request('/devops/annual_inspection', {
    method: 'PUT',
    data: options,
  });
}

/** 删除保险 DELETE /devops/annual_inspection */
export async function deleteInspectAnnually(options: any) {
  return request('/devops/annual_inspection', {
    method: 'DELETE',
    params: options,
  });
}
