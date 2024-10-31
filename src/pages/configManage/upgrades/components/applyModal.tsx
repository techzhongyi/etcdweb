import React from 'react';
import { Button, Modal, Space } from 'antd';
import ProForm, { ProFormTextArea } from '@ant-design/pro-form';

const ApplyModal: React.FC<any> = (props: any) => {
  const [formObj] = ProForm.useForm();
  const { visible, isShowModal, onFinish } = props;
  const onModealCancel = () => {
    isShowModal(false);
  };
  return (
    <Modal
      title='备注信息'
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
        <ProFormTextArea
          width="md"
          name="desc"
          label="备注信息"
          placeholder="请输入备注信息"
          fieldProps={{
            maxLength: 499
          }}
          rules={[
            {
              required: true,
              message: '请输入备注信息！',
            },
          ]}
        />
      </ProForm>
    </Modal>
  );
};
export default ApplyModal;
