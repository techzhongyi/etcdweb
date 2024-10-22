import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';

import './index.less';
import {
  getQuoteDetail,
  putPurLevel,
  putSelect,
} from '@/services/procurement/detail';
import moment from 'moment';
import { fomatFloat } from '@/utils/common';

const detail = {
  items: [
    {
      after_job_level: null,
      amount: 0,
      before_job_level: '',
      create_time: 0,
      good_at: '',
      id: 0,
      interview_txt: null,
      is_select: 0,
      job: '',
      price: 0,
      worker_id: 0,
      worker_name: '',
    },
  ],
  prep_info: {
    create_time: 0,
    id: '',
    mode: 0,
    purchase_id: '',
    serve_type: '',
    status: 0,
    supplier_id: 0,
    supplier_name: null,
    supplier_phone: null,
    total_count: 0,
    total_price: 0,
    uu_number: '',
  },
};
const prep_info = {
  create_time: 0,
  id: '',
  mode: 0,
  purchase_id: '',
  serve_type: '',
  status: 0,
  supplier_id: 0,
  supplier_name: null,
  supplier_phone: null,
  total_count: 0,
  total_price: 0,
  uu_number: '',
};

const QuoteDetailModal = (prop: {
  visible: any;
  onCancel: any;
  exportPerInfo: any;
  exportItvResult: any;
  quoteId: any;
  purchaseId: any;
  mode: any;
}) => {
  const { visible, onCancel, quoteId, purchaseId, mode } = prop;
  const actionRef = useRef();
  const [quoteData, setQuoteData] = useState(prep_info);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const columns = [
    {
      title: '报价单ID',
      dataIndex: 'uu_number',
    },
    {
      title: '外包类型',
      dataIndex: 'mode',
      valueType: 'select',
      render: (_: any, record: { mode: any }) => {
        let modeName: String;
        switch (record?.mode) {
          case 1:
            modeName = '整包';
            break;
          case 2:
            modeName = '人天';
            break;
          case 3:
            modeName = '人月';
            break;
          default:
            modeName = '';
        }
        return modeName;
      },

      hideInSearch: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      valueType: 'select',
      fieldProps: {
        options: [
          {
            value: 5,
            label: '人月',
          },
          {
            value: 6,
            label: '人天',
          },
          {
            value: 7,
            label: '其他',
          },
          {
            value: 8,
            label: '系统',
          },
        ],
      },
      hideInTable: mode == 1 ? false : true,
    },
    {
      title: '安全服务类型',
      dataIndex: 'serve_name',
    },

    {
      title: '供应商名称',
      dataIndex: 'supplier_name',
    },
    {
      title: '供应商联系方式',
      dataIndex: 'supplier_phone',
    },
    {
      title: '时间',
      key: 'showTime',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      render: (text: any, record: { create_time: number }) => {
        return record.create_time
          ? moment(record.create_time * 1000).format('YYYY-MM-DD HH:mm:ss')
          : '-';
      },
    },
    {
      title: '金额',
      dataIndex: 'total_price',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      ellipsis: true,
      hideInTable: mode == 1 ? false : true,
    },
  ];

  const columnsList = [
    {
      title: '单位',
      dataIndex: 'mode',
      valueType: 'select',
      render: (_: any, record: { mode: any }) => {
        let modeName: String;
        switch (record.mode) {
          case 1:
            modeName = '整包';
            break;
          case 2:
            modeName = '人天';
            break;
          case 3:
            modeName = '人月';
            break;
          default:
            modeName = '';
        }
        return modeName;
      },
      editable: false,
      hideInSearch: true,
    },
    {
      title: '单价',
      dataIndex: 'price',
      editable: false,
    },
    {
      title: '数量',
      dataIndex: 'amount',
      width: 60,
      editable: false,
    },
    {
      title: '姓名',
      dataIndex: 'worker_name',
      editable: false,
    },
    {
      title: '岗位',

      dataIndex: 'job',
      editable: false,
    },
    {
      title: '岗级',
      dataIndex: 'after_job_level',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      fieldProps: {
        maxLength: 20,
      },
    },
    {
      title: '总价',
      editable: false,
      render: (text: any, record: any, _: any, action: any) => {
        return (
          <div key="total_price">
            {fomatFloat(record?.amount * record?.price, 2)}
          </div>
        );
      },
    },

    {
      title: '面试评价',
      dataIndex: 'interview_txt',
      editable: false,
      ellipsis: true,
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'interview_txt',
      valueType: 'option',
      fixed: 'right',
      width: 120,
      render: (
        text: any,
        record: { is_select: number; id: any; status: any },
        _: any,
        action: any,
      ) => [
        quoteData?.status > 2 ? (
          <div>{record?.is_select === 0 ? '选定' : '已选定'}</div>
        ) : (
          <a
            key="locked"
            onClick={async () => {
              let isSelect;
              switch (record?.is_select) {
                case 0:
                  isSelect = 1;
                  break;
                case 1:
                  isSelect = 0;
                  break;
              }
              const { status, msg } = await putSelect({
                purchase_id: purchaseId,
                prep_detail_id: record.id, //报价单-详情id
                is_select: isSelect, //是否选定，0-取消选定， 1-选定
              });
              if (status === 0) {
                actionRef?.current?.reload();
              } else {
                message.warn(msg);
              }
            }}
          >
            {record?.is_select === 0 ? '选定' : '取消选定'}
          </a>
        ),
        record?.is_select == 1 || quoteData?.status > 2 ? (
          <div style={{ color: '#dddddd' }}>编辑</div>
        ) : (
          <a
            key="editable"
            onClick={async () => {
              action?.startEditable?.(record.id);
            }}
          >
            编辑
          </a>
        ),
      ],
    },
  ];

  useEffect(() => {
    quotePackageDetail();
  }, []);

  const quotePackageDetail = async () => {
    if (mode == 1) {
      const param = {
        behavior: 'detail',
        detail: {
          page: 1,
          count: 10,
          id: quoteId,
          purchase_id: purchaseId,
        },
      };
      const { status, data } = await getQuoteDetail(param);
      if (status === 0) {
        setQuoteData(data.prep_info);
      }
    }
  };
  //报价单列表
  const quoteDetail = async (params: any) => {
    const param = {
      behavior: 'detail',
      detail: {
        page: params.current,
        count: params.pageSize,
        id: quoteId,
        purchase_id: purchaseId,
        ...params,
      },
    };
    const { status, data } = await getQuoteDetail(param);
    if (status === 0) {
      setQuoteData(data.prep_info);
    }
    return {
      data: data.items,
      total: data.total,
      success: status === 0,
    };
  };

  return (
    <Modal
      title="报价单详情"
      width="1200px"
      bodyStyle={{
        padding: 0,
      }}
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <ProTable
        bordered
        headerTitle="基本信息"
        columns={columns}
        actionRef={actionRef}
        dataSource={[quoteData]}
        search={false}
        rowKey="id"
        options={false}
        pagination={false}
        dateFormatter="string"
      />
      {mode === 1 ? (
        <></>
      ) : (
        <>
          <ProTable
            bordered
            headerTitle="人员列表"
            columns={columnsList}
            actionRef={actionRef}
            request={(params) => quoteDetail(params)}
            search={false}
            rowKey="id"
            options={false}
            dateFormatter="string"
            pagination={{
              pageSize: 10,
            }}
            editable={{
              type: 'single',
              editableKeys,
              onSave: async (value, data, originRow) => {
                const { status, msg } = await putPurLevel({
                  purchase_id: quoteData?.purchase_id, //采购单id
                  prep_id: quoteData?.id, //报价单id
                  detail_id: data.id, //报价单详情id
                  after_job_level: data.after_job_level,
                });
                if (status === 0) {
                  message.info('岗级修改成功！');
                } else {
                  message.error(msg);
                  return Promise.reject();
                }
                return Promise.resolve();
              },
              onChange: setEditableRowKeys,
              actionRender: (row, config, dom) => [dom.save, dom.cancel],
            }}
          ></ProTable>
          <div className="total_style">
            <div>总人数（人）：{quoteData?.total_count}</div>
            <div className="total_money">
              总合计：
              <div style={{ color: 'red' }}>{quoteData?.total_price}</div>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default QuoteDetailModal;
