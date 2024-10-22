import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm } from 'antd';
import RoleAddOrEditModal from './components/AddOrEditModal';
import moment from 'moment';
import { FormValues, roleItemType } from '../data';
import {
  addRole,
  deleteRole,
  editRole,
  getRoleList,
} from '@/services/permissions/role';
const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [record, setRecord] = useState<roleItemType | undefined>(undefined);
  const getList = async (params: any) => {
    const param = {
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
      data: { list, total },
      status,
    } = await getRoleList(param);
    return {
      data: list,
      total: total,
      success: status === 0,
    };
  };
  // 新增 编辑 关闭Modal
  const isShowModal = (show: boolean, row?: roleItemType, id?: string) => {
    setVisible(show);
    setEditId(id);
    setRecord(row);
  };
  const setData = (list: any[]) => {
    const newlist: any = [];
    list.map((item: any) => {
      if (item.includes('_&&_')) {
        const [resid, auth] = item.split('_&&_');
        const newlistresids = newlist.map((i: any) => i.resource_id);
        if (newlistresids.includes(resid)) {
          const index = newlistresids.findIndex((i: any) => resid === i);
          newlist[index].auths.push(auth);
        } else {
          newlist.push({
            resource_id: resid,
            auths: [auth],
          });
        }
      }
    });
    return newlist;
  };
  // 提交
  const onFinish = async (value: FormValues) => {
    value.res_infos = setData(value.res_infos);
    if (editId === undefined) {
      const { status, msg } = await addRole(value);
      if (status === 0) {
        message.success('添加成功');
        actionRef.current?.reload();
        isShowModal(false);
      } else {
        message.error(msg);
      }
    } else {
      const params = {
        role_id: editId,
        res_infos: value.res_infos,
        role_info: {
          name: value.name,
          desc: value.desc,
        },
      };
      const { status, msg } = await editRole(params);
      if (status === 0) {
        message.success('修改成功');
        actionRef.current?.reload();
        isShowModal(false);
      } else {
        message.error(msg);
      }
    }
  };
  const columns: ProColumns<roleItemType>[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
    },
    {
      title: '角色描述',
      dataIndex: 'desc',
      align: 'center',
      ellipsis: true,
      hideInSearch: true,
      key: 'desc',
    },
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
      title: '操作',
      align: 'center',
      valueType: 'option',
      render: (text, row: roleItemType) => [
        <a
          onClick={() => {
            isShowModal(true, row, row.id);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          onConfirm={async () => {
            const { status, msg } = await deleteRole({
              id: row?.id,
            });
            if (status === 0) {
              message.success('操作成功');
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
      ],
    },
  ];

  return (
    <PageContainer
      ghost
      header={{
        title: ' ',
        breadcrumb: {},
      }}
    >
      <ProTable<roleItemType>
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
        headerTitle="角色列表"
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
        <RoleAddOrEditModal
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
