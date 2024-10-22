import request from '@/utils/request';

/** 获取定损列表 GET /devops/damage_record */
export async function getAssessment(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/devops/damage_record', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}
/** 导入定损列表 POST /devops/upload_damage_record */
export async function importAssessment(options: any) {
  return request('/devops/upload_damage_record', {
    method: 'POST',
    data: options,
  });
}
/** 修改定损金额 Put /devops/damage_record */
export async function editAssessment(options: any) {
  return request('/devops/damage_record', {
    method: 'PUT',
    data: options,
  });
}
/** 获取定损详情 GET /devops/damage_record*/
export async function getAssessmentDetail(options: any) {
  return request('/devops/damage_record', {
    method: 'GET',
    params: options,
    b: 'detail',
  });
}
/** 删除定损 DELETE /devops/damage_record*/
export async function deleteAssessmentDetail(options: any) {
  return request('/devops/damage_record', {
    method: 'DELETE',
    params: options,
  });
}
