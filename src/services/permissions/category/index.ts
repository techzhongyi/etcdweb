import request from '@/utils/request';

/** 获取类别列表 GET /assets/category */
export async function getCategoryList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/assets/category', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}

/** 创建类别 POST /user/admin/role */
export async function addCategory(options: any) {
  return request('/assets/category', {
    method: 'POST',
    data: options,
  });
}
/** 修改类别 PUT /user/admin/role */
export async function editCategory(options: any) {
  return request('/assets/category', {
    method: 'PUT',
    data: options,
  });
}

/** 删除类别 PUT /user/admin/role */
export async function deleteCategory(options: any) {
  return request('/assets/category', {
    method: 'DELETE',
    params: options,
  });
}
