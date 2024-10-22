/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */

let hasAuth = (route: any, roleId?: string) => {
  //  要害：比照route.roles 和 currentUser.roleId 判断是否有权限
  return route.roles ? route.roles.includes(roleId) : true;
};

export default function access(initialState: {
  currentUser?: API.CurrentUser | undefined;
}) {
  const { currentUser } = initialState || {};
  return {
    //admin  supplier  outworker intern
    canAuth: (route: any) => hasAuth(route, currentUser?.access),
  };
}
