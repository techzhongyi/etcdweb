import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm, Switch } from 'antd';
import moment from 'moment';
import { debounce } from 'lodash';
import { accountItemType } from '../data';
import {
  addAccount,
  deleteAccount,
  editAccount,
  getAccountList,
  lockAccount,
} from '@/services/permissions/account';
import AccountAddOrEditModal from './components/AddOrEditModal';
const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [visible, setVisible] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [record, setRecord] = useState<accountItemType | undefined>(undefined);

  // 新增 编辑 关闭Modal
  const isShowModal = (show: boolean, row?: accountItemType, id?: string) => {
    setVisible(show);
    setEditId(id);
    setRecord(row);
  };

  // 提交
  const onFinish = async (value: any) => {
    if (editId === undefined) {
      // 新增
      const { status, msg } = await addAccount(value);
      if (status === 0) {
        message.success('添加成功');
        actionRef.current?.reload();
        isShowModal(false);
      } else {
        message.warn(msg);
      }
    } else {
      // 编辑
      const { status, msg } = await editAccount({ ...value, id: editId });
      if (status === 0) {
        message.success('修改成功');
        actionRef.current?.reload();
        isShowModal(false);
      } else {
        message.warn(msg);
      }
    }
  };
  // 禁用启用
  const getLockOperation = async (id: any, enable: boolean) => {
    const { status } = await lockAccount({ id, enable: enable ? 1 : 0 });
    if (status === 0) {
      message.success('操作成功');
    } else {
      message.error('操作失败');
    }
  };
  const columns: ProColumns<accountItemType>[] = [
    {
      title: '账号登录端',
      key: 'type',
      align: 'center',
      dataIndex: 'type',
      valueType: 'select',
      hideInSearch: true,
      valueEnum: {
        '0': { text: '客户端小程序账号' },
        '1': { text: '运维端小程序账号' },
        '2': { text: '后台管理系统账号' },
      },
    },
    {
      title: '姓名',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '所属用户',
      align: 'center',
      dataIndex: 'user_name',
      key: 'user_name',
      hideInSearch: true,
    },
    {
      title: '所属组织',
      align: 'center',
      dataIndex: 'depart_name',
      key: 'depart_name',
      hideInSearch: true,
    },
    {
      title: '所属角色',
      align: 'center',
      dataIndex: 'role_name',
      key: 'role_name',
      hideInSearch: true,
    },
    {
      title: '手机号',
      align: 'center',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '描述',
      align: 'center',
      dataIndex: 'desc',
      key: 'desc',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '创建时间',
      align: 'center',
      dataIndex: 'create_time',
      key: 'create_time',
      valueType: 'dateTime',
      render: (_, row) => moment(row.create_time * 1000).format('YYYY-MM-DD'),
      hideInSearch: true,
    },
    {
      title: '状态',
      align: 'center',
      key: 'enable',
      dataIndex: 'enable',
      hideInSearch: true,
      render: (_, row) => (
        <Switch
          checkedChildren="启用"
          unCheckedChildren="禁用"
          disabled={row.name === 'root' ? true : false}
          defaultChecked={row.enable === 1}
          onChange={debounce((checked) => {
            getLockOperation(row.id, checked);
          }, 500)}
        />
      ),
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      valueType: 'option',
      dataIndex: 'serve_type',
      key: 'option',
      render: (text, record_: accountItemType) => {
        return [
          <a
            onClick={() => {
              isShowModal(true, record_, record_.id);
            }}
          >
            编辑
          </a>,
          <Popconfirm
            onConfirm={async () => {
              const { status, msg } = await deleteAccount({
                id: record_?.id,
              });
              if (status === 0) {
                message.success('删除成功');
                actionRef.current?.reload();
              } else {
                message.error(msg);
              }
            }}
            key="popconfirm"
            title="删除后不可恢复，确认删除吗?"
            okText="是"
            cancelText="否"
          >
            <a>删除</a>
          </Popconfirm>,
        ];
      },
    },
  ];
  // 获取账号列表
  const getList = async (params: any) => {
    const param = {
      skip_root: 0,
      $tableLimit: {
        page: params.current,
        count: params.pageSize,
      },
      $tableSearch: [
        {
          field: 'phone',
          value: params.phone ? params.phone : '__ignore__',
          op: 7,
        },
      ],
      $tableSort: [],
    };
    const {
      data: { list, total },
      status,
    } = await getAccountList(param);
    return {
      data: list,
      total: total,
      success: status === 0,
    };
  };
  return (
    <PageContainer
      ghost
      header={{
        title: ' ',
        breadcrumb: {},
      }}
    >
      <ProTable<accountItemType>
        bordered
        columns={columns}
        actionRef={actionRef}
        request={(params) => getList(params)}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        scroll={{ x: 2000 }}
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: pageSize,
          showSizeChanger: true,
          onShowSizeChange: (current, pageSize) => {
            setPageSize(pageSize);
          },
        }}
        options={false}
        dateFormatter="string"
        headerTitle="账号列表"
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              isShowModal(true);
            }}
          >
            新增
          </Button>,
        ]}
      />
      {!visible ? (
        ''
      ) : (
        <AccountAddOrEditModal
          visible={visible}
          isShowModal={isShowModal}
          onFinish={onFinish}
          record={record}
          editId={editId}
        />
      )}
    </PageContainer>
  );
};
export default Index;
