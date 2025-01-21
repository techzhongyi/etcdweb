import React, { useState } from 'react';
import { Button, Modal, Space, message } from 'antd';
import ProForm, { ProFormSelect, ProFormText } from '@ant-design/pro-form';
import './index.less';
import { history } from 'umi';
import { webSocket } from '@/utils/socket';
let webShhVersion: any = null,
  timeoutObjVersion: any = undefined,
  serverTimeoutObjVersion: any = undefined;
const AddVersionModal: React.FC<any> = (props: any) => {
  const [formObj] = ProForm.useForm();
  const [loading, setLoading] = useState(false)
  const { visible, isShowModal, onFinish } = props;
  // 保持步骤心跳
  const longVersionstart = () => {
    //1、通过关闭定时器和倒计时进行重置心跳
    clearInterval(timeoutObjVersion);
    clearTimeout(serverTimeoutObjVersion);
    // 2、每隔3s向后端发送一条商议好的数据
    timeoutObjVersion = setInterval(() => {
      // webShhRefresh?.readyState == 1 正常连接
      if (webShhVersion?.readyState === 1) {
        webShhVersion.send('ping');
      } else {
        // webShhRefresh?.readyState != 1 连接异常 重新建立连接
        // setWebShhVersion()
      }
    }, 3000);
  };
  // 发送请求
  const setWebShhVersion = async () => {
    const params = {
      organize: history?.location?.query?.organize,
      branch: formObj.getFieldValue('branch'),
      type: formObj.getFieldValue('type')
    }
    // 必须设置格式为arraybuffer，zmodem 才可以使用
    webShhVersion = await webSocket('/devopsCore/wsversion', params);
    webShhVersion.onopen = (res: any) => {
      longVersionstart()
    };
    // 回调
    webShhVersion.onmessage = function (recv: any) {
      if (typeof (recv.data) === 'string') {
        if (recv.data == 'pong' || recv.data == 'null') {
          return
        } else if (recv.data == 'SUCCESS') {
          message.success('创建成功')
          onFinish('SUCCESS')
          webShhVersion?.close();
          webShhVersion = null;
          setLoading(false)
        } else {
          onFinish('ERROR')
          message.error(recv.data)
          webShhVersion?.close();
          webShhVersion = null;
          setLoading(false)
        }
      } else {
        // zsentry.consume(recv.data);
        setLoading(false)
      }
    };
    // 报错
    webShhVersion.onerror = function () {
      webShhVersion?.close();
      webShhVersion = null;
      setLoading(false)
    }
  };
  const onFinish1 = () => {
    setLoading(true)
    setWebShhVersion()
  }
  const onModealCancel = () => {
    isShowModal(false);
  };
  const versionType = [
    {
      value: 'normal',
      label: '正常迭代',
    },
    {
      value: 'urgent',
      label: '紧急修复bug',
    },
  ];
  return (
    <Modal
      title='创建版本'
      width={766}
      footer={null}
      open={visible}
      maskClosable={false}
      onCancel={onModealCancel}
      destroyOnClose={true}
    >
      <ProForm
        submitter={{
          render: (props_) => (
            <div style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={onModealCancel}>取消</Button>
                <Button
                  loading={loading}
                  type="primary"
                  key="submit"
                  onClick={() => props_.form?.submit?.()}
                >
                  提交
                </Button>
              </Space>
            </div>
          ),
        }}
        onFinish={onFinish1}
        form={formObj}
      >
        <ProFormText
          width="md"
          name="branch"
          label="版本号"
          fieldProps={{
            maxLength: 29,
          }}
          placeholder="请输入版本号"
          rules={[
            {
              required: true,
              message: '请输入版本号!',
            },
          ]}
        />
        <ProFormSelect
          width="md"
          options={versionType}
          name="type"
          placeholder="请选择类型"
          label="类型"
          rules={[
            {
              required: true,
              message: '请选择类型！',
            },
          ]}
        />
      </ProForm>
    </Modal>
  );
};
export default AddVersionModal;
