import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm, message } from 'antd';
import { history } from 'umi';
import moment from 'moment';
import RegulatAddModal from '../components/regulatAddModal';
import {
  addRegulations,
  deleteRegulations,
  editRegulations,
  getRegulations,
  importRegulations,
} from '@/services/operate/regulations';
import { operateReturnSettlement } from '../../data';
import UploadImg from '@/components/Upload/UploadImg';
import ExportTemp from '@/components/ExportTemp';
const Index: React.FC = () => {
  const url = '/devops/export_violation';
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [visible, setvisible] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [record, setRecord] = useState<operateReturnSettlement | undefined>(
    undefined,
  );
  const [fileList, setFileList] = useState([]);
  // 搜索条件筛选
  const [searchObj, setSearchObj] = useState({});
  const isShowModal = (
    show: boolean,
    record?: operateReturnSettlement,
    id?: string,
  ) => {
    setvisible(show);
    setEditId(id);
    setRecord(record);
  };
  // 获取违章列表
  const getList = async (params: any) => {
    setSearchObj({
      uu_number: params.uu_number ? params.uu_number : '',
      assets_number: params.assets_number ? params.assets_number : '',
      order_number: params.order_number ? params.order_number : '',
      assets_license: params.assets_license ? params.assets_license : '',
    });
    const param = {
      $tableLimit: {
        page: params.current,
        count: params.pageSize,
      },
      $tableSearch: [
        {
          field: 'uu_number',
          value: params.uu_number ? params.uu_number : '__ignore__',
          op: 7,
        },
        {
          field: 'assets_number',
          value: params.assets_number ? params.assets_number : '__ignore__',
          op: 7,
        },
        {
          field: 'order_number',
          value: params.order_number ? params.order_number : '__ignore__',
          op: 7,
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
      data,
      data: { list },
      status,
    } = await getRegulations(param);
    return {
      data: list,
      total: data.total,
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
  // 提交
  const onFinish = async (value: any) => {
    if (editId === undefined) {
      const param = {
        assets_id: value.num.value, //资产id
        assets_number: value.num.label, //资产编号
        assets_type: value.assets_type, //资产类型
        images: value.images, //违章图片
        time: new Date(value.time).getTime() / 1000, //违章时间
        assets_info:
          value.brand +
          '-' +
          value.lisence +
          '-' +
          value.model +
          '-' +
          value.vin, //资产品牌
        assets_license: value.lisence,
        type: value.type, //违规行为
        number: value.number ? value.number : '', //违规编码
        processing_period: value.processing_period * 1, //违章处理期限
        amount: value.amount * 1, //违规金额
        order_number: value.order_number, //订单id
      };
      // 新增
      const { status, msg } = await addRegulations(param);
      if (status === 0) {
        message.success('添加成功');
        actionRef.current?.reload();
        isShowModal(false);
      } else {
        message.error(msg);
      }
    } else {
      const param = {
        assets_id: value.num.value, //资产id
        assets_number: value.num.label, //资产编号
        assets_type: value.assets_type, //资产类型
        images: value.images, //违章图片
        time: new Date(value.time).getTime() / 1000, //违章时间
        assets_info:
          value.brand +
          '-' +
          value.lisence +
          '-' +
          value.model +
          '-' +
          value.vin, //资产品牌
        assets_license: value.lisence,
        type: value.type, //违规行为
        number: value.number ? value.number : '', //违规编码
        processing_period: value.processing_period * 1, //违章处理期限
        amount: value.amount * 1, //违规金额
        order_number: value.order_number, //订单id
      };
      // 编辑
      const { status, msg } = await editRegulations({ ...param, id: editId });
      if (status === 0) {
        message.success('修改成功');
        actionRef.current?.reload();
        isShowModal(false);
      } else {
        message.error(msg);
      }
    }
  };
  const columns: ProColumns<operateReturnSettlement>[] = [
    {
      title: '序号',
      align: 'center',
      key: 'first',
      hideInSearch: true,
      valueType: 'index',
      width: 60,
    },
    {
      title: '违章单号',
      dataIndex: 'uu_number',
      align: 'center',
      key: 'uu_number',
      width: 100,
    },
    {
      title: '订单编号',
      dataIndex: 'order_number',
      key: 'order_number',
      align: 'center',
      width: 100,
      hideInSearch: true,
      render: (_, record: operateReturnSettlement) => {
        return (
          <a
            onClick={() => {
              toOrderDetail(record.order_id);
            }}
          >
            {record.order_number}
          </a>
        );
      },
    },
    {
      title: '车牌号',
      align: 'center',
      key: 'assets_license',
      dataIndex: 'assets_license',
      width: 100,
    },
    {
      title: '资产编号',
      dataIndex: 'assets_number',
      align: 'center',
      key: 'assets_number',
    },
    {
      title: '资产类型',
      key: 'assets_type',
      align: 'center',
      dataIndex: 'assets_type',
      valueType: 'select',
      hideInSearch: true,
      width: 80,
      valueEnum: {
        '1': { text: '重卡' },
        '2': { text: '轻卡' },
        '3': { text: 'VAN车' },
        '4': { text: '车厢' },
        '5': { text: '挂车' },
      },
    },
    {
      title: '品牌',
      key: 'assets_info',
      dataIndex: 'assets_info',
      hideInSearch: true,
      align: 'center',
      render: (_, record) => record.assets_info.split('-')[0],
    },
    {
      title: '车型',
      align: 'center',
      key: 'assets_info',
      dataIndex: 'assets_info',
      hideInSearch: true,
      render: (_, record) => record.assets_info.split('-')[2],
    },
    {
      title: '违章行为',
      key: 'type',
      align: 'center',
      dataIndex: 'type',
      valueType: 'select',
      hideInSearch: true,
      valueEnum: {
        '1': { text: '超速' },
        '2': { text: '超载' },
        '3': { text: '违章超车' },
        '4': { text: '违章停车' },
        '5': { text: '疲劳驾驶' },
        '6': { text: '无证驾驶' },
        '7': { text: '酒后驾驶' },
        '8': { text: '病车及报废车上路' },
        '9': { text: '转借机动车牌证' },
        '10': { text: '其他' },
      },
    },
    {
      title: '违章编码',
      key: 'number',
      align: 'center',
      dataIndex: 'number',
      hideInSearch: true,
    },
    {
      title: '违章金额',
      key: 'amount',
      dataIndex: 'amount',
      align: 'center',
      hideInSearch: true,
      valueType: 'money',
    },
    {
      title: '违章时间',
      dataIndex: 'time',
      key: 'time',
      align: 'center',
      valueType: 'dateTime',
      render: (_, record) => moment(record.time * 1000).format('YYYY-MM-DD'),
      hideInSearch: true,
    },
    {
      title: '违章处理期限（天）',
      align: 'center',
      key: 'processing_period',
      width: 160,
      dataIndex: 'processing_period',
      hideInSearch: true,
    },
    {
      title: '客户名称',
      key: 'user_name',
      align: 'center',
      dataIndex: 'user_name',
      hideInSearch: true,
    },
    {
      title: '经办人',
      key: 'creator_name',
      align: 'center',
      dataIndex: 'creator_name',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      hideInSearch: true,
      align: 'center',
      valueType: 'select',
      valueEnum: {
        '0': { text: '未处理' },
        '1': { text: '已处理' },
      },
    },
    {
      title: '操作',
      key: 'option',
      align: 'center',
      valueType: 'option',
      fixed: 'right',
      width: 100,
      render: (text, record: operateReturnSettlement) => [
        <Button
          type="link"
          onClick={() => {
            isShowModal(true, record, record.id);
          }}
        >
          编辑
        </Button>,
        <Popconfirm
          onConfirm={async () => {
            const { status, msg } = await deleteRegulations({
              id: record?.id,
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
          <Button type="link">删除</Button>
        </Popconfirm>,
        <Popconfirm
          onConfirm={async () => {
            const { status, msg } = await editRegulations({
              id: record?.id,
              status: 1,
            });
            if (status === 0) {
              message.success('操作成功');
              actionRef.current?.reload();
            } else {
              message.error(msg);
            }
          }}
          key="popconfirm"
          title="处理后状态不可恢复，确认处理吗?"
          okText="是"
          cancelText="否"
        >
          <Button type="link" disabled={record.status == 1}>
            处理
          </Button>
        </Popconfirm>,
      ],
    },
  ];
  // 下载模板
  const downloadtemp = () => {
    window.location.href =
      'https://aiev56.com/download/violation_template.xlsx';
  };
  // 导入
  const setImport = async (file_id: any, status: any) => {
    if (status === 'uploading') {
    } else if (status === 0) {
      const { status, msg } = await importRegulations({ __file_id__: file_id });
      if (status === 0) {
        message.success('导入数据成功');
        actionRef.current?.reload();
      } else {
        message.error(msg);
      }
    }
  };
  return (
    <PageContainer
      ghost
      header={{
        title: ' ',
        breadcrumb: {},
      }}
    >
      <ProTable<operateReturnSettlement>
        bordered
        columns={columns}
        actionRef={actionRef}
        request={(params) => getList(params)}
        editable={{
          type: 'multiple',
        }}
        scroll={{ x: 2200 }}
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
        headerTitle="违章列表"
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              isShowModal(true);
            }}
          >
            新增
          </Button>,
          <UploadImg
            accept=".xlsx"
            fileList={fileList}
            setSrc={setImport}
            isShowUploadList={false}
            maxCount={1}
            listType={'text'}
          >
            <Button>导入</Button>
          </UploadImg>,
          <ExportTemp url={url} searchObj={searchObj} />,
          <Button
            onClick={() => {
              downloadtemp();
            }}
          >
            下载模板
          </Button>,
        ]}
      />
      {!visible ? (
        ''
      ) : (
        <RegulatAddModal
          isShowModal={isShowModal}
          onFinish={onFinish}
          visible={visible}
          record={record}
          editId={editId}
        />
      )}
    </PageContainer>
  );
};
export default Index;
