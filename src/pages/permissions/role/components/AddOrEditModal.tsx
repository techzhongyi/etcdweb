import React, { useEffect, useState } from 'react';
import { Button, Modal, Skeleton, Space, Tree } from 'antd';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import type { DataNode } from 'antd/lib/tree';
import { ProFormTextArea } from '@ant-design/pro-components';
import { FormValues, roleItemType } from '../../data';
import {
  getResourceList,
  getSelectedResourceList,
} from '@/services/permissions/role';
interface RoleModalType {
  visible: boolean;
  record?: roleItemType | undefined;
  editId?: string;
  loading?: boolean;
  isShowModal: (show: boolean, _record?: roleItemType, id?: string) => void;
  onFinish: (value: FormValues) => void;
}
const RoleAddOrEditModal: React.FC<RoleModalType> = (props: any) => {
  const [initialValues, setInitialValues] = useState(undefined);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [defaultCheckedKeys, setDefaultCheckedKeys] = useState([]);
  const [formObj] = ProForm.useForm();
  const {
    visible,
    isShowModal,
    onFinish,
    record,
    editId,
    loading = false,
  } = props;
  const title = editId === undefined ? '新增角色' : '编辑角色';
  // 获取左侧菜单权限tree列表
  const getResourceTree = async () => {
    const {
      status,
      data: { ztree },
    } = await getResourceList({});
    if (status === 0) {
      setTreeData(ztree);
    }
  };
  // 获取左侧菜单权限tree列表及选中
  const getSelectedResourceTree = async () => {
    const {
      status,
      data: {
        ztree_sub: { self, sub },
      },
    } = await getSelectedResourceList({ sub_role_id: editId });
    if (status === 0) {
      setTreeData(self);
      setDefaultCheckedKeys(
        sub.filter((item: any) => item.split('/').length >= 3),
      );
      formObj.setFieldsValue({ res_infos: sub });
    }
  };
  useEffect(() => {
    if (record) {
      setInitialValues({
        ...record,
      });
      getSelectedResourceTree();
    } else {
      getResourceTree();
    }
  }, [record]);
  // tree选中触发
  const onCheck = (checkedKeys: any) => {
    formObj.setFieldsValue({ res_infos: checkedKeys });
  };
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
            label="角色名称"
            fieldProps={{
              maxLength: 29,
            }}
            placeholder="请输入角色名称"
            rules={[
              {
                required: true,
                message: '请输入角色名称!',
              },
            ]}
          />
          <ProFormTextArea
            width="md"
            name="desc"
            label="角色描述"
            fieldProps={{
              maxLength: 499,
            }}
            placeholder="请输入角色描述"
          />
          <ProForm.Item
            name="res_infos"
            label="角色权限"
            rules={[
              {
                required: true,
                message: '请选择角色权限!',
              },
            ]}
          >
            {defaultCheckedKeys.length == 0 ? (
              ''
            ) : (
              <Tree
                checkable
                defaultExpandedKeys={['0-0-0', '0-0-1']}
                defaultSelectedKeys={['0-0-0', '0-0-1']}
                defaultCheckedKeys={defaultCheckedKeys}
                onCheck={onCheck}
                treeData={treeData}
              />
            )}
            {defaultCheckedKeys.length == 0 ? (
              <Tree checkable onCheck={onCheck} treeData={treeData} />
            ) : (
              ''
            )}
          </ProForm.Item>
        </ProForm>
      )}
    </Modal>
  );
};
export default RoleAddOrEditModal;
