import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm } from 'antd';
import moment from 'moment';
import {
  addAccount,
  deleteAccount,
  editAccount,
  getAccountList,
  lockAccount,
} from '@/services/permissions/account';
import ConfigAddOrEditModal from './components/addOrEditModal';
import { configItemType } from '../data';
import ComparesModal from './components/compareModal';
const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [visible, setVisible] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [record, setRecord] = useState<configItemType | undefined>(undefined);
  const [visible1, setVisible1] = useState<boolean>(false);
  const [editId1, setEditId1] = useState<string | undefined>(undefined);
  const [record1, setRecord1] = useState<configItemType | undefined>(undefined);

  // 新增 编辑 关闭Modal
  const isShowModal = (show: boolean, row?: configItemType, id?: string) => {
    setVisible(show);
    setEditId(id);
    setRecord(row);
  };
  // 新增 编辑 关闭Modal
  const isShowModal1 = (show: boolean, row?: configItemType, id?: string) => {
    setVisible1(show);
    setEditId1(id);
    setRecord1(row);
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
  // 提交
  const onFinish1 = async (value: any) => {};
  const columns: ProColumns<configItemType>[] = [
    {
      title: '序号',
      align: 'center',
      key: 'index',
      hideInSearch: true,
      valueType: 'index',
      width: 60,
    },
    {
      title: '服务名称',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '类型',
      align: 'center',
      dataIndex: 'user_name',
      key: 'user_name',
      hideInSearch: true,
    },
    {
      title: '描述',
      align: 'center',
      dataIndex: 'depart_name',
      key: 'depart_name',
      ellipsis: true,
      hideInSearch: true,
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
      title: '更新时间',
      align: 'center',
      dataIndex: 'create_time',
      key: 'create_time',
      valueType: 'dateTime',
      render: (_, row) => moment(row.create_time * 1000).format('YYYY-MM-DD'),
      hideInSearch: true,
    },
    {
      title: '操作人',
      align: 'center',
      dataIndex: 'depart_name',
      key: 'depart_name',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      valueType: 'option',
      dataIndex: 'serve_type',
      key: 'option',
      render: (text, record_: configItemType) => {
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
      <ProTable<configItemType>
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
        headerTitle="配置列表"
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              isShowModal1(true);
            }}
          >
            新增
          </Button>,
        ]}
      />
      {!visible ? (
        ''
      ) : (
        <ConfigAddOrEditModal
          visible={visible}
          isShowModal={isShowModal}
          onFinish={onFinish}
          record={record}
          editId={editId}
        />
      )}
      {!visible1 ? (
        ''
      ) : (
        <ComparesModal
          visible={visible1}
          isShowModal={isShowModal1}
          onFinish={onFinish1}
          record={record}
          editId={editId}
        />
      )}
    </PageContainer>
  );
};
export default Index;
