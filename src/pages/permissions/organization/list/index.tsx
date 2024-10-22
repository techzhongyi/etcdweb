import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm, Switch } from 'antd';
import moment from 'moment';
import { debounce } from 'lodash';
import { orgItemType } from '../../data';
import OrgAddOrEditModal from '../components/addOrEditModal';
import {
  addDepart,
  deleteDepart,
  editDepart,
  getDepartList,
  lockDepart,
} from '@/services/permissions/organization';

const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [visible, setVisible] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [record, setRecord] = useState<orgItemType | undefined>(undefined);

  // 新增 编辑 关闭Modal
  const isShowModal = (show: boolean, row?: orgItemType, id?: string) => {
    setVisible(show);
    setEditId(id);
    setRecord(row);
  };

  // 提交
  const onFinish = async (value: any) => {
    if (editId === undefined) {
      // 新增
      const { status, msg } = await addDepart(value);
      if (status === 0) {
        message.success('添加成功');
        actionRef.current?.reload();
        isShowModal(false);
      } else {
        message.warn(msg);
      }
    } else {
      // 编辑
      const { status, msg } = await editDepart({ ...value, id: editId });
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
  const getLockDepart = async (id: string, enable: boolean) => {
    const { status } = await lockDepart({ id, enable: enable ? 1 : 0 });
    if (status === 0) {
      message.success('操作成功');
    } else {
      message.error('操作失败');
    }
  };
  const columns: ProColumns<orgItemType>[] = [
    {
      title: '序号',
      key: 'index',
      valueType: 'index',
      align: 'center',
      hideInSearch: true,
      width: 60,
    },
    {
      title: '组织名称',
      key: 'name',
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: '组织人数',
      dataIndex: 'user_count',
      align: 'center',
      key: 'user_count',
      hideInSearch: true,
    },
    {
      title: '组织描述',
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
      render: (_, record) =>
        moment(record.create_time * 1000).format('YYYY-MM-DD'),
      hideInSearch: true,
    },
    {
      title: '状态',
      key: 'enable',
      align: 'center',
      dataIndex: 'enable',
      hideInSearch: true,
      render: (_, record) => (
        <Switch
          checkedChildren="启用"
          unCheckedChildren="禁用"
          defaultChecked={record.enable === 1}
          onChange={debounce((checked) => {
            getLockDepart(record.id, checked);
          }, 500)}
        />
      ),
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'serve_type',
      key: 'option',
      align: 'center',
      render: (text, record_: orgItemType) => {
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
              const { status, msg } = await deleteDepart({
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
  // 获取组织列表
  const getList = async (params: any) => {
    const param = {
      skip_root: 0,
      $tableLimit: {
        page: params.current,
        count: params.pageSize,
      },
      $tableSearch: [
        {
          field: 'name',
          value: params.name ? params.name : '__ignore__',
          op: 7,
        },
      ],
      $tableSort: [],
    };
    const {
      data,
      data: { list },
      status,
    } = await getDepartList(param);
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
      <ProTable<orgItemType>
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
        headerTitle="组织列表"
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
        <OrgAddOrEditModal
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
