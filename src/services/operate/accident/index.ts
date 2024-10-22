import request from '@/utils/request';

/** 获取出险列表 GET /devops/out_of_insurance */
export async function getOutOfInsuranceList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/devops/out_of_insurance', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}
/** 获取出险详情 GET /devops/out_of_insurance */
export async function getInsuranceDetail(options: any) {
  return request('/devops/out_of_insurance', {
    method: 'GET',
    params: options,
    b: 'detail',
  });
}
/** 导入出险列表 POST /devops/upload_out_of_insurance */
export async function importInsurance(options: any) {
  return request('/devops/upload_out_of_insurance', {
    method: 'POST',
    data: options,
  });
}

/** 新增出险信息 POST /devops/out_of_insurance*/
export async function addOutOfInsurance(options: any) {
  return request('/devops/out_of_insurance', {
    method: 'POST',
    data: options,
  });
}
/** 修改出险信息 PUT /devops/out_of_insurance*/
export async function editOutOfInsurance(options: any) {
  return request('/devops/out_of_insurance', {
    method: 'PUT',
    data: options,
  });
}
/** 删除出险列表 DELETE /devops/out_of_insurance */
export async function deleteOutOfInsuranceList(options: any) {
  return request('/devops/out_of_insurance', {
    method: 'DELETE',
    params: options,
  });
}
