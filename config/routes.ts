export default [
  // 首页  登陆页面
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
          { path: '/user', redirect: '/user/login' },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/home',
    name: '首页',
    icon: 'FundProjectionScreenOutlined',
    component: './home',
  },
  {
    path: '/versions',
    name: '版本管理',
    icon: 'SolutionOutlined',
    routes: [
      {
        path: '/versions/list',
        name: '版本列表',
        component: './versions/list',
      },
      { path: '/versions', redirect: '/versions/list' },
    ],
  },
  {
    path: '/serviceConfig',
    name: '全部服务',
    icon: 'FundProjectionScreenOutlined',
    component: './serviceConfig',
  },
  {
    path: '/configManage',
    name: '服务管理',
    icon: 'SolutionOutlined',
    routes: [
      {
        path: '/configManage/upgrades',
        name: '待升级服务',
        component: './configManage/upgrades',
      },

      { path: '/configManage', redirect: '/configManage/upgrades' },
    ],
  },
  {
    path: '/env',
    name: 'ENV配置',
    icon: 'FundProjectionScreenOutlined',
    component: './envConfig',
  },
  {
    path: '/log',
    name: '服务日志',
    icon: 'FundProjectionScreenOutlined',
    component: './log',
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    component: './404',
  },
];
