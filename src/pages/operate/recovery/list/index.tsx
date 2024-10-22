import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm, message } from 'antd';
import moment from 'moment';
import RecoveryAddModal from '../components/recoveryAddModal';
import {
  addRecovery,
  deleteRecovery,
  editRecovery,
  getRecovery,
  importRecovery,
} from '@/services/operate/recovery';
import { operateRecovery } from '../../data';
import UploadImg from '@/components/Upload/UploadImg';
import ExportTemp from '@/components/ExportTemp';
const Index: React.FC = () => {
  const url = '/devops/export_recycle';
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [visible, setVisible] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [record, setRecord] = useState<operateRecovery | undefined>(undefined);
  const [fileList, setFileList] = useState([]);
  // 搜索条件筛选
  const [searchObj, setSearchObj] = useState({});
  const isShowModal = (
    show: boolean,
    record?: operateRecovery,
    id?: string,
  ) => {
    setVisible(show);
    setEditId(id);
    setRecord(record);
  };
  // 获取回收列表
  const getList = async (params: any) => {
    setSearchObj({
      order_number: params.order_number ? params.order_number : '',
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
          field: 'order_number',
          value: params.order_number ? params.order_number : '__ignore__',
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
      data,
      data: { list },
      status,
    } = await getRecovery(param);
    return {
      data: list,
      total: data.total,
      success: status === 0,
    };
  };
  //提交
  const onFinish = async (value: any) => {
    if (editId === undefined) {
      const param = {
        assets_id: value.num.value, //资产id
        assets_number: value.num.label, //资产编号
        assets_type: value.assets_type, //资产类型
        assets_license: value.lisence, //车牌号
        assets_info:
          value.brand +
          '-' +
          value.lisence +
          '-' +
          value.model +
          '-' +
          value.vin, //资产品牌
        reason: value.reason, //原因
        evaluate_amount: value.evaluate_amount * 1, //评估价值
        real_amount: value.real_amount * 1, //实际价值
      };
      // 新增
      const { status, msg } = await addRecovery(param);
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
        assets_license: value.lisence, //车牌号
        assets_info:
          value.brand +
          '-' +
          value.lisence +
          '-' +
          value.model +
          '-' +
          value.vin, //资产品牌
        reason: value.reason, //原因
        evaluate_amount: value.evaluate_amount * 1, //评估价值
        real_amount: value.real_amount * 1, //实际价值
      };
      // 编辑
      const { status, msg } = await editRecovery({ ...param, id: editId });
      if (status === 0) {
        message.success('修改成功');
        actionRef.current?.reload();
        isShowModal(false);
      } else {
        message.error(msg);
      }
    }
  };
  const columns: ProColumns<operateRecovery>[] = [
    {
      title: '序号',
      align: 'center',
      key: 'index',
      hideInSearch: true,
      valueType: 'index',
      width: 60,
    },
    {
      title: '回收单号',
      align: 'center',
      dataIndex: 'uu_number',
      key: 'uu_number',
    },
    {
      title: '资产编号',
      align: 'center',
      dataIndex: 'assets_number',
      key: 'assets_number',
    },
    {
      title: '车牌号',
      align: 'center',
      key: 'assets_license',
      dataIndex: 'assets_license',
    },
    {
      title: '资产类型',
      align: 'center',
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
      title: '资产说明',
      align: 'center',
      key: 'assets_info',
      dataIndex: 'assets_info',
      hideInSearch: true,
    },

    {
      title: '回收原因',
      align: 'center',
      key: 'reason',
      dataIndex: 'reason',
      hideInSearch: true,
    },

    {
      title: '评价估值',
      align: 'center',
      key: 'evaluate_amount',
      dataIndex: 'evaluate_amount',
      hideInSearch: true,
      valueType: 'money',
    },
    {
      title: '实际价值',
      key: 'real_amount',
      dataIndex: 'real_amount',
      hideInSearch: true,
      align: 'center',
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
      title: '操作',
      align: 'center',
      key: 'option',
      fixed: 'right',
      width: 80,
      valueType: 'option',
      render: (_, record: operateRecovery) => [
        <a
          onClick={() => {
            isShowModal(true, record, record.id);
          }}
        >
          编辑
        </a>,
        // <Popconfirm
        //     onConfirm={async () => {
        //         const { status, msg } = await deleteRecovery({
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
    window.location.href = 'https://aiev56.com/download/recycle_template.xlsx';
  };
  // 导入
  const setImport = async (file_id: any, status: any) => {
    if (status === 'uploading') {
    } else if (status === 0) {
      const { status, msg } = await importRecovery({ __file_id__: file_id });
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
      <ProTable<any>
        bordered
        columns={columns}
        actionRef={actionRef}
        request={(params) => getList(params)}
        editable={{
          type: 'multiple',
        }}
        scroll={{ x: 1800 }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        // search={{
        //     labelWidth: 'auto',
        // }}
        pagination={{
          pageSize: pageSize,
          showSizeChanger: true,
          onShowSizeChange: (current, pageSize) => {
            setPageSize(pageSize);
          },
        }}
        options={false}
        dateFormatter="string"
        headerTitle="回收列表"
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
        <RecoveryAddModal
          isShowModal={isShowModal}
          visible={visible}
          onFinish={onFinish}
          record={record}
          editId={editId}
        />
      )}
    </PageContainer>
  );
};
export default Index;
