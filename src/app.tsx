import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { Link } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import logo from '../public/icons/logo.png';
import logo1 from '../public/icons/logo1.png';
import { getStorage } from './utils/storage';
import { Button, Result } from 'antd';
import { getResource } from './services/login/login';
import HeaderContent from './components/HeaderContent';
import { handleIconAndComponent } from './handleIconAndComponent';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

let path;
const backToHome = () => {
  if (getStorage('user_info')) {
    path = '/configManage';
  } else {
    path = '/user/login';
  }
  history.push(path);
};

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  collapsed?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  // if (getStorage('user_info')) {
  //   if (history.location.pathname.includes(loginPath)) {
  //     backToHome();
  //   }
  // }
  const fetchUserInfo = async () => {
    // console.log(getStorage('user_info'))
    if (getStorage('user_info')) {
      return getStorage('user_info');
    } else {
      history.push(loginPath);
    }
    // try {
    //   if (getStorage('user_info')) {
    //     const {
    //       data: { router },
    //     } = await getResource({});
    //     const menus = router.map((item: any) => {
    //       return {
    //         path: item.parent.id,
    //         name: item.parent.name,
    //         iconName: item.parent.icon,
    //         routes: item.children.map((item_: any) => {
    //           return {
    //             path: item_.id,
    //             name: item_.page_name,
    //             hideInMenu: item_.hide_in_menu,
    //             component: item_.page_path,
    //           };
    //         }).concat(
    //           { path: item.parent.id, redirect: item.children[0].id },
    //         ),
    //       };
    //     });
    //     return { menus, ...getStorage('user_info') };
    //   } else {
    //     history.push(loginPath);
    //   }
    // } catch (error) {
    //   history.push(loginPath);
    // }
    // return undefined;
  };
  // 如果是登录页面，不执行

  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  const onCollapse = (collapsed: boolean): void => {
    setInitialState({ ...initialState, collapsed }).then();
  };
  const { currentUser } = initialState || {};
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    logo,
    title: '',
    footerRender: () => <Footer />,
    onMenuHeaderClick: () => {
      // history.push('/home');
    },
    // breadcrumbRender: (route) => {
    //   const route_ = route?.map(item => {
    //     return {
    //       breadcrumbName: item.breadcrumbName
    //     }
    //   })
    //   return route_

    // },
    // headerContentRender: () => (
    //   <HeaderContent collapse={initialState?.collapsed} onCollapse={onCollapse} />
    // ),
    // collapsedButtonRender: false,
    // // 指定配置collapsed
    // collapsed: initialState?.collapsed,
    // // 菜单的折叠收起事件
    // onCollapse: onCollapse,
    onPageChange: () => {
      const { location } = history;
      window.scrollTo(0, 0);
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    // menuDataRender: () => {
    //   const resMenuData = initialState?.currentUser?.menus || [];
    //   const menuDataIcon = handleIconAndComponent(resMenuData);
    //   const data = [...(menuDataIcon || [])];
    //   return data;
    // },
    // // 二级icon
    // menuItemRender: (menuItemProps, defaultDom) => {
    //   if (menuItemProps.isUrl || !menuItemProps.path) {
    //     return defaultDom;
    //   }
    //   return (
    //     <Link to={menuItemProps.path}>
    //       {menuItemProps.pro_layout_parentKeys &&
    //         menuItemProps.pro_layout_parentKeys.length > 0 &&
    //         menuItemProps.icon}
    //       {defaultDom}
    //     </Link>
    //   );
    // },
    waterMarkProps: {
      content: '沂威售后服务站平台-' + currentUser?.name,
      // content: '沂威售后服务站平台'
    },
    links: isDev ? [] : [],
    menuHeaderRender: () => {
      if (initialState?.collapsed == true) {
        return <img src={logo1} alt="" />;
      } else {
        return <img src={logo} alt="" />;
      }
    },
    // 自定义 403 页面
    unAccessible: (
      <div>
        <Result
          status="403"
          title="403"
          subTitle="抱歉，你无权访问该页面"
          extra={
            <Button type="primary" onClick={backToHome}>
              返回首页
            </Button>
          }
        />
      </div>
    ),
    ...initialState?.settings,
  };
};
