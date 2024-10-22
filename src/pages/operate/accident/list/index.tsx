import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Image, Popconfirm } from 'antd';
import { history } from 'umi';
import moment from 'moment';
import { accidentItemType } from '../../data';
import AccidentAddModal from '../components/accidentAddModal';
import AccidentDetailModal from '../details/index';
import {
  addOutOfInsurance,
  deleteOutOfInsuranceList,
  editOutOfInsurance,
  getOutOfInsuranceList,
  importInsurance,
} from '@/services/operate/accident';
import ImageModal from '@/components/ImageModel';
import ExportTemp from '@/components/ExportTemp';
import UploadImg from '@/components/Upload/UploadImg';
import AccidentOpModal from '../components/accidentOpModal';
const Index: React.FC = () => {
  const url = '/devops/export_out_of_insurance';
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [visible, setVisible] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [record, setRecord] = useState<accidentItemType | undefined>(undefined);
  const [visible3, setVisible3] = useState<boolean>(false);
  const [editId3, setEditId3] = useState<string | undefined>(undefined);
  const [record3, setRecord3] = useState<accidentItemType | undefined>(
    undefined,
  );
  const [visible1, setVisible1] = useState<boolean>(false);
  const [visible2, setVisible2] = useState<boolean>(false);
  const [editId1, setEditId1] = useState<string | undefined>(undefined);
  const [record1, setRecord1] = useState<accidentItemType | undefined>(
    undefined,
  );
  const [imageList, setImageList] = useState<string | string[]>([]);
  const [fileList, setFileList] = useState([]);
  // 搜索条件筛选
  const [searchObj, setSearchObj] = useState({});
  // 新增 编辑 关闭Modal
  const isShowModal = (show: boolean, row?: accidentItemType, id?: string) => {
    setVisible(show);
    setEditId(id);
    setRecord(row);
  };
  // 新增 编辑 关闭Modal
  const isShowModal3 = (show: boolean, row?: accidentItemType, id?: string) => {
    setVisible3(show);
    setEditId3(id);
    setRecord3(row);
  };
  // 查看图片 modal
  const isShowModal2 = (show: boolean, row?: any) => {
    setVisible2(show);
    setImageList(row);
  };
  const onFinish = async (value: any) => {
    if (editId === undefined) {
      const param = {
        assets_id: value.assets_id.value,
        assets_number: value.assets_id.label,
        assets_type: value.type,
        assets_info:
          value.brand +
          '-' +
          value.license +
          '-' +
          value.model +
          '-' +
          value.vin,
        assets_license: value.license, //车牌号
        insurance_amount: value.insurance_amount * 1,
        // reparation_amount: value.reparation_amount * 1,
        // complete_time: new Date((value.complete_time)).getTime() / 1000,
        // responsible_party: value.responsible_party,
        // pay_type: value.pay_type,
        // images: value.images,
        order_number: value.order_number,
        remark: value.remark ? value.remark : '',
      };
      // 新增
      const { status, msg } = await addOutOfInsurance(param);
      if (status === 0) {
        message.success('添加成功');
        actionRef.current?.reload();
        isShowModal(false);
      } else {
        message.warn(msg);
      }
    } else {
      const param = {
        assets_id: value.assets_id.value,
        assets_number: value.assets_id.label,
        assets_type: value.type,
        assets_license: value.license, //车牌号
        assets_info:
          value.brand +
          '-' +
          value.license +
          '-' +
          value.model +
          '-' +
          value.vin,
        insurance_amount: value.insurance_amount * 1,
        // reparation_amount: value.reparation_amount * 1,
        // complete_time: new Date((value.complete_time)).getTime() / 1000,
        // responsible_party: value.responsible_party,
        // pay_type: value.pay_type,
        // images: value.images,
        order_number: value.order_number,
        remark: value.remark ? value.remark : '',
      };
      // 编辑
      const { status, msg } = await editOutOfInsurance({
        ...param,
        id: editId,
      });
      if (status === 0) {
        message.success('修改成功');
        actionRef.current?.reload();
        isShowModal(false);
      } else {
        message.warn(msg);
      }
    }
  };
  // 新增 编辑 关闭Modal
  const isShowModal1 = (show: boolean, row?: accidentItemType, id?: string) => {
    setVisible1(show);
    setEditId1(id);
    setRecord1(row);
  };
  const onFinish3 = async (value: any) => {
    const param = {
      assets_id: value.assets_id.value,
      assets_number: value.assets_id.label,
      assets_type: value.type,
      assets_info:
        value.brand + '-' + value.license + '-' + value.model + '-' + value.vin,
      // insurance_amount: value.insurance_amount * 1,
      reparation_amount: value.reparation_amount * 1,
      complete_time: new Date(value.complete_time).getTime() / 1000,
      responsible_party: value.responsible_party,
      pay_type: value.pay_type,
      images: value.images,
      is_processing: 2,
      // order_number: value.order_number,
    };
    // 编辑
    const { status, msg } = await editOutOfInsurance({ ...param, id: editId3 });
    if (status === 0) {
      message.success('处理成功');
      actionRef.current?.reload();
      isShowModal3(false);
    } else {
      message.warn(msg);
    }
  };
  // 获取列表
  const getList = async (params: any) => {
    setSearchObj({
      uu_number: params.uu_number ? params.uu_number : '',
      assets_number: params.assets_number ? params.assets_number : '',
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
    } = await getOutOfInsuranceList(param);
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
  const columns: ProColumns<accidentItemType>[] = [
    {
      title: '序号',
      key: 'first',
      align: 'center',
      hideInSearch: true,
      valueType: 'index',
      width: 50,
    },
    {
      title: '出险单号',
      dataIndex: 'uu_number',
      align: 'center',
      key: 'uu_number',
      width: 150,
    },
    {
      title: '订单编号',
      dataIndex: 'order_number',
      key: 'order_number',
      align: 'center',
      hideInSearch: true,
      width: 150,
      render: (_, record: accidentItemType) => {
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
      width: 120,
      dataIndex: 'assets_license',
    },
    {
      title: '资产编号',
      key: 'assets_number',
      align: 'center',
      width: 200,
      dataIndex: 'assets_number',
    },
    {
      title: '资产类型',
      key: 'assets_type',
      dataIndex: 'assets_type',
      align: 'center',
      valueType: 'select',
      width: 100,
      hideInSearch: true,
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
      key: 'brand',
      dataIndex: 'brand',
      align: 'center',
      width: 100,
      hideInSearch: true,
      render: (_, record: accidentItemType) => {
        return record.assets_info.split('-')[0];
      },
    },

    {
      title: '车型',
      align: 'center',
      key: 'model',
      width: 100,
      dataIndex: 'model',
      hideInSearch: true,
      render: (_, record: accidentItemType) => {
        return record.assets_info.split('-')[2];
      },
    },
    {
      title: '保险费用',
      key: 'insurance_amount',
      align: 'center',
      dataIndex: 'insurance_amount',
      hideInSearch: true,
      valueType: 'money',
    },
    {
      title: '赔偿金额（元）',
      key: 'reparation_amount',
      align: 'center',
      width: 120,
      dataIndex: 'reparation_amount',
      hideInSearch: true,
      valueType: 'money',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      valueType: 'dateTime',
      align: 'center',
      render: (_, record) =>
        moment(record.create_time * 1000).format('YYYY-MM-DD'),
      hideInSearch: true,
    },

    {
      title: '出险完成时间',
      dataIndex: 'complete_time',
      key: 'complete_time',
      align: 'center',
      valueType: 'dateTime',
      render: (_, record) =>
        record.complete_time
          ? moment(record.complete_time * 1000).format('YYYY-MM-DD')
          : '-',
      hideInSearch: true,
    },
    {
      title: '责任方',
      key: 'responsible_party',
      dataIndex: 'responsible_party',
      align: 'center',
      valueType: 'select',
      hideInSearch: true,
      valueEnum: {
        '1': { text: '租赁方' },
        '2': { text: '第三方' },
      },
    },
    {
      title: '经办人',
      key: 'creator_name',
      align: 'center',
      dataIndex: 'creator_name',
      hideInSearch: true,
    },
    {
      title: '付款方式',
      key: 'pay_type',
      align: 'center',
      dataIndex: 'pay_type',
      valueType: 'select',
      hideInSearch: true,
      valueEnum: {
        '2': { text: '代付' },
        '1': { text: '直付' },
      },
    },
    {
      title: '出险记录',
      dataIndex: 'images',
      align: 'center',
      key: 'images',
      valueType: 'image',
      hideInSearch: true,
      render: (_, record: accidentItemType) => {
        return (
          <a
            onClick={() => {
              isShowModal2(true, record.images);
            }}
          >
            查看
          </a>
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'is_processing',
      key: 'is_processing',
      hideInSearch: true,
      align: 'center',
      valueType: 'select',
      valueEnum: {
        '1': { text: '理赔中' },
        '2': { text: '已处理' },
      },
    },
    {
      title: '操作',
      key: 'option',
      align: 'center',
      valueType: 'option',
      fixed: 'right',
      width: 220,
      render: (_, record: accidentItemType) => [
        <Button
          type="link"
          disabled={record.is_processing == 2}
          onClick={() => {
            isShowModal(true, record, record.id);
          }}
        >
          编辑
        </Button>,
        <Popconfirm
          onConfirm={async () => {
            const { status, msg } = await deleteOutOfInsuranceList({
              id: record?.id,
            });
            if (status === 0) {
              message.success('删除成功');
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

        <Button
          type="link"
          disabled={record.is_processing == 2}
          onClick={() => {
            isShowModal3(true, record, record.id);
          }}
        >
          处理
        </Button>,
      ],
    },
  ];
  // 下载模板
  const downloadtemp = () => {
    window.location.href =
      'https://aiev56.com/download/out_of_insurance_template.xlsx';
  };
  // 导入
  const setImport = async (file_id: any, status: any) => {
    if (status === 'uploading') {
    } else if (status === 0) {
      const { status, msg } = await importInsurance({ __file_id__: file_id });
      if (status === 0) {
        message.success('导入数据成功');
        actionRef.current?.reload();
      } else {
        message.error(msg);
      }
    }
  };
  const onFinishDetail = () => {};
  return (
    <PageContainer
      ghost
      header={{
        title: ' ',
        breadcrumb: {},
      }}
    >
      <ProTable<accidentItemType>
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
        headerTitle="出险列表"
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
      {/* 新增弹窗 */}
      {!visible ? (
        ''
      ) : (
        <AccidentAddModal
          visible={visible}
          isShowModal={isShowModal}
          onFinish={onFinish}
          record={record}
          editId={editId}
        />
      )}
      {/* 处理弹窗 */}
      {!visible3 ? (
        ''
      ) : (
        <AccidentOpModal
          visible={visible3}
          isShowModal={isShowModal3}
          onFinish={onFinish3}
          record={record3}
          editId={editId3}
        />
      )}

      {/* 查看详情弹窗 */}
      {!visible1 ? (
        ''
      ) : (
        <AccidentDetailModal
          visible={visible1}
          isShowModal={isShowModal1}
          onFinish={onFinishDetail}
          record={record1}
          editId={editId1}
        />
      )}
      {!visible2 ? (
        ''
      ) : (
        <ImageModal
          visible={visible2}
          isShowModal={isShowModal2}
          list={imageList}
          title={'出险记录'}
        />
      )}
    </PageContainer>
  );
};
export default Index;
