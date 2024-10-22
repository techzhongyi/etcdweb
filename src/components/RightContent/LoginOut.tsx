import React, { useCallback, useState } from 'react';
import { LogoutOutlined, ToolOutlined } from '@ant-design/icons';
import { Avatar, Menu, message, Spin } from 'antd';
import { history, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { clearAllStorage } from '@/utils/storage';
import EditPasswordModal from './editPasswordmodal';
import { loginout } from '@/services/login/login';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  // await outLogin();
  clearAllStorage();
  history.replace({
    pathname: '/user/login',
  });
};

const LoginOut: React.FC<GlobalHeaderRightProps> = ({}) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [visible, setVisible] = useState<boolean>(false);
  const onMenuClick = useCallback(
    async (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        // const { status } = await loginout({})
        // if(status === 0){
        //   message.success('退出成功')
        //   setInitialState((s) => ({ ...s, currentUser: undefined }));
        //   loginOut();
        // }
        message.success('退出成功');
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        loginOut();
        return;
      } else if (key === 'editPassword') {
        setVisible(true);
      }
      // history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
      {/* {currentUser.name != 'root' && (
        <Menu.Item key="editPassword">
          <ToolOutlined />
          修改密码
        </Menu.Item>
      )} */}
    </Menu>
  );
  // 新增 编辑 关闭Modal
  const isShowModal = (show: boolean) => {
    setVisible(show);
  };
  // const onFinish = async (value: any) => {
  //   if(value.new_password != value.new_password2){
  //     message.error('两次密码不一致')
  //     return
  //   }
  //   // const { status, msg } = await editPassword({
  //   //   password: value.password,
  //   //   new_password: value.new_password,
  //   // })
  //   // if(status === 0){
  //   //   message.success('密码修改成功 请重新登陆')
  //   //   await loginout({})
  //   //   setInitialState((s) => ({ ...s, currentUser: undefined }));
  //   //   loginOut();
  //   // }else{
  //   //   message.error(msg)
  //   // }
  // };
  return (
    <>
      {' '}
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar
            size="small"
            icon={<LogoutOutlined />}
            className={styles.avatar}
          />
        </span>
      </HeaderDropdown>
      {/* {!visible ? (
        ''
      ) : (
        <EditPasswordModal visible={visible} isShowModal={isShowModal} onFinish={onFinish} />
      )} */}
    </>
  );
};

export default LoginOut;
