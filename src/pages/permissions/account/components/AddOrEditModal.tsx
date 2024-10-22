import React, { useEffect, useState } from 'react';
import { Button, Modal, Skeleton, Space } from 'antd';
import ProForm, {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import Help from '@/utils/help';
import { FormValues, accountItemType } from '../../data';
import { getRoleList } from '@/services/permissions/role';
import { getUserList } from '@/services/permissions/user';
import { getCustomerList } from '@/services/custom/customer';
interface accountModalType {
  visible: boolean;
  record?: accountItemType | undefined;
  editId?: string;
  loading?: boolean;
  isShowModal: (show: boolean, _record?: accountItemType, id?: string) => void;
  onFinish: (value: FormValues) => void;
}
const AccountAddOrEditModal: React.FC<accountModalType> = (props: any) => {
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
  const [UserType, setUserType] = useState(2);
  const title = editId === undefined ? '新增账号' : '编辑账号';
  useEffect(() => {
    if (record) {
      setInitialValues({
        ...record,
      });
      setUserType(record.type);
    }
  }, [record]);

  const userType = [
    {
      value: 0,
      label: '客户端小程序账号',
    },
    {
      value: 1,
      label: '运维端小程序账号',
    },
    {
      value: 2,
      label: '后台管理系统账号',
    },
  ];
  //获取用户列表
  const UserList = async () => {
    const array: { label: any; value: any }[] = [];
    const param = {
      $tableLimit: {
        page: 1,
        count: 100,
      },
      $tableSearch: [{ field: 'enable', value: '1', op: 0 }],
      $tableSort: [],
    };
    const {
      data: { list },
      status,
    } = await getUserList(param);
    if (status === 0) {
      list?.map((item: any) => {
        array.push({ label: item.name + '/' + item.phone, value: item.id });
      });
      return array;
    } else {
      return [];
    }
  };
  //获取角色列表
  const RoleList = async () => {
    const array: { label: any; value: any }[] = [];
    const param = {
      $tableLimit: {
        page: 1,
        count: 100,
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
  //获取客户列表
  const CustomerList = async () => {
    const array: { label: any; value: any }[] = [];
    const param = {
      $tableLimit: {
        page: 1,
        count: 100,
      },
      $tableSearch: [],
      $tableSort: [],
    };
    const {
      data: { list },
      status,
    } = await getCustomerList(param);
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
            options={userType}
            name="type"
            placeholder="请选择账号登录端"
            label="账号登录端"
            fieldProps={{
              onChange: (e) => {
                setUserType(e);
              },
            }}
            rules={[
              {
                required: true,
                message: '请选择所属组织！',
              },
            ]}
          />
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
          {UserType == 0 && (
            <ProFormSelect
              width="md"
              request={() => CustomerList()}
              name="customer_id"
              placeholder="请选择客户"
              label="所属客户"
              rules={[
                {
                  required: true,
                  message: '请选择所属客户！',
                },
              ]}
            />
          )}
          {UserType == 2 && (
            <ProFormSelect
              width="md"
              request={() => RoleList()}
              name="role_id"
              placeholder="请选择角色"
              label="所属角色"
              rules={[
                {
                  required: true,
                  message: '请选择角色！',
                },
              ]}
            />
          )}

          <ProFormSelect
            label="所属用户"
            name="user_id"
            width="md"
            showSearch
            placeholder="请选择所属用户"
            request={() => UserList()}
            rules={[
              {
                required: true,
                message: '请选择所属用户！',
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
export default AccountAddOrEditModal;
