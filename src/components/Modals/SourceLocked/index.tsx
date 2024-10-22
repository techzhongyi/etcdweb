import React, { useRef, useState } from 'react';
import ProForm, { ModalForm, ProFormSelect } from '@ant-design/pro-form';
import { Button, Modal, Select, Space, Table, Tooltip } from 'antd';
import ProTable, { ActionType } from '@ant-design/pro-table';
import {
  postSourceQuoteList,
  getSourceQuoteList,
} from '@/services/procurement/detail';
import { getSourcePurList } from '@/services/procurement/procurement';

const SourceLockedModal = (prop: {
  visible: any;
  onCancel: any;
  cur_purchase_id: any;
}) => {
  const { visible, onCancel, cur_purchase_id } = prop;
  const actionRef = useRef<ActionType>();
  const [quoteData, setQuoteData] = useState([]);
  const [prepriceId, setPrepriceId] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const columns = [
    {
      title: '单位',
      width: 0,
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
    },
    {
      title: '总价',
      dataIndex: 'price',
      editable: false,
    },

    {
      title: '面试结果',
      dataIndex: 'interview_txt',
      ellipsis: true,
    },
    {
      title: '是否在项目中',
      dataIndex: 'history_purchase_ids',
      valueType: 'select',
      ellipsis: true,
      copyable: true,
      render: (_: any, record: { mode: any }) => {
        const project = record?.history_purchase_ids;
        return project ? (
          <Tooltip placement="top" title={record?.history_purchase_ids}>
            <a>是</a>
          </Tooltip>
        ) : (
          '否'
        );
      },
    },
  ];

  //获取报价单列表
  const quoteList = async (params: any) => {
    const param = {
      behavior: 'list',
      list: {
        purchase_id: params,
      },
    };
    const {
      status,
      data: { items },
    } = await getSourceQuoteList(param);
    if (status === 0) {
      let array: any = [];
      items.map((item: any) => {
        array.push({
          label: item.uu_number,
          value: item.id,
        });
      });
      setQuoteData(array);
    } else {
      return [];
    }
  };

  //获取报价单列表
  const quoteDetail = async (params: any) => {
    const param = {
      behavior: 'detail',
      detail: {
        ...params,
        page: params.current,
        count: params.pageSize,
        preprice_id: prepriceId,
      },
    };
    const { status, data } = await getSourceQuoteList(param);
    if (status === 0) {
      if (quoteData.length > 0) {
        return {
          data: data?.items,
          total: data?.total,
          success: status === 0,
        };
      } else {
        return [];
      }
    } else {
      return [];
    }
  };

  //获取资源采购单列表 资源项目-1， 非资源项目-0 **
  const getPurList = async (params: any) => {
    const param = {
      behavior: 'list',
      list: {
        type: 1,
        page: 1,
        count: 100,
        status: 1,
        is_sample_data: 1,
      },
    };
    const {
      data: { list },
      status,
    } = await getSourcePurList(param);
    if (status === 0) {
      let array: { label: any; value: any }[] = [];
      list.items.map((item: any) => {
        array.push({
          label: item.name,
          value: item.id,
        });
      });
      return array;
    } else {
      return [];
    }
  };

  const onFinish = async (val: any) => {
    let preprice_detail_ids = selectedRows?.map((item) => item.id);
    const param = {
      cur_purchase_id: cur_purchase_id, //采购单详情传过来的id
      purchase_id: val.purchase_id,
      preprice_id: val.preprice_id,
      preprice_detail_ids: preprice_detail_ids,
    };
    const { status } = await postSourceQuoteList(param);
    if (status === 0) {
      onCancel(0);
    }
  };

  //采购单选择事件
  function handleChange(val: any): void {
    quoteList(val);
    actionRef?.current?.reload();
  }

  //报价单选择事件
  function handleChange2(val: any): void {
    setPrepriceId(val);
    actionRef?.current?.reload();
  }

  const onSelectChange = (value: any, row: any) => {
    setSelectedRows(row);
    setSelectedRowKeys(value);
  };

  return (
    <Modal
      title="资源锁定"
      width="812px"
      bodyStyle={{
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
      }}
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <ProForm
        submitter={{
          render: (props, dom) => (
            <div style={{ textAlign: 'right', paddingRight: 24 }}>
              <Space>
                <Button onClick={() => onCancel(false)}>取消</Button>
                <Button
                  type="primary"
                  key="submit"
                  onClick={() => {
                    props.form?.submit?.();
                  }}
                >
                  提交
                </Button>
              </Space>
            </div>
          ),
        }}
        onFinish={onFinish}
      >
        <div style={{ paddingTop: 16, paddingLeft: 24, paddingRight: 24 }}>
          <ProFormSelect
            label="采购单"
            name="purchase_id"
            showSearch
            fieldProps={{
              onChange: (val) => handleChange(val),
            }}
            placeholder="请选择采购单"
            style={{ width: '300px' }}
            request={async (params) => getPurList(params)}
          ></ProFormSelect>
        </div>
        <div style={{ paddingLeft: 24, paddingRight: 24 }}>
          <ProFormSelect
            label="报价单"
            name="preprice_id"
            showSearch
            disabled={quoteData?.length > 0 ? false : true}
            placeholder="请选择报价单"
            style={{ width: '300px' }}
            options={quoteData}
            fieldProps={{
              placeholder:
                quoteData?.length > 0
                  ? '请选择报价单'
                  : '该采购单下对应的报价单',
              onChange: (val) => handleChange2(val),
            }}
          ></ProFormSelect>
        </div>

        <ProTable
          bordered
          columns={columns}
          actionRef={actionRef}
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          request={(params) => quoteDetail(params)}
          search={false}
          rowKey="id"
          pagination={{
            pageSize: 10,
          }}
          options={false}
          dateFormatter="string"
        />
      </ProForm>
    </Modal>
  );
};

export default SourceLockedModal;
