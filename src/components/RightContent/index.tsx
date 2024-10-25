import { Select, Space } from 'antd';
// import { QuestionCircleOutlined } from '@ant-design/icons';
import React,{ useEffect, useState } from 'react';
import { useModel } from 'umi';
import NoticeIconView from '../NoticeIcon';
import Avatar from './AvatarDropdown';
// import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import LoginOut from './LoginOut';
export type SiderTheme = 'light' | 'dark';
import { setStorage, getStorage } from '@/utils/storage';
const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const {envs, setEnvs } = useModel('model')
  if(!initialState){
    return null
  }
  const { extraArray, defaultEnv } = initialState?.currentUser
  const [initDefaultEnv,setInitDefaultEnv] = useState(getStorage('env') || defaultEnv)
  useEffect( () => {
    setEnvs(defaultEnv)
  },[defaultEnv])
  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  const envChange = (e) => {
    setStorage('env', e)
    setInitDefaultEnv(e)
    setEnvs(e)
  }
  return (
    <Space className={className}>
      {/* <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        // defaultValue="umi ui"
        // options={[
        //   { label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>, value: 'umi ui' },
        //   {
        //     label: <a href="next.ant.design">Ant Design</a>,
        //     value: 'Ant Design',
        //   },
        //   {
        //     label: <a href="https://protable.ant.design/">Pro Table</a>,
        //     value: 'Pro Table',
        //   },
        //   {
        //     label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
        //     value: 'Pro Layout',
        //   },
        // ]}
        // onSearch={value => {
        //   console.log('input', value);
        // }}
      /> */}
      {/* <span
        className={styles.action}
        onClick={() => {
          window.open('https://pro.ant.design/docs/getting-started');
        }}
      >
        <QuestionCircleOutlined />
      </span> */}
      {/* <NoticeIconView /> */}
      <div>
              <Select
                defaultValue={initDefaultEnv}
                style={{ width: 200 }}
                onChange={(e) => { envChange(e) }}
                options={extraArray}
              />
              {}
            </div>
      <Avatar />
      <LoginOut />
      {/* <SelectLang className={styles.action} /> */}
    </Space>
  );
};
export default GlobalHeaderRight;
