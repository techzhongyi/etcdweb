import request from '@/utils/request';

/** 获取问题类型列表 GET /user/problem_type */
export async function getProblemTypeListAPI(options: {
  $tableLimit: { page: any; count: any };
}) {
  return request('/user/problem_type', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}

/** 创建问题类型 POST /user/problem_type */
export async function addProblemTypeAPI(options: any) {
  return request('/user/problem_type', {
    method: 'POST',
    data: options,
  });
}
/** 修改问题类型 PUT /user/problem_type */
export async function editProblemTypeAPI(options: any) {
  return request('/user/problem_type', {
    method: 'PUT',
    data: options,
  });
}

/** 删除问题类型 PUT /user/problem_type */
export async function deleteProblemTypeAPI(options: any) {
  return request('/user/problem_type', {
    method: 'DELETE',
    params: options,
  });
}
