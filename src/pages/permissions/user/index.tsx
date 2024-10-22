import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm, Switch } from 'antd';
import moment from 'moment';
import { debounce } from 'lodash';
import { userItemType } from '../data';
import AddOrEditModal from './components/addOrEditModal';
import {
  addUser,
  deleteUser,
  editUser,
  getUserList,
  lockUser,
} from '@/services/permissions/user';
const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [visible, setVisible] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [record, setRecord] = useState<userItemType | undefined>(undefined);

  // 新增 编辑 关闭Modal
  const isShowModal = (show: boolean, row?: userItemType, id?: string) => {
    setVisible(show);
    setEditId(id);
    setRecord(row);
  };
  // 提交
  const onFinish = async (value: any) => {
    if (editId === undefined) {
      // 新增
      const { status, msg } = await addUser(value);
      if (status === 0) {
        message.success('添加成功');
        actionRef.current?.reload();
        isShowModal(false);
      } else {
        message.warn(msg);
      }
    } else {
      // 编辑
      const { status, msg } = await editUser({ ...value, id: editId });
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
    const { status } = await lockUser({ id, enable: enable ? 1 : 0 });
    if (status === 0) {
      message.success('操作成功');
    } else {
      message.error('操作失败');
    }
  };
  const columns: ProColumns<userItemType>[] = [
    {
      title: '姓名',
      key: 'name',
      align: 'center',
      dataIndex: 'name',
      hideInSearch: true,
    },
    {
      align: 'center',
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '所属组织',
      dataIndex: 'depart_name',
      align: 'center',
      key: 'depart_name',
      hideInSearch: true,
    },
    {
      title: '账号数量',
      align: 'center',
      dataIndex: 'account_count',
      key: 'account_count',
      hideInSearch: true,
    },
    {
      title: '描述',
      align: 'center',
      dataIndex: 'desc',
      key: 'desc',
      hideInSearch: true,
      ellipsis: true,
    },
    // {
    //     title: '资产权限',
    //     dataIndex: 'zichanquanxian',
    //     align:"center",
    //     key: 'role_name',
    //     hideInSearch: true,
    // },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      align: 'center',
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
      render: (text, record_: userItemType) => {
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
              const { status, msg } = await deleteUser({
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
  // 获取用户列表
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
      data,
      data: { list },
      status,
    } = await getUserList(param);
    return {
      data: list,
      total: data.total,
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
      <ProTable<userItemType>
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
        headerTitle="用户列表"
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
        <AddOrEditModal
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
