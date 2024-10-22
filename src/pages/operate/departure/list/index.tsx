import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm, message } from 'antd';
import { history } from 'umi';
import { debounce } from 'lodash';
import moment from 'moment';
import { departureItemType } from '../../data';
import {
  cancelSendDevopsOrderAssets,
  getSendFormList,
} from '@/services/operate/departure';
const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState<number>(10);
  // 获取列表
  const getList = async (params: any) => {
    let start_time = 0;
    let start_time_end = 0;
    let end_time = 0;
    let end_time_start = 0;
    if (params.start_time) {
      start_time =
        new Date(params.start_time + ' ' + '00:00:00').getTime() / 1000;
      start_time_end =
        new Date(params.start_time + ' ' + '23:59:59').getTime() / 1000;
    }
    if (params.end_time) {
      end_time_start =
        new Date(params.end_time + ' ' + '00:00:00').getTime() / 1000;
      end_time = new Date(params.end_time + ' ' + '23:59:59').getTime() / 1000;
    }
    const param = {
      page: params.current,
      count: params.pageSize,
      order_uu_number: params.order_uu_number ? params.order_uu_number : '',
      seller_name: params.seller_name ? params.seller_name : '',
      user_name: params.user_name ? params.user_name : '',
      status: params.status ? params.status : -1,
      start_time_s: params.start_time ? start_time : 0,
      start_time_e: params.start_time ? start_time_end : 0,
      end_time_s: params.end_time ? end_time_start : 0,
      end_time_e: params.end_time ? end_time : 0,
    };
    const {
      data: { list, total },
      status,
    } = await getSendFormList(param);
    return {
      data: list,
      total,
      success: status === 0,
    };
  };
  // 配置资产
  const add = (id: string) => {
    history.push({
      pathname: '/operate/addconfig',
      query: {
        id,
      },
    });
  };
  // 取消发车
  // const cancelCar = async (id) => {
  //     const { msg, status } = await cancelSendDevopsOrderAssets({order_assets_id:id});
  //     if(status != 0){
  //         message.error(msg)
  //         return
  //     }
  //     actionRef.current?.reload()
  // }

  //去已租赁订单
  // const goYiZuLin = () => {
  //     history.push({
  //         pathname: '/custom/customerLeaseProperty',
  //     });
  // }
  //to order detail
  const toOrderDetail = (id: string) => {
    history.push({
      pathname: '/custom/orderDetail',
      query: {
        id,
      },
    });
  };
  const columns: ProColumns<departureItemType>[] = [
    {
      title: '序号',
      align: 'center',
      key: 'first',
      hideInSearch: true,
      valueType: 'index',
      width: 60,
    },
    {
      title: '订单编号',
      dataIndex: 'order_uu_number',
      align: 'center',
      key: 'order_uu_number',
      render: (_, record) => {
        return (
          <a
            onClick={() => {
              toOrderDetail(record.order_id);
            }}
          >
            {record.order_uu_number}
          </a>
        );
      },
    },
    {
      title: '客户名称',
      dataIndex: 'user_name',
      align: 'center',
      key: 'user_name',
      ellipsis: true,
    },
    {
      title: '客户经理',
      key: 'seller_name',
      align: 'center',
      dataIndex: 'seller_name',
    },
    {
      title: '发车数量',
      key: 'send_count',
      dataIndex: 'send_count',
      align: 'center',
      hideInSearch: true,
      render: (_, record) => {
        return (
          <a>
            {record.send_count}/{record.total_count}
          </a>
        );
      },
    },
    {
      title: '起租时间',
      dataIndex: 'start_time',
      align: 'center',
      key: 'start_time',
      valueType: 'date',
      render: (_, record) =>
        moment(record.start_time * 1000).format('YYYY-MM-DD'),
    },
    {
      title: '交车时间',
      dataIndex: 'end_time',
      key: 'end_time',
      align: 'center',
      valueType: 'date',
      render: (_, record) =>
        moment(record.end_time * 1000).format('YYYY-MM-DD'),
    },
    {
      title: '发车状态',
      key: 'status',
      align: 'center',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        1: { text: '待选车' },
        2: { text: '待发车' },
        3: { text: '部分发车' },
        4: { text: '已发车' },
        5: { text: '已交车' },
      },
    },
    {
      title: '配车状态',
      key: 'conf_status',
      align: 'center',
      dataIndex: 'conf_status',
      render: (_, record) => {
        if (record.status == 4 || record.status == 5) {
          return '-';
        } else {
          return record.conf_status == 1
            ? '待配置'
            : record.conf_status == 2
            ? '部分配置'
            : record.conf_status == 3
            ? '已配置'
            : '';
        }
      },
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      align: 'center',
      render: (text, record: departureItemType) => {
        if (record.status == 1) {
          return [
            <a
              onClick={() => {
                add(record.order_id);
              }}
            >
              配置资产
            </a>,
          ];
        } else if (record.status == 2 || record.status == 3) {
          return [
            <a
              onClick={() => {
                add(record.order_id);
              }}
            >
              配置资产
            </a>,
            <a
              onClick={() => {
                add(record.order_id);
              }}
            >
              发车
            </a>,
          ];
        } else if (record.status == 4 || record.status == 3) {
          return [
            <a
              onClick={() => {
                add(record.order_id);
              }}
            >
              取消发车
            </a>,
          ];
        } else {
          return ['-'];
        }
      },
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
      <ProTable<departureItemType>
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
        headerTitle="发车订单列表"
        toolBarRender={() => [
          // <Button>
          //     导出
          // </Button>,
        ]}
      />
    </PageContainer>
  );
};
export default Index;
