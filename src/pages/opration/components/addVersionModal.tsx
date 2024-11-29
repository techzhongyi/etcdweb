import React from 'react';
import { Button, Modal, Space } from 'antd';
import ProForm, { ProFormSelect, ProFormText } from '@ant-design/pro-form';
import './index.less';
const AddVersionModal: React.FC<any> = (props: any) => {
  const [formObj] = ProForm.useForm();
  const { visible, isShowModal, onFinish } = props;
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
        onFinish={onFinish}
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
