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
  // {
  //   path: '/home',
  //   name: '概览',
  //   icon: 'FundProjectionScreenOutlined',
  //   routes: [
  //     {
  //       path: '/home/overview',
  //       name: '系统概览',
  //       component: './Dashboard',
  //     },
  //     {
  //       path: '/home/dataScreen',
  //       name: '数据大屏',
  //       layout: false,
  //       component: './dataScreen',
  //     },
  //     {
  //       path: '/home/totalDataScreen',
  //       name: '系统大屏',
  //       layout: false,
  //       component: './totalDataScreen',
  //     },
  //     { path: '/home', redirect: '/home/overview' },
  //   ],
  // },

  {
    path: '/configManage',
    name: '配置管理',
    icon: 'SolutionOutlined',
    routes: [
      {
        path: '/configManage/upgrades',
        name: '待升级配置',
        component: './configManage/upgrades',
      },
      // {
      //   path: '/workOrder/status',
      //   name: '工单状态',
      //   component: './workOrder/workStatus',
      //   hideInMenu: true,
      // },
      // {
      //   path: '/workOrder/localstatus',
      //   name: '工单状态',
      //   component: './workOrder/localWorkStatus',
      //   hideInMenu: true,
      // },
      { path: '/configManage', redirect: '/configManage/upgrades' },
    ],
  },
  // {
  //   path: '/serviceProviders',
  //   name: '供应商管理',
  //   icon: 'ReconciliationOutlined',
  //   routes: [
  //     {
  //       path: '/serviceProviders/repairShop',
  //       name: '修理厂供应商管理',
  //       component: './serviceProviders/repairShop/list',
  //     },
  //     {
  //       path: '/serviceProviders/gpsShop',
  //       name: '定位设备供应商管理',
  //       component: './serviceProviders/gpsShop/list',
  //     },
  //     { path: '/serviceProviders', redirect: '/serviceProviders/repairShop' },
  //   ],
  // },
  // {
  //   path: '/permissions',
  //   name: '系统管理',
  //   icon: 'SettingOutlined',
  //   routes: [
  //     {
  //       path: '/permissions/category',
  //       name: '类别管理',
  //       component: './permissions/category/list',
  //     },
  //     {
  //       path: '/permissions/tag',
  //       name: '标签管理',
  //       component: './permissions/tag/list',
  //     },
  //     {
  //       path: '/permissions/thresholdAlarm',
  //       name: '阈值报警配置',
  //       component: './permissions/thresholdAlarm/list',
  //       hideInMenu: true,
  //     },
  //     {
  //       path: '/permissions/organization',
  //       name: '组织管理',
  //       component: './permissions/organization/list',
  //     },
  //     {
  //       path: '/permissions/user',
  //       name: '用户管理',
  //       component: './permissions/user',
  //     },
  //     {
  //       path: '/permissions/account',
  //       name: '账号管理',
  //       component: './permissions/account',
  //     },
  //     {
  //       path: '/permissions/role',
  //       name: '角色管理',
  //       component: './permissions/role',
  //     },
  //     { path: '/permissions', redirect: '/permissions/role' },
  //   ],
  // },
  {
    path: '/',
    redirect: '/configManage',
  },
  {
    component: './404',
  },
];
