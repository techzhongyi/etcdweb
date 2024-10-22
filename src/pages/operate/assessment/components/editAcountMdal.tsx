import React, { useEffect, useState } from 'react';
import { Button, Modal, Skeleton, Space } from 'antd';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import Help from '@/utils/help';
import { assessmentItemType, modalType } from '../../data';
import { ProFormTextArea } from '@ant-design/pro-components';
const EditAcountModal: React.FC<modalType<assessmentItemType>> = (
  props: any,
) => {
  const [formObj] = ProForm.useForm();
  const { visible, record, isShowModal, editId, onFinish } = props;
  const [initialValues, setInitialValues] = useState(undefined);
  useEffect(() => {
    if (record) {
      setInitialValues({
        ...record,
      });
    }
  }, []);
  const onModealCancel = () => {
    isShowModal(false);
  };
  return (
    <Modal
      title="修改定损金额"
      maskClosable={false}
      footer={null}
      open={visible}
      onCancel={onModealCancel}
      destroyOnClose={true}
    >
      {initialValues === undefined && editId !== undefined ? (
        <Skeleton active={true} paragraph={{ rows: 3 }} />
      ) : (
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
                    修改
                  </Button>
                </Space>
              </div>
            ),
          }}
          onFinish={onFinish}
          initialValues={initialValues}
          form={formObj}
        >
          <ProFormText
            name="amount"
            label="定损金额"
            placeholder="请输入定损金额"
            width="md"
            fieldProps={{
              maxLength: 100,
            }}
            rules={[
              {
                required: true,
                message: '请输入定损金额!',
              },
              {
                pattern: Help.Regular.number.price,
                message: '请输入正确的金额！',
              },
            ]}
          />
          <ProFormTextArea
            name="desc"
            label="定损内容"
            placeholder="请输入定损内容"
            width="md"
            fieldProps={{
              maxLength: 100,
            }}
            rules={[
              {
                required: true,
                message: '请输入定损内容!',
              },
            ]}
          />
        </ProForm>
      )}
    </Modal>
  );
};
export default EditAcountModal;
