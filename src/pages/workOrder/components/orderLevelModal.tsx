import React, { useEffect, useState } from 'react';
import { Button, Modal, Skeleton, Space } from 'antd';
import ProForm from '@ant-design/pro-form';
import { ProFormRadio } from '@ant-design/pro-components';
import { getLevelType } from '@/services/interfaceType';
import { propertyModalType } from '../data';
const OrderLevelModal: React.FC<propertyModalType> = (props: any) => {
  const [initialValues, setInitialValues] = useState(undefined);
  const [initialValues1, setInitialValues1] = useState({
    level: 1,
  });
  const [formObj] = ProForm.useForm();
  const {
    visible,
    isShowModal,
    onFinish,
    record,
    editId,
    loading = false,
  } = props;
  useEffect(() => {
    if (record) {
      setInitialValues({
        ...record,
      });
      setInitialValues1({
        ...record,
      });
    }
  }, [record]);
  const onModealCancel = () => {
    isShowModal(false);
  };
  return (
    <Modal
      title="工单级别"
      maskClosable={false}
      width={1024}
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
          initialValues={initialValues1}
          form={formObj}
        >
          <ProFormRadio.Group
            name="level"
            layout="vertical"
            label="工单级别"
            options={getLevelType()}
          />
        </ProForm>
      )}
    </Modal>
  );
};
export default OrderLevelModal;
