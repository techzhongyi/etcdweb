import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Space, Spin } from 'antd';
import { useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({}) => {
  const { initialState } = useModel('@@initialState');
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
    <Menu className={styles.menu} selectedKeys={[]}>
      <Menu.Item key="1">
        <div className={styles.menuInfos}>
          <div className={styles.usersInfo}>
            <Space>
              <Avatar
                size="small"
                className={styles.avatar}
                style={{ backgroundColor: '#5578F9', color: '#fff' }}
                icon={<UserOutlined />}
              />
              <div className={`${styles.name} anticon`}>{currentUser.name}</div>
              {/* <div className={`${styles.name} anticon`}>root</div> */}
            </Space>
          </div>
          <div className={styles.usersDetail} style={{ width: '300px' }}>
            {/* <div>所属组织: {currentUser.group_name?currentUser.group_name: '--'}</div> */}
          </div>
        </div>
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar
            size="small"
            className={styles.avatar}
            style={{ backgroundColor: '#5578F9', color: '#fff' }}
            icon={<UserOutlined />}
          />
          {/* <div className={`${styles.name} anticon`}>root</div> */}
          <div className={`${styles.name} anticon`}>{currentUser.name}</div>
        </span>
      </HeaderDropdown>
    </>
  );
};

export default AvatarDropdown;
// function fetchUserInfo() {
//   throw new Error('Function not implemented.');
// }
