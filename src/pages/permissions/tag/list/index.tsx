import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm, Switch } from 'antd';
import moment from 'moment';
import { tagItemType } from '../../data';
import TagAddOrEditModal from '../components/AddOrEditMOdal';
import { debounce } from 'lodash';
import {
  addTags,
  deleteTags,
  editTags,
  getTagsList,
} from '@/services/permissions/tags';
const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [record, setRecord] = useState<tagItemType | undefined>(undefined);
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
    } = await getTagsList(param);
    return {
      data: list,
      total: total,
      success: status === 0,
    };
  };
  // 新增 编辑 关闭Modal
  const isShowModal = (show: boolean, row?: tagItemType, id?: string) => {
    setVisible(show);
    setEditId(id);
    setRecord(row);
  };
  // 禁用启用标签
  const enableTags = async (id: string, enable: boolean) => {
    const { status, msg } = await editTags({ id, enable: enable ? 1 : 0 });
    if (status === 0) {
      message.success('操作成功');
      actionRef.current?.reload();
    } else {
      message.error(msg);
      actionRef.current?.reload();
    }
  };
  // 提交
  const onFinish = async (value: any) => {
    if (editId === undefined) {
      const { status, msg } = await addTags(value);
      if (status === 0) {
        message.success('添加成功');
        actionRef.current?.reload();
        isShowModal(false);
      } else {
        message.error(msg);
      }
    } else {
      const { status, msg } = await editTags({ ...value, id: editId });
      if (status === 0) {
        message.success('修改成功');
        actionRef.current?.reload();
        isShowModal(false);
      } else {
        message.error(msg);
      }
    }
  };
  const columns: ProColumns<tagItemType>[] = [
    {
      title: '序号',
      align: 'center',
      key: 'index',
      hideInSearch: true,
      valueType: 'index',
      width: 60,
    },
    {
      title: '标签名称',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
    },
    {
      title: '创建人',
      dataIndex: 'creator_name',
      align: 'center',
      key: 'creator_name',
      hideInSearch: true,
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
      title: '是否上架',
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
            enableTags(record.id, checked);
          }, 500)}
        />
      ),
    },
    {
      title: '操作',
      align: 'center',
      valueType: 'option',
      render: (text, row: tagItemType) => [
        <a
          onClick={() => {
            isShowModal(true, row, row.id);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          onConfirm={async () => {
            const { status, msg } = await deleteTags({
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
      <ProTable<tagItemType>
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
        headerTitle="标签列表"
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
        <TagAddOrEditModal
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
