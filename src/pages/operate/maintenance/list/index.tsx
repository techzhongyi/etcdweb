import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm, message } from 'antd';
import { history } from 'umi';
import moment from 'moment';
import { operateMaintenance } from '../../data';
import MaintenanceAddModal from '../components/maintenanceAddModal';
import {
  addMaintenance,
  deleteMaintenance,
  editMaintenance,
  getMaintenance,
  importMaintenance,
} from '@/services/operate/maintenance';
import UploadImg from '@/components/Upload/UploadImg';
import ExportTemp from '@/components/ExportTemp';
import MaintenanceOpModal from '../components/maintenanceOpModal';

const Index: React.FC = () => {
  const url = '/devops/export_repair';
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [visible, setVisible] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [record, setRecord] = useState<operateMaintenance | undefined>(
    undefined,
  );
  const [visible1, setVisible1] = useState<boolean>(false);
  const [editId1, setEditId1] = useState<string | undefined>(undefined);
  const [record1, setRecord1] = useState<operateMaintenance | undefined>(
    undefined,
  );
  const [fileList, setFileList] = useState([]);
  // 搜索条件筛选
  const [searchObj, setSearchObj] = useState({});
  // 新增 编辑 关闭Modal
  const isShowModal = (
    show: boolean,
    row?: operateMaintenance,
    id?: string,
  ) => {
    setVisible(show);
    setEditId(id);
    setRecord(row);
  };
  const isShowModal1 = (
    show: boolean,
    row?: operateMaintenance,
    id?: string,
  ) => {
    setVisible1(show);
    setEditId1(id);
    setRecord1(row);
  };
  // 获取列表
  const getList = async (params: any) => {
    setSearchObj({
      uu_number: params.uu_number ? params.uu_number : '',
      order_number: params.order_number ? params.order_number : '',
      assets_license: params.assets_license ? params.assets_license : '',
      status: params.status ? params.status : '',
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
          field: 'order_number',
          value: params.order_number ? params.order_number : '__ignore__',
          op: 7,
        },
        {
          field: 'assets_license',
          value: params.assets_license ? params.assets_license : '__ignore__',
          op: 7,
        },
        {
          field: 'status',
          value: params.status ? params.status : '__ignore__',
          op: 0,
        },
      ],
      $tableSort: [],
    };
    const {
      data,
      data: { list },
      status,
    } = await getMaintenance(param);
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
        manufacturer_id: value.manufacturer_id.value, //维修厂商id
        manufacturer_name: value.manufacturer_id.label, //维修厂商名称
        assets_type: value.assets_type, //资产类型
        // images: value.images,//维修记录
        in_manufacturer_time:
          new Date(value.in_manufacturer_time).getTime() / 1000, //维修送厂时间
        out_time: new Date(value.out_time).getTime() / 1000, //预计出厂时间
        done_time: new Date(value.out_time).getTime() / 1000, //维修完成时间
        assets_info:
          value.brand +
          '-' +
          value.lisence +
          '-' +
          value.model +
          '-' +
          value.vin, //资产品牌
        assets_license: value.lisence,
        reason: value.reason, //维修原因
        // amount: value.amount * 1,//维修费用
        order_number: value.order_number,
      };
      if (value.order_number) {
        param.order_number = value.order_number;
      } else {
        delete param.order_number;
      }
      // 新增
      const { status, msg } = await addMaintenance(param);
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
        manufacturer_id: value.manufacturer_id.value, //维修厂商id
        manufacturer_name: value.manufacturer_id.label, //维修厂商名称
        assets_type: value.assets_type,
        // images: value.images,//维修记录
        in_manufacturer_time:
          new Date(value.in_manufacturer_time).getTime() / 1000, //维修送厂时间
        out_time: new Date(value.out_time).getTime() / 1000, //预计出厂时间
        // done_time: new Date((value.out_time)).getTime() / 1000,//维修完成时间
        assets_info:
          value.brand +
          '-' +
          value.lisence +
          '-' +
          value.model +
          '-' +
          value.vin, //资产品牌
        assets_license: value.lisence,
        reason: value.reason, //维修原因
        // amount: value.amount * 1,//维修费用
        order_number: value.order_number,
      };
      // 编辑
      const { status, msg } = await editMaintenance({ ...param, id: editId });
      if (status === 0) {
        message.success('修改成功');
        actionRef.current?.reload();
        isShowModal(false);
      } else {
        message.error(msg);
      }
    }
  };
  // 处理
  const onFinish1 = async (value: any) => {
    const param = {
      assets_id: value.num.value, //资产id
      assets_number: value.num.label, //资产编号
      manufacturer_id: value.manufacturer_id.value, //维修厂商id
      manufacturer_name: value.manufacturer_id.label, //维修厂商名称
      assets_type: value.assets_type,
      images: value.images, //维修记录
      in_manufacturer_time:
        new Date(value.in_manufacturer_time).getTime() / 1000, //维修送厂时间
      out_time: new Date(value.out_time).getTime() / 1000, //预计出厂时间
      done_time: new Date(value.out_time).getTime() / 1000, //维修完成时间
      assets_info:
        value.brand + '-' + value.lisence + '-' + value.model + '-' + value.vin, //资产品牌
      reason: value.reason, //维修原因
      amount: value.amount * 1, //维修费用
      // order_number: value.order_number,
      responsible_party: value.responsible_party,
      status: 3,
    };
    // 编辑
    const { status, msg } = await editMaintenance({ ...param, id: editId1 });
    if (status === 0) {
      message.success('处理成功');
      actionRef.current?.reload();
      isShowModal1(false);
    } else {
      message.error(msg);
    }
  };

  const columns: ProColumns<operateMaintenance>[] = [
    {
      title: '序号',
      key: 'first',
      align: 'center',
      hideInSearch: true,
      valueType: 'index',
      width: 60,
    },
    {
      title: '维修单号',
      align: 'center',
      width: 130,
      dataIndex: 'uu_number',
      key: 'uu_number',
    },
    {
      title: '订单编号',
      dataIndex: 'order_number',
      align: 'center',
      width: 130,
      key: 'order_number',
      hideInSearch: true,
      render: (text, record: operateMaintenance) => {
        return (
          <a
            onClick={() => {
              toOrderDetail(record.order_id);
            }}
          >
            {text}
          </a>
        );
      },
    },
    {
      title: '资产编号',
      key: 'assets_number',
      align: 'center',
      width: 180,
      dataIndex: 'assets_number',
    },
    {
      title: '资产类型',
      align: 'center',
      width: 80,
      key: 'assets_type',
      dataIndex: 'assets_type',
      valueType: 'select',
      hideInSearch: true,
      valueEnum: {
        '1': { text: '轻卡' },
        '2': { text: '重卡' },
        '3': { text: 'VAN车' },
        '4': { text: ' 挂车' },
        '5': { text: ' 车厢' },
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
      title: '车牌号',
      align: 'center',
      key: 'assets_license',
      dataIndex: 'assets_license',
    },
    {
      title: '维修厂商',
      align: 'center',
      key: 'manufacturer_name',
      dataIndex: 'manufacturer_name',
      hideInSearch: true,
    },
    {
      title: '维修送厂时间',
      align: 'center',
      dataIndex: 'in_manufacturer_time',
      key: 'in_manufacturer_time',
      valueType: 'dateTime',
      render: (_, record) =>
        record.in_manufacturer_time
          ? moment(record.in_manufacturer_time * 1000).format('YYYY-MM-DD ')
          : '-',
      hideInSearch: true,
    },
    {
      title: '维修原因',
      key: 'reason',
      align: 'center',
      dataIndex: 'reason',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '维修费用',
      align: 'center',
      key: 'amount',
      hideInSearch: true,
      dataIndex: 'amount',
      valueType: 'money',
    },
    {
      title: '预计出厂时间',
      align: 'center',
      dataIndex: 'out_time',
      key: 'out_time',
      valueType: 'dateTime',
      render: (_, record) =>
        record.out_time
          ? moment(record.out_time * 1000).format('YYYY-MM-DD')
          : '-',
      hideInSearch: true,
    },
    {
      title: '维修完成时间',
      dataIndex: 'done_time',
      key: 'done_time',
      valueType: 'dateTime',
      align: 'center',
      render: (_, record) =>
        record.done_time
          ? moment(record.done_time * 1000).format('YYYY-MM-DD')
          : '-',
      hideInSearch: true,
    },
    {
      title: '经办人',
      key: 'creator_name',
      dataIndex: 'creator_name',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '状态',
      align: 'center',
      key: 'status',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        '2': { text: '维修中' },
        '3': { text: '已完成' },
      },
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      align: 'center',
      fixed: 'right',
      width: 250,
      render: (text, record: operateMaintenance) => [
        <Button
          type="link"
          disabled={record.status == 3}
          onClick={() => {
            isShowModal(true, record, record.id);
          }}
        >
          编辑
        </Button>,
        <Popconfirm
          onConfirm={async () => {
            const { status, msg } = await deleteMaintenance({
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
          disabled={record.status == 3}
          cancelText="否"
        >
          <Button type="link" disabled={record.status == 3}>
            删除
          </Button>
        </Popconfirm>,
        <Button
          type="link"
          disabled={record.status == 3}
          onClick={() => {
            isShowModal1(true, record, record.id);
          }}
        >
          处理
        </Button>,
      ],
    },
  ];
  // 下载模板
  const downloadtemp = () => {
    window.location.href = 'https://aiev56.com/download/repair_template.xlsx';
  };
  // 导入
  const setImport = async (file_id: any, status: any) => {
    if (status === 'uploading') {
    } else if (status === 0) {
      const { status, msg } = await importMaintenance({ __file_id__: file_id });
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
      <ProTable<operateMaintenance>
        bordered
        columns={columns}
        actionRef={actionRef}
        scroll={{ x: 2000 }}
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
        headerTitle="维修列表"
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
        <MaintenanceAddModal
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
        <MaintenanceOpModal
          visible={visible1}
          isShowModal={isShowModal1}
          onFinish={onFinish1}
          record={record1}
          editId={editId1}
        />
      )}
    </PageContainer>
  );
};
export default Index;
