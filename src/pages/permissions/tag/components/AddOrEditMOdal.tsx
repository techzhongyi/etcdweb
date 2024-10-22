import React, { useEffect, useState } from 'react';
import { Button, Modal, Skeleton, Space, Tree } from 'antd';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import type { DataNode } from 'antd/lib/tree';
import { ProFormTextArea } from '@ant-design/pro-components';
import { FormValues, tagItemType } from '../../data';
import {
  getResourceList,
  getSelectedResourceList,
} from '@/services/permissions/role';
interface TagModalType {
  visible: boolean;
  record?: roleItemType | undefined;
  editId?: string;
  loading?: boolean;
  isShowModal: (show: boolean, _record?: tagItemType, id?: string) => void;
  onFinish: (value: FormValues) => void;
}
const TagAddOrEditModal: React.FC<TagModalType> = (props: any) => {
  const [initialValues, setInitialValues] = useState(undefined);
  const [formObj] = ProForm.useForm();
  const {
    visible,
    isShowModal,
    onFinish,
    record,
    editId,
    loading = false,
  } = props;
  const title = editId === undefined ? '新增标签' : '编辑标签';
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
      width={566}
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
            render: (row) => (
              <div style={{ textAlign: 'right' }}>
                <Space>
                  <Button onClick={onModealCancel}>取消</Button>
                  <Button
                    type="primary"
                    loading={loading}
                    key="submit"
                    onClick={() => row.form?.submit?.()}
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
            label="标签名称"
            fieldProps={{
              maxLength: 29,
            }}
            placeholder="请输入标签名称"
            rules={[
              {
                required: true,
                message: '请输入标签名称!',
              },
            ]}
          />
        </ProForm>
      )}
    </Modal>
  );
};
export default TagAddOrEditModal;
