import request from '@/utils/request';

/** 获取服务站列表 GET /user/admin/service_site */
export async function getServiceSiteListAPI(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/user/admin/service_site', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}

/** 创建服务站 POST /user/admin/service_site */
export async function addServiceSiteAPI(options: any) {
  return request('/user/admin/service_site', {
    method: 'POST',
    data: options,
  });
}
/** 修改服务站 PUT /user/admin/service_site */
export async function editServiceSiteAPI(options: any) {
  return request('/user/admin/service_site', {
    method: 'PUT',
    data: options,
    b: 'modify',
  });
}

/** 删除服务站 PUT /user/admin/service_site */
export async function deleteServiceSiteAPI(options: any) {
  return request('/user/admin/service_site', {
    method: 'DELETE',
    params: options,
  });
}
