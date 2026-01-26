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
    hideInMenu: true,
    layout: false,
  },
  {
    path: '/opration',
    name: '首页',
    icon: 'FundProjectionScreenOutlined',
    component: './opration',
    hideInMenu: true,
    layout: false,
  },
  {
    path: '/versions',
    name: '版本管理',
    icon: 'SolutionOutlined',
    hideInMenu: true,
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
    hideInMenu: true,
    icon: 'FundProjectionScreenOutlined',
    component: './serviceConfig',
  },
  {
    path: '/configManage',
    name: '服务管理',
    hideInMenu: true,
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
    hideInMenu: true,
    icon: 'FundProjectionScreenOutlined',
    component: './envConfig',
  },
  {
    path: '/log',
    name: '服务日志',
    icon: 'FundProjectionScreenOutlined',
    hideInMenu: true,
    layout: false,
    component: './log',
  },
  {
    path: '/loki-viewer',
    name: 'Loki 日志查看器',
    icon: 'FundProjectionScreenOutlined',
    hideInMenu: true,
    layout: false,
    component: './loki-viewer',
  },
  {
    path: '/apidoc',
    name: 'API 文档',
    icon: 'FundProjectionScreenOutlined',
    hideInMenu: true,
    layout: false,
    component: './apidoc',
  },
  {
    path: '/apidoc/detail',
    name: 'API 文档详情',
    icon: 'FundProjectionScreenOutlined',
    hideInMenu: true,
    layout: false,
    component: './apidoc/detail',
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    component: './404',
  },
];
