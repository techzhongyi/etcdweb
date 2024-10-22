import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Image, Popconfirm, message } from 'antd';
import { history } from 'umi';
import moment from 'moment';
import { assessmentItemType } from '../../data';
import {
  deleteAssessmentDetail,
  editAssessment,
  getAssessment,
  importAssessment,
} from '@/services/operate/assessment';
import ImageModal from '@/components/ImageModel';
import EditAcountModal from '../components/editAcountMdal';
import ExportTemp from '@/components/ExportTemp';
import UploadImg from '@/components/Upload/UploadImg';
const Index: React.FC = () => {
  const url = '/devops/export_damage_record';
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [visible, setVisible] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [record, setRecord] = useState<assessmentItemType | undefined>(
    undefined,
  );
  const [visible1, setVisible1] = useState<boolean>(false);
  const [imageList, setImageList] = useState<string | string[]>([]);
  const [fileList, setFileList] = useState([]);
  // 搜索条件筛选
  const [searchObj, setSearchObj] = useState({});
  // 新增 编辑 关闭Modal
  const isShowModal = (
    show: boolean,
    row?: assessmentItemType,
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
  // 获取定损列表
  const getList = async (params: any) => {
    setSearchObj({
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
      data,
      data: { list },
      status,
    } = await getAssessment(param);
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
  // 编辑定损金额
  const onFinish = async (value: any) => {
    const param = {
      id: editId,
      amount: value.amount * 1,
      desc: value.desc,
      images: record.images,
    };
    const { status, msg } = await editAssessment(param);
    if (status === 0) {
      message.success('修改成功');
      actionRef.current?.reload();
      isShowModal(false);
    } else {
      message.warn(msg);
    }
  };
  const columns: ProColumns<assessmentItemType>[] = [
    {
      title: '序号',
      align: 'center',
      key: 'first',
      hideInSearch: true,
      valueType: 'index',
      width: 60,
    },
    {
      title: '订单编号',
      dataIndex: 'order_uu_number',
      key: 'order_uu_number',
      align: 'center',
      hideInSearch: true,
      render: (_, record: assessmentItemType) => {
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
      title: '资产编号',
      align: 'center',
      key: 'assets_number',
      width: 180,
      dataIndex: 'assets_number',
    },
    {
      title: '资产类型',
      align: 'center',
      width: 100,
      key: 'assets_type',
      dataIndex: 'assets_type',
      valueType: 'select',
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
      title: '车牌号',
      align: 'center',
      key: 'assets_license',
      dataIndex: 'assets_license',
    },
    {
      title: '资产说明',
      align: 'center',
      key: 'assets_info',
      dataIndex: 'assets_info',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '定损内容',
      align: 'center',
      key: 'desc',
      dataIndex: 'desc',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '定损金额',
      key: 'amount',
      align: 'center',
      dataIndex: 'amount',
      hideInSearch: true,
      valueType: 'money',
    },
    {
      title: '定损时间',
      align: 'center',
      dataIndex: 'create_time',
      key: 'create_time',
      valueType: 'dateTime',
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
      hideInSearch: true,
    },
    {
      title: '定损记录',
      dataIndex: 'image',
      align: 'center',
      key: 'image',
      hideInSearch: true,
      valueType: 'image',
      render: (_, record: assessmentItemType) => {
        return (
          <a
            onClick={() => {
              isShowModal1(true, record.images);
            }}
          >
            查看
          </a>
        );
      },
    },
    {
      title: '操作',
      key: 'option',
      align: 'center',
      valueType: 'option',
      fixed: 'right',
      width: 220,
      render: (_, record: assessmentItemType) => [
        <a
          onClick={() => {
            isShowModal(true, record, record.id);
          }}
        >
          编辑
        </a>,
        // <Popconfirm
        //     onConfirm={async () => {
        //         const { status, msg } = await deleteAssessmentDetail({
        //             id: record?.id,
        //         });
        //         if (status === 0) {
        //             message.success('操作成功');
        //             actionRef.current?.reload();
        //         } else {
        //             message.error(msg);
        //         }
        //     }}
        //     key="popconfirm"
        //     title="删除后不可恢复，确认删除吗?"
        //     okText="是"
        //     cancelText="否"
        // >

        //     <a>删除</a>
        // </Popconfirm>,
      ],
    },
  ];
  // 下载模板
  const downloadtemp = () => {
    window.location.href =
      'https://aiev56.com/download/damage_record_template.xlsx';
  };
  // 导入
  const setImport = async (file_id: any, status: any) => {
    if (status === 'uploading') {
    } else if (status === 0) {
      const { status, msg } = await importAssessment({ __file_id__: file_id });
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
      <ProTable<assessmentItemType>
        bordered
        columns={columns}
        actionRef={actionRef}
        scroll={{ x: 1600 }}
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
        headerTitle="定损列表"
        toolBarRender={() => [
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
        <EditAcountModal
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
          title={'定损记录'}
        />
      )}
    </PageContainer>
  );
};
export default Index;
