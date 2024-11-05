import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { LoginForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { history, useModel } from 'umi';
import { getProjectList, login } from '@/services/login/login';
import './index.less';
import { setStorage } from '@/utils/storage';
import loginLogo from '../../../../public/icons/loginLogo.png';
let enterPath = '/home';
const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [, setSubmitting] = useState(false);
  const [userLoginState, setUserLoginState] = useState(0);
  const [userLoginMsg, setUserLoginMsg] = useState<any>('');
  const { initialState, setInitialState } = useModel('@@initialState');
  let currentAccess: any;
  const fetchUserInfo = async (data: any) => {
    if (data) {
      const array: { label: any; value: any }[] = [];
      data.env.map(item => {
        array.push({ label: item.value, value: item.name });
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      await setInitialState((s) => ({
        ...s,
        currentUser: { ...data, extraArray: array, defaultEnv: array[0].value },
      }));
    }
  };
  const handleSubmit = async (values: API.LoginParams) => {
    setSubmitting(true);
    try {
      // 登录
      const {
        data: { token, extra },
        status,
        msg,
      } = await login({ ...values });
      if (status === 0) {
        message.success('登录成功！');
        setStorage('token', token);
        setStorage('organize', values.organize);
        setStorage('p_secret', values.password);
        // setStorage('user_info', data.__user_info__);
        // setStorage('user_info', {name: values.username});
        setStorage('user_info', extra)
        await fetchUserInfo(extra);
        // console.log(userInfo)
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        // const { query } = history.location;
        // const { redirect } = query as { redirect: string };
        history.push(enterPath);
        return;
      } else if (status === 110) {
        message.warn(msg);
      } else {
        // 如果失败去设置用户错误信息
        setUserLoginState(status);
        setUserLoginMsg(msg);
      }
    } catch (error) {
      message.error('登录失败，请重试！');
    }
    setSubmitting(false);
  };
  const getList = async () => {
    const array: { label: any; value: any }[] = [];
    const param = {};
    const {
      data: { items },
      status,
    } = await getProjectList(param);
    if (status === 0) {
      items?.map((item_: any) => {
        array.push({ label: item_.name, value: item_.name });
      });
      return array;
    } else {
      return [];
    }
  };


  return (
    <div className="container">
      <div className="content">
        <div className="loginLogo">
          <img src={loginLogo} />
        </div>
        <div className="main">
          <LoginForm
            onFinish={async (values) => {
              await handleSubmit(values as API.LoginParams);
            }}
          >
            <div className="loginTitle">沂威售后服务站平台</div>
            {userLoginState != 0 && <LoginMessage content={userLoginMsg} />}
            {
              <>
                <ProFormSelect
                  width='lg'
                  name="organize"
                  fieldProps={{
                    autoFocus: true,
                    size: 'large',
                  }}
                  request={() => getList()}
                  placeholder="请选择项目名称"
                  rules={[{ required: true, message: '请选择项目名称!' }]}
                />
                <ProFormText
                  className="phoneInput"
                  fieldProps={{
                    autoFocus: true,
                    size: 'large',
                    prefix: <UserOutlined />,
                  }}
                  name="username"
                  placeholder="账号"
                  rules={[
                    {
                      required: true,
                      message: '请输入账号！',
                    }
                  ]}
                />
                <ProFormText.Password
                  placeholder="密码"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined />,
                  }}
                  rules={[
                    {
                      required: true,
                      message: '请输入密码！',
                    },
                  ]}
                  width="lg"
                  name="password"
                />
              </>
            }
          </LoginForm>
        </div>
      </div>
    </div>
  );
};

export default Login;
