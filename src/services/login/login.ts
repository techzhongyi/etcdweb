import request from '@/utils/request';

/** 登录接口 POST /devopsCore/login */
export async function login(
  body: API.LoginParams,
  options?: Record<string, any>,
) {
  const data = 'p=' + encodeURIComponent(JSON.stringify(body));
  return request<API.LoginResult>('/devopsCore/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data,
    ...(options || {}),
  });
}

/** 登出接口 PUT /user/admin/user*/
export async function loginout(options: any) {
  return request('/user/admin/logout', {
    method: 'PUT',
    data: options,
  });
}

/** 获取当前的动态路由 GET /user/admin/resource */
export async function getResource(options: any) {
  return request('/user/admin/resource', {
    method: 'GET',
    params: options,
    b: 'router',
  });
}
/** 获取当前的动态路由 GET /user/admin/resource */
export async function getsms(options: any) {
  return request('/user/sms', {
    method: 'POST',
    data: options,
  });
}

// /** 获取当前的用户 GET /currentUser */
// export async function userInfo(options?: Record<string, any>) {
//   return request<{
//     data: API.CurrentUser;
//   }>('/user/admin/resource', {
//     method: 'GET',
//     ...(options || {}),
//   });
// }
