import { SafetyCertificateFilled, UserOutlined } from '@ant-design/icons';
import { Alert, message } from 'antd';
import React, { useState } from 'react';
import { LoginForm, ProFormCaptcha, ProFormText } from '@ant-design/pro-form';
import { history, useModel } from 'umi';
import { getsms, login } from '@/services/login/login';
import './index.less';
import { setStorage } from '@/utils/storage';
import Help from '@/utils/help';
import loginLogo from '../../../../public/icons/loginLogo.png';
let enterPath = '/configManage';
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
      const { access } = data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      currentAccess = access;
      await setInitialState((s) => ({
        ...s,
        currentUser: data,
      }));
    }
  };
  const handleSubmit = async (values: API.LoginParams) => {
    setSubmitting(true);
    try {
      // 登录
      const {
        data: { token },
        extra,
        status,
        msg,
      } = await login({ ...values });
      if (status === 0) {
        message.success('登录成功！');
        setStorage('token', token);
        setStorage('p_secret', values.code);
        // setStorage('user_info', data.__user_info__);
        setStorage('user_info', extra);
        await fetchUserInfo({ name: extra.name, access: values.phone });
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
                <ProFormText
                  className="phoneInput"
                  fieldProps={{
                    autoFocus: true,
                    size: 'large',
                    maxLength: 11,
                    prefix: <UserOutlined />,
                  }}
                  name="phone"
                  placeholder="账号"
                  rules={[
                    {
                      required: true,
                      message: '请输入账号！',
                    },
                    {
                      pattern: Help.Regular.mobilePhone,
                      message: '请输入正确的手机号码！',
                    },
                  ]}
                />
                <ProFormCaptcha
                  fieldProps={{
                    maxLength: 6,
                    size: 'large',
                    prefix: <SafetyCertificateFilled className="prefixIcon" />,
                  }}
                  captchaProps={{
                    size: 'large',
                    style: {
                      background: '#20A395',
                      color: '#fff',
                    },
                  }}
                  phoneName="phone"
                  placeholder="请输入密码"
                  captchaTextRender={(timing, count) => {
                    if (timing) {
                      return `${count}s`;
                    }
                    return '获取验证码';
                  }}
                  name="code"
                  rules={[
                    {
                      required: true,
                      message: '请输入验证码！',
                    },
                    {
                      min: 6,
                      message: '请输入6位验证码',
                    },
                    {
                      max: 6,
                      message: '请输入6位验证码',
                    },
                  ]}
                  onGetCaptcha={async (phone) => {
                    const { status, msg } = await getsms({
                      mobile_number: phone,
                      account_type: 2,
                    });
                    if (status === 0) {
                      message.success('获取验证码成功！');
                    } else {
                      message.error(msg);
                      throw new Error(msg);
                    }
                  }}
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
