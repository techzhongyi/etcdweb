import React, { useEffect, useState } from 'react';
import { Button, Modal, Skeleton, Space } from 'antd';
import ProForm from '@ant-design/pro-form';
import { ProFormSelect } from '@ant-design/pro-components';
import { getCategoryType } from '@/services/interfaceType';
import { propertyModalType } from '../data';
import { getAccountList } from '@/services/permissions/account';
const DesignateModal: React.FC<propertyModalType> = (props: any) => {
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
  const onModealCancel = () => {
    isShowModal(false);
  };
  // 获取负责人
  const designateList = async () => {
    const array: { label: any; value: any }[] = [];
    const param = {
      $tableLimit: {
        page: 1,
        count: 1000,
      },
      $tableSearch: [],
      $tableSort: [],
    };
    const {
      data: { list },
      status,
    } = await getAccountList(param);
    if (status === 0) {
      list?.map((item: any) => {
        array.push({ label: item.name, value: item.id });
      });
      return array;
    } else {
      return [];
    }
  };
  return (
    <Modal
      title="指派"
      maskClosable={false}
      width={1024}
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
        initialValues={initialValues}
        form={formObj}
      >
        <ProFormSelect
          width="lg"
          mode="multiple"
          request={() => designateList()}
          name="owner_ids"
          label="负责人"
          placeholder="请选择负责人"
          rules={[
            {
              required: true,
              message: '请选择负责人！',
            },
          ]}
        />
      </ProForm>
    </Modal>
  );
};
export default DesignateModal;
