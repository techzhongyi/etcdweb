import request from '@/utils/request';

/** 获取维修列表 GET /devops/repair */
export async function getMaintenance(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/devops/repair', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}
/** 获取维修详情 GET /devops/repair*/
export async function getMaintenanceDetail(options: any) {
  return request('/devops/repair', {
    method: 'GET',
    params: options,
    b: 'detail',
  });
}

/** 新增维修信息 POST /devops/repair*/
export async function addMaintenance(options: any) {
  return request('/devops/repair', {
    method: 'POST',
    data: options,
  });
}
/** 修改维修信息 PUT /devops/repair*/
export async function editMaintenance(options: any) {
  return request('/devops/repair', {
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
/** 导入维修列表 POST /devops/upload_repair   */
export async function importMaintenance(options: any) {
  return request('/devops/upload_repair ', {
    method: 'POST',
    data: options,
  });
}
/**  删除 DELETE /devops/upload_repair*/
export async function deleteMaintenance(options: any) {
  return request('/devops/repair', {
    method: 'DELETE',
    params: options,
  });
}
