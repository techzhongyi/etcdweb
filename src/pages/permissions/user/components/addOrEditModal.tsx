import React, { useEffect, useState } from 'react';
import { Button, Modal, Skeleton, Space } from 'antd';
import ProForm, {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import Help from '@/utils/help';
import { FormValues, userItemType } from '../../data';
import { getDepartList } from '@/services/permissions/organization';
interface accountModalType {
  visible: boolean;
  record?: userItemType | undefined;
  editId?: string;
  loading?: boolean;
  isShowModal: (show: boolean, _record?: userItemType, id?: string) => void;
  onFinish: (value: FormValues) => void;
}
const AddOrEditModal: React.FC<accountModalType> = (props: any) => {
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
  const title = editId === undefined ? '新增用户' : '编辑用户';
  useEffect(() => {
    if (record) {
      setInitialValues({
        ...record,
      });
    }
  }, [record]);
  //获取组织列表
  const OrgList = async () => {
    const array: { label: any; value: any }[] = [];
    const param = {
      $tableLimit: {
        page: 1,
        count: 1000,
      },
      $tableSearch: [],
      $tableSort: [],
      is_skip_not_enable: 1,
    };
    const {
      data: { list },
      status,
    } = await getDepartList(param);
    if (status === 0) {
      list?.map((item: any) => {
        array.push({ label: item.name, value: item.id });
      });
      return array;
    } else {
      return [];
    }
  };
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
                    确认
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
            label="姓名"
            fieldProps={{
              maxLength: 29,
            }}
            placeholder="请输入姓名"
            rules={[
              {
                required: true,
                message: '请输入姓名!',
              },
            ]}
          />
          <ProFormText
            width="md"
            name="phone"
            label="手机号"
            placeholder="请输入手机号"
            fieldProps={{
              maxLength: 11,
            }}
            rules={[
              {
                required: true,
                message: '请输入手机号!',
              },
              {
                pattern: Help.Regular.mobilePhone,
                message: '请输入正确的手机号码！',
              },
            ]}
          />
          <ProFormSelect
            width="md"
            request={() => OrgList()}
            name="depart_id"
            placeholder="请选择所属组织"
            label="所属组织"
            rules={[
              {
                required: true,
                message: '请选择所属组织！',
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
export default AddOrEditModal;
