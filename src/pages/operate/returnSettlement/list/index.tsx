import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message } from 'antd';
import { history } from 'umi';
import moment from 'moment';
import {
  getDamagePrepareListList,
  getOrderAssets,
  getSettle,
  setDeliverable,
} from '@/services/operate/returnSettlement';
import { returnSettlementItemType } from '../../data';
import ReturnListModal from '../components/returnListModal';

import ImageModal from '@/components/ImageModel';
import ReceiptListModal from '../components/receiptModal';

const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [visible, setVisible] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [record, setRecord] = useState<returnSettlementItemType | undefined>(
    undefined,
  );
  const [visible1, setVisible1] = useState<boolean>(false);
  const [imageList, setImageList] = useState<string | string[]>([]);
  const [visible2, setVisible2] = useState<boolean>(false);
  const [editId2, setEditId2] = useState<string | undefined>(undefined);
  // 新增 编辑 关闭Modal
  const isShowModal = (
    show: boolean,
    row?: returnSettlementItemType,
    id?: string,
  ) => {
    setVisible(show);
    setEditId(id);
    setRecord(row);
  };
  // 查看图片 modal
  const isShowModal1 = (show: boolean, row?: any) => {
    setVisible1(show);
    setImageList(row);
  };
  // 新增 编辑 关闭Modal 查看单据
  const isShowModal2 = (
    show: boolean,
    row?: returnSettlementItemType,
    id?: string,
  ) => {
    setVisible2(show);
    setEditId2(id);
  };
  // 获取列表
  const getList = async (params: any) => {
    const param = {
      $tableLimit: {
        page: params.current,
        count: params.pageSize,
      },
      $tableSearch: [
        {
          field: 'assets_uu_number',
          value: params.assets_uu_number
            ? params.assets_uu_number
            : '__ignore__',
          op: 7,
        },
        {
          field: 'user_name',
          value: params.user_name ? params.user_name : '__ignore__',
          op: 7,
        },
        {
          field: 'status',
          value: params.status ? params.status : '__ignore__',
          op: 0,
        },
        {
          field: 'assets_license',
          value: params.assets_license ? params.assets_license : '__ignore__',
          op: 7,
        },
      ],
      $tableSort: [],
    };
    const {
      data: { list, total },
      status,
    } = await getDamagePrepareListList(param);
    return {
      data: list,
      total,
      success: status === 0,
    };
  };
  //to order detail
  const toOrderDetail = (id: string) => {
    history.push({
      pathname: '/custom/orderDetail',
      query: {
        id,
      },
    });
  };
  // 确认定损
  const onFinish = async (list: any[]) => {
    if (list.length == 0) {
      message.warn('定损记录不能为空！');
      return;
    }
    const param = {
      order_assets_id: record!.id,
      damage_record_ids: list.map((item) => item.id),
    };
    const { status, msg } = await getOrderAssets(param);
    if (status === 0) {
      message.success('操作成功');
      actionRef.current?.reload();
      isShowModal(false);
    } else {
      message.warn(msg);
    }
  };

  // 结算
  const settle = async (id: string) => {
    const { status, msg } = await getSettle({ order_assets_id: id });
    if (status === 0) {
      message.success('操作成功');
      actionRef.current?.reload();
    } else {
      message.warn(msg);
    }
  };

  const columns: ProColumns<returnSettlementItemType>[] = [
    {
      title: '序号',
      key: 'first',
      align: 'center',
      hideInSearch: true,
      valueType: 'index',
      width: 60,
    },
    {
      title: '资产编号',
      dataIndex: 'assets_uu_number',
      align: 'center',
      key: 'assets_uu_number',
    },
    {
      title: '车牌号',
      dataIndex: 'assets_license',
      align: 'center',
      key: 'assets_license',
    },
    {
      title: '订单编号',
      dataIndex: 'order_uu_number',
      align: 'center',
      key: 'order_uu_number',
      hideInSearch: true,
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
      key: 'user_name',
      align: 'center',
    },
    {
      title: '客户经理',
      key: 'seller_name',
      align: 'center',
      dataIndex: 'seller_name',
      hideInSearch: true,
    },
    {
      title: '定损金额',
      key: 'damage_amount',
      dataIndex: 'damage_amount',
      align: 'center',
      hideInSearch: true,
      valueType: 'money',
    },

    {
      title: '起租时间',
      dataIndex: 'start_time',
      align: 'center',
      key: 'start_time',
      valueType: 'dateTime',
      render: (_, record) =>
        moment(record.start_time * 1000).format('YYYY-MM-DD'),
      hideInSearch: true,
    },
    {
      title: '收车时间',
      dataIndex: 'prepare_time',
      align: 'center',
      key: 'prepare_time',
      valueType: 'dateTime',
      render: (_, record) =>
        record.prepare_time
          ? moment(record.prepare_time * 1000).format('YYYY-MM-DD')
          : '-',
      hideInSearch: true,
    },
    {
      title: '资产状态',
      key: 'status',
      align: 'center',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        '0': { text: '整备中' },
        '1': { text: '可交付' },
        '2': { text: '已锁定' },
        '3': { text: '已发车' },
        '4': { text: '在租中' },
        '5': { text: '待还车' },
        '6': { text: '已报废' },
        '7': { text: '已回收' },
      },
    },
    {
      title: '收车记录',
      dataIndex: 'prepare_images',
      align: 'center',
      key: 'prepare_images',
      hideInSearch: true,
      render: (_, record: returnSettlementItemType) => {
        return (
          <a
            onClick={() => {
              isShowModal1(true, record.prepare_images);
            }}
          >
            查看
          </a>
        );
      },
    },
    {
      title: '单据',
      dataIndex: 'bianhao',
      align: 'center',
      key: 'uu_number',
      hideInSearch: true,
      render: (_, record: returnSettlementItemType) => {
        return (
          <a
            onClick={() => {
              isShowModal2(true, record, record.assets_id);
            }}
          >
            查看
          </a>
        );
      },
    },
    {
      title: '结算单状态',
      key: 'is_settle',
      align: 'center',
      dataIndex: 'is_settle',
      valueType: 'select',
      hideInSearch: true,
      valueEnum: {
        '0': { text: '待结算' },
        '1': { text: '已结算' },
      },
    },

    {
      title: '操作',
      align: 'center',
      key: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 220,
      render: (text, record: returnSettlementItemType) => {
        if (record.is_damage == 0) {
          return [
            <a
              onClick={() => {
                isShowModal(true, record, record.assets_id);
              }}
            >
              确认定损
            </a>,
          ];
        } else {
          return [
            record.is_settle == 0 && (
              <a
                onClick={() => {
                  settle(record.id);
                }}
              >
                确认结算
              </a>
            ),
            record.status != 1 && (
              <a
                onClick={async () => {
                  const { status, msg } = await setDeliverable({
                    order_assets_id: record?.id,
                  });
                  if (status === 0) {
                    message.success('操作成功');
                    actionRef.current?.reload();
                  } else {
                    message.error(msg);
                  }
                }}
              >
                置为可交付
              </a>
            ),
          ];
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
      <ProTable<returnSettlementItemType>
        bordered
        columns={columns}
        actionRef={actionRef}
        request={(params) => getList(params)}
        editable={{
          type: 'multiple',
        }}
        scroll={{ x: 1600 }}
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
        headerTitle="资产结算单列表"
        toolBarRender={() => [
          // <Button
          // >
          //     导出
          // </Button>,
        ]}
      />
      {/* 查看详情弹窗 */}
      {!visible ? (
        ''
      ) : (
        <ReturnListModal
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
        <ImageModal
          visible={visible1}
          isShowModal={isShowModal1}
          list={imageList}
          title={'收车记录'}
        />
      )}
      {!visible2 ? (
        ''
      ) : (
        <ReceiptListModal
          visible={visible2}
          isShowModal={isShowModal2}
          editId={editId2}
        />
      )}
    </PageContainer>
  );
};
export default Index;
