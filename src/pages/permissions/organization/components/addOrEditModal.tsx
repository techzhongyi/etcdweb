import React, { useEffect, useState } from 'react';
import { Button, Modal, Skeleton, Space } from 'antd';
import ProForm, { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { orgItemType, FormValues } from '../../data';
interface categoryModalType {
  visible: boolean;
  record?: orgItemType | undefined;
  editId?: string;
  loading?: boolean;
  isShowModal: (show: boolean, _record?: orgItemType, id?: string) => void;
  onFinish: (value: FormValues) => void;
}
const OrgAddOrEditModal: React.FC<categoryModalType> = (props: any) => {
  const [formObj] = ProForm.useForm();
  const {
    visible,
    isShowModal,
    onFinish,
    record,
    editId,
    loading = false,
  } = props;
  const [initialValues, setInitialValues] = useState(undefined);
  const title = editId === undefined ? '新增组织' : '编辑组织';
  useEffect(() => {
    if (record) {
      setInitialValues({
        ...record,
      });
    }
  }, [record]);

  const onModealCancel = () => {
    isShowModal(false);
  };
  return (
    <Modal
      title={title}
      width={766}
      footer={null}
      open={visible}
      maskClosable={false}
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
          initialValues={initialValues}
          form={formObj}
        >
          <ProFormText
            width="md"
            name="name"
            label="组织名称"
            fieldProps={{
              maxLength: 29,
            }}
            placeholder="请输入组织名称"
            rules={[
              {
                required: true,
                message: '请输入组织名称!',
              },
            ]}
          />
          <ProFormTextArea
            width="md"
            name="desc"
            label="描述"
            placeholder="请输入描述"
            fieldProps={{
              maxLength: 499,
            }}
          />
        </ProForm>
      )}
    </Modal>
  );
};
export default OrgAddOrEditModal;
