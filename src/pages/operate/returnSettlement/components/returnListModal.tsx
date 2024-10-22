import React, { useRef, useState } from 'react';
import { Modal, Image } from 'antd';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { getDamageRecordList } from '@/services/operate/returnSettlement';
import moment from 'moment';
const ReturnListModal: React.FC<any> = (props: any) => {
  const actionRef = useRef<ActionType>();
  const { visible, isShowModal, editId, onFinish } = props;
  const [dataList, setDataList] = useState<any[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const title = '定损记录';
  // 获取结算历史列表
  const getList = async (params: any) => {
    const param = {
      $tableLimit: {
        page: params.current,
        count: params.pageSize,
      },
      $tableSearch: [{ field: 'assets_id', value: editId, op: 0 }],
      $tableSort: [],
    };
    const {
      data: { list, total },
      status,
    } = await getDamageRecordList(param);
    setDataList(list);
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
      hideInSearch: true,
      align: 'center',
      valueType: 'index',
      width: 60,
    },
    {
      title: '定损单号',
      dataIndex: 'uu_number',
      align: 'center',
      key: 'uu_number',
    },
    {
      title: '定损内容',
      dataIndex: 'desc',
      align: 'center',
      key: 'desc',
    },
    {
      title: '定损金额',
      dataIndex: 'amount',
      align: 'center',
      key: 'amount',
      valueType: 'money',
    },
    {
      title: '定损时间',
      dataIndex: 'create_time',
      key: 'create_time',
      valueType: 'dateTime',
      align: 'center',
      render: (_, record) =>
        moment(record.create_time * 1000).format('YYYY-MM-DD'),
      hideInSearch: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      key: 'remark',
      ellipsis: true,
    },
    {
      title: '凭证备注',
      key: 'image',
      dataIndex: 'image',
      valueType: 'image',
      hideInSearch: true,
      align: 'center',
      render: (_, record) => {
        return record.images?.map((item: any) => {
          return <Image src={item} width={60} height={60} />;
        });
      },
    },
  ];
  return (
    <Modal
      title={title}
      width={866}
      onOk={() => {
        onFinish(dataList);
      }}
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
export default ReturnListModal;
