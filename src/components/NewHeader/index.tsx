
import React from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import './index.less';
import { history, useModel } from 'umi';
import logo from '../../../public/icons/new_logo.png';
import user_icon from '../../../public/icons/user_icon.png';
import { clearAllStorage } from '@/utils/storage';
import { Popconfirm, message } from 'antd';
const EtdcHeader: React.FC = (props) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  // 退出登录
  const logout = () => {
    message.success('退出成功');
    setInitialState((s) => ({ ...s, currentUser: undefined }));
    clearAllStorage();
    history.replace({
      pathname: '/user/login',
    })
  }
  const goHome = () => {
    history.replace({
      pathname: '/home',
    })
  }
  return (
    <div className='page-header'>
      <div className='page-header-logo' onClick={() => { goHome() }}><img src={logo} alt="" /></div>
      <div className='page-header-title'>服务监控治理CICD平台</div>
      <div className='page-header-action'>
        <div>
          <div className='user-icon'><img src={user_icon} alt="" /></div>
          <div className='user-name'>{currentUser.name}</div>
        </div>
        <div>
          <Popconfirm
            onConfirm={() => {logout()}}
            key="popconfirm"
            title="确认退出登录?"
            okText="是"
            cancelText="否"
          >
            <LogoutOutlined style={{ fontSize: '22px' }} />
          </Popconfirm>

        </div>
      </div>
    </div>
  );
};

export default EtdcHeader;
