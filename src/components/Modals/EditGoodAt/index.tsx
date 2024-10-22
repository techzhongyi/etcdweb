import React, { useRef, useState } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { Button, Modal, Space } from 'antd';

const EditGoodAtModal = (props: any) => {
  const { isEditGoodAtModal, close, onFinish, goodAt } = props;
  const [initialValues, setInitialValues] = useState({ good_at: goodAt });
  return (
    <Modal
      title="修改擅长方向"
      footer={null}
      width={566}
      visible={isEditGoodAtModal}
      onCancel={close}
    >
      <ProForm
        submitter={{
          render: (props, dom) => (
            <div style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={close}>取消</Button>
                <Button
                  type="primary"
                  key="submit"
                  onClick={() => props.form?.submit?.()}
                >
                  提交
                </Button>
              </Space>
            </div>
          ),
        }}
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <ProForm.Group>
          <ProFormText
            width="md"
            name="good_at"
            label="修改擅长方向"
            fieldProps={{
              maxLength: 499,
            }}
            placeholder="请输入擅长方向"
            rules={[
              {
                required: true,
                message: '请输入擅长方向！',
              },
            ]}
          />
        </ProForm.Group>
      </ProForm>
    </Modal>
  );
};
export default EditGoodAtModal;
