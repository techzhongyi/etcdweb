import React from 'react';
import { Button, Modal, Space } from 'antd';
import ProForm, { ProFormText } from '@ant-design/pro-form';

const EditPasswordModal: React.FC = (props: any) => {
  const [formObj] = ProForm.useForm();
  const { visible, isShowModal, onFinish, loading = false } = props;
  const onModealCancel = () => {
    isShowModal(false);
  };
  return (
    <Modal
      title="修改密码"
      width={566}
      footer={null}
      open={visible}
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
                  type="primary"
                  loading={loading}
                  key="submit"
                  onClick={() => props_.form?.submit?.()}
                >
                  提交
                </Button>
              </Space>
            </div>
          ),
        }}
        onFinish={onFinish}
        form={formObj}
      >
        <ProFormText.Password
          width="md"
          name="password"
          label="旧密码"
          fieldProps={{
            maxLength: 10,
          }}
          placeholder="请输入旧密码"
          rules={[
            {
              required: true,
              message: '请输入旧密码!',
            },
            {
              min: 6,
              message: '密码不能少于6个字符',
            },
          ]}
        />
        <ProFormText.Password
          width="md"
          name="new_password"
          label="新密码"
          fieldProps={{
            maxLength: 10,
          }}
          placeholder="请输入新密码"
          rules={[
            {
              required: true,
              message: '请输入新密码!',
            },
            {
              min: 6,
              message: '密码不能少于6个字符',
            },
          ]}
        />
        <ProFormText.Password
          width="md"
          name="new_password2"
          label="新密码确认"
          fieldProps={{
            maxLength: 10,
          }}
          placeholder="新密码确认"
          rules={[
            {
              required: true,
              message: '请输入新密码确认!',
            },
            {
              min: 6,
              message: '密码不能少于6个字符',
            },
          ]}
        />
      </ProForm>
    </Modal>
  );
};
export default EditPasswordModal;
