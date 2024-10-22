import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm } from 'antd';
import { history } from 'umi';
import { debounce } from 'lodash';
import moment from 'moment';
import { collectionItemType } from '../../data';

const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  // 获取列表
  const getList = async (params: any) => {
    const param = {
      $tableLimit: {
        page: params.current,
        count: params.pageSize,
      },
      $tableSearch: [],
      $tableSort: [],
    };
    // const { data, data: { list }, status } = await getGoodsList(param);
    // return {
    //     data: list,
    //     total: data.total,
    //     success: status === 0,
    // };
  };

  const columns: ProColumns<collectionItemType>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'uu_number',
      hideInSearch: true,
      width: 60,
    },
    {
      title: '订单编号',
      dataIndex: 'bianhao',
      key: 'uu_number',
    },
    {
      title: '客户名称',
      dataIndex: 'wuliugongsi',
      key: 'uu_number',
    },
    {
      title: '客户经理',
      key: 'name',
      dataIndex: 'user',
      hideInSearch: true,
    },
    {
      title: '起租时间',
      dataIndex: 'time',
      key: 'create_time',
      // valueType: 'dateTime',
      // render: (_, record) => moment(record.create_time * 1000).format('YYYY-MM-DD HH:mm'),
      hideInSearch: true,
    },

    {
      title: '收车时间',
      dataIndex: 'time',
      key: 'create_time',
      // valueType: 'dateTime',
      // render: (_, record) => moment(record.create_time * 1000).format('YYYY-MM-DD HH:mm'),
      hideInSearch: true,
    },

    {
      title: '收车状态',
      key: 'status',
      dataIndex: 'type',
      valueType: 'select',
      valueEnum: {
        '0': { text: '待还车' },
        '1': { text: '整备中' },
      },
    },
    {
      title: '收车记录',
      key: 'remark',
      dataIndex: 'beizhu',
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      render: (text, record: collectionItemType) => [
        <a>置为可交付</a>,
        <a>投保记录</a>,
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
      <ProTable<collectionItemType>
        bordered
        columns={columns}
        actionRef={actionRef}
        // request={(params) => getList(params)}
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
        headerTitle="收车订单"
        toolBarRender={() => [
          // <Button
          // >
          //     导出
          // </Button>,
        ]}
      />
    </PageContainer>
  );
};
export default Index;
