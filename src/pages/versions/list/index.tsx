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
} from '@/services/permissions/account';
import { versionsItemType } from '../data';
const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [visible, setVisible] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [record, setRecord] = useState<versionsItemType | undefined>(undefined);
  const [visible1, setVisible1] = useState<boolean>(false);
  const [editId1, setEditId1] = useState<string | undefined>(undefined);
  const [record1, setRecord1] = useState<versionsItemType | undefined>(undefined);

  // 新增 编辑 关闭Modal
  const isShowModal = (show: boolean, row?: versionsItemType, id?: string) => {
    setVisible(show);
    setEditId(id);
    setRecord(row);
  };
  // 新增 编辑 关闭Modal
  const isShowModal1 = (show: boolean, row?: versionsItemType, id?: string) => {
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
  const onFinish1 = async (value: any) => { };
  const columns: ProColumns<versionsItemType>[] = [
    {
      title: '序号',
      align: 'center',
      key: 'index',
      hideInSearch: true,
      valueType: 'index',
      width: 60,
    },
    {
      title: '版本号',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '更新描述',
      align: 'center',
      dataIndex: 'depart_name',
      key: 'depart_name',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '类型',
      dataIndex: 'healthy',
      key: 'healthy',
      hideInSearch: true,
      align: 'center',
      valueType: 'select',
      valueEnum: {
        '0': { text: '运行中', status: 'Success', },
        '1': { text: '故障', status: 'Error', },
        '2': { text: '失联', status: 'Default', },
      }
    },
    {
      title: '状态',
      dataIndex: 'healthy',
      key: 'healthy',
      hideInSearch: true,
      align: 'center',
      valueType: 'select',
      valueEnum: {
        '0': { text: '运行中', status: 'Success', },
        '1': { text: '故障', status: 'Error', },
        '2': { text: '失联', status: 'Default', },
      }
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
      title: '日志',
      key: 'option',
      align: "center",
      valueType: 'option',
      hideInSearch: true,
      render: (text, record: versionsItemType) => [
        <a >
          查看
        </a>,
      ],
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      valueType: 'option',
      dataIndex: 'serve_type',
      key: 'option',
      render: (text, record_: versionsItemType) => {
        return [
          <a
            onClick={() => {
              isShowModal(true, record_, record_.id);
            }}
          >
            升级
          </a>,
          <a
            onClick={() => {
              isShowModal(true, record_, record_.id);
            }}
          >
            导入配置
          </a>,
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
      <ProTable<versionsItemType>
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
        headerTitle="版本列表"
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
      {/* {!visible ? (
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
      )} */}
    </PageContainer>
  );
};
export default Index;
