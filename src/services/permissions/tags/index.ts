import request from '@/utils/request';

/** 获取tags列表 GET /assets/label */
export async function getTagsList(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/assets/label', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}
/** 创建角色 POST /assets/label */
export async function addTags(options: any) {
  return request('/assets/label', {
    method: 'POST',
    data: options,
  });
}

//** 编辑角色 PUT /assets/label */
export async function editTags(options: any) {
  return request('/assets/label', {
    method: 'PUT',
    data: options,
  });
}

/** 删除角色 DELETE /assets/label */
export async function deleteTags(options: any) {
  return request('/assets/label', {
    method: 'DELETE',
    params: options,
  });
}
