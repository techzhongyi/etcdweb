import request from '@/utils/request';

/** 获取GPS列表 GET /assets/gps */
export async function getGpsList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/assets/gps', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}

/** 创建GPS POST /user/admin/role */
export async function addGps(options: any) {
  return request('/assets/gps', {
    method: 'POST',
    data: options,
  });
}
/** 修改GPS PUT /user/admin/role */
export async function editGps(options: any) {
  return request('/assets/gps', {
    method: 'PUT',
    data: options,
  });
}

/** 删除GPS PUT /user/admin/role */
export async function deleteGps(options: any) {
  return request('/assets/gps', {
    method: 'DELETE',
    params: options,
  });
}
