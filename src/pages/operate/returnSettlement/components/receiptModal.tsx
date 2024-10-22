import React, { useRef, useState } from 'react';
import { Modal, Image, Button } from 'antd';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import {
  getDamageRecordList,
  getList4assetsList,
} from '@/services/operate/returnSettlement';
import moment from 'moment';
const ReceiptListModal: React.FC<any> = (props: any) => {
  const actionRef = useRef<ActionType>();
  const { visible, isShowModal, editId } = props;
  const [pageSize, setPageSize] = useState<number>(10);
  const title = '单据列表';
  // 获取结算历史列表
  const getList = async (params: any) => {
    const param = {
      assets_id: editId,
      page: params.current,
      count: params.pageSize,
    };
    const {
      data: { list, total },
      status,
    } = await getList4assetsList(param);
    return {
      data: list,
      total,
      success: status === 0,
    };
  };
  const onModealCancel = () => {
    isShowModal(false);
  };
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      key: 'index',
      valueType: 'index',
      align: 'center',
      width: 60,
    },
    {
      title: '资产编号',
      dataIndex: 'assets_uu_number',
      key: 'assets_uu_number',
      align: 'center',
    },
    {
      title: '资产类型',
      dataIndex: 'assets_type',
      key: 'assets_type',
      hideInSearch: true,
      align: 'center',
      valueType: 'select',
      valueEnum: {
        '1': { text: '重卡' },
        '2': { text: '轻卡' },
        '3': { text: 'VAN车' },
        '4': { text: '车厢' },
        '5': { text: '挂车' },
      },
    },
    {
      title: '资产说明',
      dataIndex: 'assets_detail',
      key: 'assets_detail',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '单据单号',
      dataIndex: 'uu_number',
      key: 'uu_number',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '单据类型',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      valueType: 'select',
      valueEnum: {
        '1': { text: '对冲' },
        '2': { text: '系统租金对冲' },
        '3': { text: '违章' },
        '4': { text: '维修' },
        '5': { text: '租金' },
        '6': { text: '滞纳金' },
        '7': { text: '押金' },
        '8': { text: '定损' },
      },
    },
    {
      title: '单据金额',
      dataIndex: 'amount',
      key: 'amount',
      hideInSearch: true,
      align: 'center',
      valueType: 'money',
    },
    {
      title: '单据状态',
      dataIndex: 'status',
      key: 'status',
      hideInSearch: true,
      align: 'center',
      valueType: 'select',
      valueEnum: {
        '0': { text: '未核销' },
        '1': { text: '已核销' },
        '2': { text: '待核销' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      align: 'center',
      valueType: 'dateTime',
      render: (_, record) =>
        moment(record.create_time * 1000).format('YYYY-MM-DD HH:mm'),
      hideInSearch: true,
    },
    {
      title: '凭证备注',
      key: 'proof',
      dataIndex: 'proof',
      align: 'center',
      hideInSearch: true,
      ellipsis: true,
      render: (_, record) => {
        return record.proof?.length > 0
          ? record.proof?.map((item) => {
              return (
                <Image
                  src={item}
                  width={60}
                  height={60}
                  style={{ marginRight: '5px' }}
                />
              );
            })
          : '-';
      },
    },
  ];
  return (
    <Modal
      title={title}
      width={1200}
      footer={[
        <Button key="back" onClick={onModealCancel}>
          关闭
        </Button>,
      ]}
      open={visible}
      maskClosable={false}
      onCancel={onModealCancel}
      destroyOnClose={true}
    >
      <ProTable<any>
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
        rowKey="assets_id"
        search={false}
        pagination={{
          pageSize: pageSize,
          showSizeChanger: true,
          onShowSizeChange: (current, pageSize) => {
            setPageSize(pageSize);
          },
        }}
        options={false}
        dateFormatter="string"
        headerTitle={false}
        toolBarRender={false}
      />
    </Modal>
  );
};
export default ReceiptListModal;
