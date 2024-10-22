import React, { useEffect, useState } from 'react';
import { Button, Modal, Skeleton, Space } from 'antd';
import ProForm, {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import Help from '@/utils/help';
import { FormValues, accountItemType } from '../data';
import { getRoleList } from '@/services/permissions/role';
interface accountModalType {
  visible: boolean;
  record?: accountItemType | undefined;
  editId?: string;
  loading?: boolean;
  groupId?: string;
  isShowModal: (show: boolean, _record?: accountItemType, id?: string) => void;
  onFinish: (value: FormValues) => void;
}
const UserAddOrEditModal: React.FC<accountModalType> = (props: any) => {
  const [formObj] = ProForm.useForm();
  const {
    visible,
    isShowModal,
    onFinish,
    groupId,
    record,
    editId,
    loading = false,
  } = props;
  const [initialValues, setInitialValues] = useState(undefined);
  const title = editId === undefined ? '新增账号' : '编辑账号';
  useEffect(() => {
    if (record) {
      setInitialValues({
        ...record,
      });
    }
  }, [record]);
  const statusType = [
    {
      value: 1,
      label: '启用',
    },
    {
      value: 0,
      label: '禁用',
    },
  ];
  const accoutType = [
    {
      value: 1,
      label: '客户端',
    },
    {
      value: 2,
      label: '运维端',
    },
    {
      value: 3,
      label: '后台管理系统',
    },
  ];
  //获取角色列表
  const RoleList = async () => {
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
    } = await getRoleList(param);
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
      visible={visible}
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
          <ProFormSelect
            width="md"
            name="accout_type"
            placeholder="请选择账号登录端"
            label="账号登录端"
            options={accoutType}
            rules={[
              {
                required: true,
                message: '请选择账号登录端',
              },
            ]}
          />
          <ProFormText
            width="md"
            name="user_name"
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
            request={() => RoleList()}
            name="role_id"
            placeholder="请选择角色！"
            label="所属角色"
            rules={[
              {
                required: true,
                message: '请选择角色！',
              },
            ]}
          />
          <ProFormSelect
            width="md"
            request={() => RoleList()}
            name="role_id"
            placeholder="请选择所属用户！"
            label="所属用户！"
            rules={[
              {
                required: true,
                message: '请选择所属用户！',
              },
            ]}
          />
          <ProFormTextArea
            width="md"
            name="remark"
            label="描述"
            placeholder="请输入描述"
            fieldProps={{
              maxLength: 499,
            }}
          />
          <ProFormSelect
            width="md"
            options={statusType}
            name="role_id"
            label="状态"
            rules={[
              {
                required: true,
                message: '请选择状态！',
              },
            ]}
          />
        </ProForm>
      )}
    </Modal>
  );
};
export default UserAddOrEditModal;
