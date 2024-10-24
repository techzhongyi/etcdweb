import {
  ProForm,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Modal, Skeleton, Space } from 'antd';
import { useEffect, useState } from 'react';
import { versionsItemType, modalType } from '../data';

const VersionAddOrEditModal: React.FC<modalType<versionsItemType>> = (
  props: any,
) => {
  const [formObj] = ProForm.useForm();
  const { visible, isShowModal, onFinish, record, editId } = props;
  const [initialValues, setInitialValues] = useState(undefined);
  const title = editId ? '编辑版本' : '创建版本'
  const versionList = [
    {
      label: '主版本',
      value: 1
    },
    {
      label: '小版本',
      value: 2
    },
    {
      label: '修订版本',
      value: 3
    },
  ]
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
      open={visible}
      onCancel={onModealCancel}
      footer={null}
      maskClosable={false}
      destroyOnClose={true}
      width={980}
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
          <ProFormSelect
            name="type"
            width="lg"
            options={versionList}
            label="版本类型"
            placeholder="请选择版本类型"
            rules={[
              {
                required: true,
                message: '请选择版本类型!',
              },
            ]}
          />
          <ProFormTextArea
            label="描述"
            name="remark"
            fieldProps={{
              maxLength: 499,
            }}
            width="lg"
          />
        </ProForm>
      )}
    </Modal>
  );
};
export default VersionAddOrEditModal;
