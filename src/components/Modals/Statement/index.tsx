import React, { useRef, useState, useEffect } from 'react';
import { Button, message, Modal, Progress, Select, Space } from 'antd';
import ProTable, { EditableProTable } from '@ant-design/pro-table';
import moment from 'moment';

import './index.less';
import { editPaydetail, getPayQuoteList } from '@/services/procurement/detail';
import { downloadFile, Export } from '@/utils/export';
import { downloadXhrFile } from '@/services/common/downloadFile';
import ProForm from '@ant-design/pro-form';
import { fomatFloat, getDownload } from '@/utils/common';
import help from '@/utils/help';
const initBaseInfo = {
  total_count: 0,
  cert_url: '',
  total_payment_price: 0,
  mode: 0,
};
let initData: any[] = [];

const StatementModal = (props: any) => {
  const [certUrl, setCertUrl] = useState(initBaseInfo);
  const [baseInfoData, setBaseInfoData] = useState([]);
  // 导出日报loading
  const [dayperformanceLoading, setDayperformanceLoading] = useState(false);
  // 导出费用明细loading
  const [costdetailLoading, setCostdetailLoading] = useState(false);
  const [progressLine, setProgressLine] = useState(0);
  const [recordLine, setRecordLine] = useState(0);
  const { visible, onCancel, payDetailId, preDetailId, mode, payStatus } =
    props;
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState([]);
  const actionRef = useRef();
  const actionRefstaff = useRef();

  const [formObj] = ProForm.useForm();

  useEffect(() => {
    getDetail({ page: 1, count: 100 });
  }, []);

  const getDetail = async (params: any) => {
    const param = {
      behavior: 'detail',
      detail: {
        page: 1,
        count: 100,
        payment_id: payDetailId,
        purchase_id: preDetailId,
        mode,
        ...params,
      },
    };
    const {
      data,
      data: { payment_info },
    } = await getPayQuoteList(param);
    setCertUrl(payment_info);
    setBaseInfoData([payment_info]);
    setEditableRowKeys(() =>
      data.items.map((item: any, index: any) => item.id),
    );
    const list = data.items.map((item: any) => {
      if (+mode === 2) {
        return Object.assign(item, {
          pattern: item.pattern.toString(),
        });
      } else {
        return item;
      }
    });
    initData = [...list];
    setDataSource(list);
  };

  const columns = [
    {
      title: '结算单ID',
      dataIndex: 'uu_number',
    },
    {
      title: '外包类型',
      dataIndex: 'mode',
      render: (_, record) =>
        record.mode === 1
          ? '整包'
          : record.mode === 2
          ? '分包(人/天)'
          : record.mode === 3
          ? '分包(人/月)'
          : '',
    },
    {
      title: '安全服务类型',
      dataIndex: 'serve_name',
      render: (_, record) => {
        return <span>{record?.serve_name || '--'}</span>;
      },
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
      render: (_, record) =>
        record.create_time
          ? moment(record.create_time * 1000).format('YYYY-MM-DD')
          : '-',
    },
    {
      title: '报价金额',
      dataIndex: 'total_preprice_price',
    },
  ];
  const setDays = (values: any) => {
    const days = parseInt(values / 8);
    const discontentDay = values % 8 >= 4 ? 0.5 : 0;
    return days + discontentDay;
  };

  const columnsList = [
    {
      title: '单位',
      dataIndex: 'mode',
      editable: false,
      width: 100,
      render: (_, record) =>
        record.mode === 1
          ? '整包'
          : record.mode === 2
          ? '分包(人/天)'
          : record.mode === 3
          ? '分包(人/月)'
          : '',
    },
    {
      title: '工时',
      dataIndex: 'worker_time',
      editable: false,
      hideInTable: certUrl.mode === 3 ? true : false,
      width: 50,
    },
    {
      title: '模式',
      width: 110,
      hideInTable: certUrl.mode === 3 ? true : false,
      key: 'pattern',
      dataIndex: 'pattern',
      valueType: 'select',
      valueEnum: {
        1: {
          text: '自然天',
        },
        2: {
          text: '整除',
        },
      },
      editable: true,
    },
    {
      title: '单价',
      dataIndex: 'price',
      editable: false,
      width: 80,
    },
    {
      title: '数量',
      dataIndex: 'amount',
      width: certUrl.mode === 3 ? 110 : 80,
      render: (_, record) => {
        if (+record.pattern === 1) {
          return record.days;
        } else if (+record.pattern === 2) {
          return setDays(record.worker_time);
        } else {
          return record.amount;
        }
      },
      editable: certUrl.mode === 3 ? true : false,
      valueType: 'digit',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项！',
          },
          {
            pattern: help.Regular.number.just,
            message: '数量格式不正确！',
          },
        ],
      },
      fieldProps: {
        type: 'number',
        max: 10000,
      },
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
      width: 80,
      editable: false,
    },
    {
      title: '考核分数',
      dataIndex: 'score',
      width: 80,
      editable: false,
    },

    {
      title: '折价率%',
      dataIndex: 'discount_rate',
      valueType: 'digit',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
          {
            pattern: help.Regular.number.just,
            message: '折价率格式不正确！',
          },
        ],
      },
      fieldProps: {
        type: 'number',
        max: 100,
        min: 0,
      },
    },
    {
      title: '实际金额',
      dataIndex: 'total_price',
      valueType: 'digit',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
          {
            pattern: help.Regular.number.intege_lose,
            message: '实际金额格式！',
          },
        ],
      },
      fieldProps: {
        type: 'number',
        max: 9999999999,
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      fieldProps: {
        maxLength: 999,
      },
    },
    {
      title: '操作',
      dataIndex: 'remark',
      valueType: 'option',
      fixed: 'right',
      align: 'center',
      width: 100,
      render: (text, record, _, action) =>
        payStatus === 0
          ? [
              <a
                key="editable"
                onClick={() => {
                  action?.startEditable?.(record?.id);
                }}
              >
                编辑
              </a>,
            ]
          : ['-'],
    },
  ];

  // 导出日报
  const exportDayperformance = () => {
    setDayperformanceLoading(true);
    const params = {
      payment_id: payDetailId,
    };
    Export('/export/payment_dayperformance', params, async (res: any) => {
      if (res.status === 1) {
        const params = res.msg;
        downloadXhrFile(
          params,
          ({ loaded, total }) => {
            const percent = Math.round((loaded / total) * 100);
            setProgressLine(percent);
          },
          (res: any) => {
            if (res.status === 200) {
              const blob = new Blob([res.response], {
                type: 'text/plain; charset=UTF-8',
              });
              downloadFile(blob, '日报_' + params.filename);
              setProgressLine(0);
            }
            setDayperformanceLoading(false);
          },
        );
      } else if (res.status === 2) {
      } else {
        message.error(res.msg);
        setDayperformanceLoading(false);
      }
    });
  };
  // 导出费用明细
  const exportCostdetail = () => {
    setCostdetailLoading(true);
    const params = {
      payment_id: payDetailId,
    };
    Export('/export/payment_detail', params, async (res: any) => {
      if (res.status === 1) {
        const params = res.msg;
        downloadXhrFile(
          params,
          ({ loaded, total }) => {
            const percent = Math.round((loaded / total) * 100);
            setRecordLine(percent);
          },
          (res: any) => {
            if (res.status === 200) {
              const blob = new Blob([res.response], {
                type: 'text/plain; charset=UTF-8',
              });
              downloadFile(blob, '费用明细_' + params.filename);
              setRecordLine(0);
            }
            setCostdetailLoading(false);
          },
        );
      } else {
        message.error(res.msg);
        setCostdetailLoading(false);
      }
    });
  };

  return (
    <Modal
      title="结算单详情"
      width="1230px"
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
        dataSource={baseInfoData}
        columns={columns}
        actionRef={actionRef}
        search={false}
        rowKey="id"
        options={false}
        pagination={false}
        dateFormatter="string"
        toolBarRender={() =>
          mode === 1
            ? [
                <Button
                  danger
                  type="primary"
                  disabled={!certUrl?.cert_url}
                  onClick={() => {
                    getDownload(certUrl?.cert_url);
                    // window.location = certUrl?.cert_url+'?response-content-type=application/octet-stream';
                  }}
                >
                  下载凭证
                </Button>,
              ]
            : []
        }
      />

      {mode === 1 ? (
        <></>
      ) : (
        <>
          <ProTable
            bordered
            headerTitle="人员列表"
            dataSource={dataSource}
            value={dataSource}
            // request={(params) => getDetail(params)}
            columns={columnsList}
            toolBarRender={() => [
              <Button
                danger
                type="primary"
                disabled={!certUrl?.cert_url}
                onClick={() => {
                  getDownload(certUrl?.cert_url);
                  // window.location = certUrl?.cert_url;
                }}
              >
                下载凭证
              </Button>,
              <Button
                type="primary"
                disabled={costdetailLoading}
                onClick={() => {
                  exportCostdetail();
                }}
              >
                {costdetailLoading && (
                  <Progress
                    style={{ marginRight: '10px' }}
                    strokeColor="#5578F9"
                    trailColor="#fff"
                    type="circle"
                    percent={recordLine}
                    width={24}
                  />
                )}
                {costdetailLoading ? '导出中' : '导出费用明细'}
              </Button>,
              <Button
                type="primary"
                disabled={dayperformanceLoading}
                onClick={() => {
                  exportDayperformance();
                }}
              >
                {dayperformanceLoading && (
                  <Progress
                    style={{ marginRight: '10px' }}
                    strokeColor="#5578F9"
                    trailColor="#fff"
                    type="circle"
                    percent={progressLine}
                    width={24}
                  />
                )}

                {dayperformanceLoading ? '导出中' : '导出日报'}
              </Button>,
            ]}
            editableKeys
            editable={{
              type: 'single',
              form: formObj,
              onSave: async (value, data) => {
                let param = {};
                if (+mode === 3) {
                  // 人/月
                  param = {
                    payment_id: payDetailId,
                    payment_detail_id: data.id,
                    discount_rate: data.discount_rate * 1,
                    total_price: data.total_price * 1,
                    remark: data.remark || '',
                    mode,
                    amount: data.amount * 1,
                  };
                } else {
                  // 人/天
                  param = {
                    payment_id: payDetailId,
                    payment_detail_id: data.id,
                    discount_rate: data.discount_rate * 1,
                    total_price: data.total_price * 1,
                    remark: data.remark || '',
                    pattern: data.pattern * 1,
                    mode,
                  };
                }
                const { status } = await editPaydetail(param);
                if (status === 0) {
                  message.success('操作成功');
                  getDetail({ page: 1, count: 100 });
                } else {
                  message.error('操作失败');
                  return Promise.reject();
                }
              },
              onCancel: async (key, record, originRow) => {
                setDataSource(initData);
              },
              onValuesChange: (record, recordList) => {
                let _price;
                if (record.remark != '' && record.pre_remark != record.remark) {
                  Object.assign(record, {
                    pre_remark: record.remark,
                  });
                  return;
                }
                if (+record.pattern === 1 && +mode === 2) {
                  // 自然天
                  _price = fomatFloat(
                    record.price *
                      record.days *
                      ((record.discount_rate || 100) / 100),
                    2,
                  );
                  // 判断当前的实际金额是否和算法算出来的相等 如果不相等 代表手动输入实际金额
                  // 如果改变折价率和自然天or整除  就正常计算实际金额
                  if (
                    record.pre_rate != record.discount_rate ||
                    record.pre_pattern != record.pattern ||
                    record.total_price == _price ||
                    record.total_price == null
                  ) {
                    Object.assign(record, {
                      amount: record.days,
                      total_price: _price,
                      pre_rate: record.discount_rate,
                      pre_pattern: record.pattern,
                      pre_remark: record.remark,
                    });
                    formObj.setFieldsValue({
                      [editableKeys[0]]: { total_price: _price },
                    });
                  }
                  formObj.setFieldsValue({
                    [editableKeys[0]]: { total_price: record.total_price },
                  });
                } else if (+record.pattern === 2 && +mode === 2) {
                  // 整除
                  _price = fomatFloat(
                    record.price *
                      setDays(record.worker_time) *
                      ((record.discount_rate || 100) / 100),
                    2,
                  );
                  if (
                    record.pre_rate != record.discount_rate ||
                    record.pre_pattern != record.pattern ||
                    record.total_price == _price ||
                    record.total_price == null
                  ) {
                    Object.assign(record, {
                      amount: setDays(record.worker_time),
                      total_price: _price,
                      pre_rate: record.discount_rate,
                      pre_pattern: record.pattern,
                      pre_remark: record.remark,
                    });
                    formObj.setFieldsValue({
                      [editableKeys[0]]: { total_price: _price },
                    });
                  }
                  formObj.setFieldsValue({
                    [editableKeys[0]]: { total_price: record.total_price },
                  });
                } else {
                  // 分包（人/月）
                  _price = fomatFloat(
                    record.price * record.amount * (record.discount_rate / 100),
                    2,
                  );
                  if (
                    record.pre_rate != record.discount_rate ||
                    record.pre_amount != record.amount ||
                    record.total_price == _price ||
                    record.total_price == null
                  ) {
                    Object.assign(record, {
                      // amount: setDays(record.worker_time),
                      total_price: _price,
                      pre_rate: record.discount_rate,
                      pre_amount: record.amount,
                      pre_remark: record.remark,
                    });
                    formObj.setFieldsValue({
                      [editableKeys[0]]: { total_price: _price },
                    });
                  }
                  formObj.setFieldsValue({
                    [editableKeys[0]]: { total_price: record.total_price },
                  });
                }
                setDataSource(recordList);
              },
              actionRender: (row, config, dom) => [dom.save, dom.cancel],
              onChange: setEditableRowKeys,
            }}
            actionRef={actionRefstaff}
            search={false}
            rowKey="id"
            pagination={false}
            options={false}
            dateFormatter="string"
          ></ProTable>
          <div className="total_style">
            <div>总人数（人）：{certUrl?.total_count}</div>
            <div className="total_money">
              总合计：
              <div style={{ color: 'red' }}>{certUrl?.total_payment_price}</div>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default StatementModal;
