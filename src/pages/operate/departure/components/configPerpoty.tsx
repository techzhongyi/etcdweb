import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'antd';
import { departureItemType, modalType } from '../../data';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { getAllAssetList } from '@/services/property/common';
import moment from 'moment';

const ConfigPerpotyModal: React.FC<modalType<departureItemType>> = (
  props: any,
) => {
  const actionRef = useRef<ActionType>();
  const { visible, isShowModal, onFinish, record, editId, ids } = props;
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [totalSelectd, setTotalSelectd] = useState<any>([]);
  const [storageItem, setStorageItem] = useState<any>({});
  const [storageRow, setStorageRow] = useState<any>({});
  const [storagePage, setStoragePage] = useState(1);
  // 获取列表
  const getList = async (params: any) => {
    setStoragePage(params.current);
    if (params.current != storagePage) {
      setSelectedRowKeys(storageItem[params.current]);
    }
    const param = {
      $tableLimit: {
        page: params.current,
        count: params.pageSize,
      },
      $tableSearch: [
        { field: 'category_id', value: editId, op: 0 },
        { field: 'status', value: 1, op: 0 },
        {
          field: 'license',
          value: params.license ? params.license : '__ignore__',
          op: 7,
        },
      ],
      assets_filter_ids: ids.map((item) => item.id),
      $tableSort: [],
    };
    const {
      data: { list, total },
      status,
    } = await getAllAssetList(param);
    return {
      data: list,
      total,
      success: status === 0,
    };
  };
  const onSelectChange = (value: any, row: any) => {
    let arr_: any[] = [];
    setSelectedRowKeys(value);
    storageItem[storagePage] = value;
    storageRow[storagePage] = row;
    setStorageItem(storageItem);
    setStorageRow(storageRow);
    Object.values(storageRow).map((value: any) => {
      arr_ = value.concat(arr_);
    });
    setTotalSelectd(arr_);
  };
  const columns: ProColumns<departureItemType>[] = [
    {
      title: '资产编号',
      dataIndex: 'num',
      key: 'num',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '车型',
      dataIndex: 'model',
      key: 'model',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '车架号',
      dataIndex: 'vin',
      key: 'vin',
      align: 'center',
      hideInSearch: true,
      hideInTable: record.category_type == 4,
    },
    {
      title: '电池品牌',
      key: 'battery_type',
      align: 'center',
      dataIndex: 'battery_type',
      valueType: 'select',
      hideInSearch: true,
      hideInTable: record.category_type == 4 || record.category_type == 5,
      editable: false,
      valueEnum: {
        '1': { text: '宁德时代' },
        '2': { text: '国轩动力电池41.93度' },
        '3': { text: '宁德时代100.41度' },
        '4': { text: '亿纬锂能' },
      },
    },
    {
      title: '车牌号',
      dataIndex: 'license',
      key: 'license',
      align: 'center',
      hideInTable: record.category_type == 4,
    },
    {
      title: '年检日期',
      key: 'annual_inspection_time',
      align: 'center',
      dataIndex: 'annual_inspection_time',
      hideInSearch: true,
      valueType: 'dateTime',
      render: (_, record) =>
        record.annual_inspection_time
          ? moment(record.annual_inspection_time * 1000).format('YYYY-MM-DD')
          : '-',
    },
    {
      title: '保险日期',
      key: 'insurance_time',
      dataIndex: 'insurance_time',
      align: 'center',
      hideInSearch: true,
      valueType: 'dateTime',
      hideInTable: record.category_type == 4,
      render: (_, record) =>
        record.insurance_time
          ? moment(record.insurance_time * 1000).format('YYYY-MM-DD')
          : '-',
    },
    {
      title: '厂家交付日期',
      dataIndex: 'deliver_time',
      key: 'deliver_time',
      align: 'center',
      valueType: 'dateTime',
      render: (_, record) =>
        moment(record.deliver_time * 1000).format('YYYY-MM-DD'),
      hideInSearch: true,
    },
    {
      title: '载货立方',
      dataIndex: 'cube',
      key: 'cube',
      align: 'center',
      hideInSearch: true,
      hideInTable: record.category_type == 1,
    },
  ];
  const onModealCancel = () => {
    isShowModal(false);
  };
  return (
    <Modal
      title="资产列表"
      width={1200}
      open={visible}
      onOk={() => {
        onFinish(totalSelectd);
      }}
      maskClosable={false}
      onCancel={onModealCancel}
      destroyOnClose={true}
      bodyStyle={{ paddingTop: '10px' }}
    >
      <ProTable<departureItemType>
        className="carTable"
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
        tableAlertRender={false}
        bordered
        columns={columns}
        request={(params) => getList(params)}
        actionRef={actionRef}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        pagination={{
          pageSize: pageSize,
          showSizeChanger: true,
          onShowSizeChange: (current, pageSize) => {
            setPageSize(pageSize);
          },
        }}
        search={{
          labelWidth: 'auto',
        }}
        options={false}
        dateFormatter="string"
        style={{
          margin: '0 -20px',
          padding: '0!important',
          paddingTop: '20px',
        }}
      />
    </Modal>
  );
};
export default ConfigPerpotyModal;
