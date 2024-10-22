import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { message } from 'antd';
import moment from 'moment';
import { history } from 'umi';
import { workOrderItemType } from '../data';
import WorkOrderAddOrEditModal from '../components/addOrEditModal';
import FollowUpAddOrEditModal from '../components/followUpModal';
import DesignateModal from '../components/designateModal';
import OrderLevelModal from '../components/orderLevelModal';
import DetailModal from '../components/detailModal';
import {
  addWorkOrderAPI,
  editWorkOrderAPI,
  getWorkOrderListAPI,
  getWorkOrderProcessAPI,
} from '@/services/workOrder';
import CommentModal from '../components/comment';
const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [visible, setVisible] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [record, setRecord] = useState<workOrderItemType | undefined>(
    undefined,
  );
  const [visible1, setVisible1] = useState<boolean>(false);
  const [editId1, setEditId1] = useState<string | undefined>(undefined);
  const [record1, setRecord1] = useState<workOrderItemType | undefined>(
    undefined,
  );
  const [visible2, setVisible2] = useState<boolean>(false);
  const [editId2, setEditId2] = useState<string | undefined>(undefined);
  const [record2, setRecord2] = useState<workOrderItemType | undefined>(
    undefined,
  );
  const [visible3, setVisible3] = useState<boolean>(false);
  const [editId3, setEditId3] = useState<string | undefined>(undefined);
  const [record3, setRecord3] = useState<workOrderItemType | undefined>(
    undefined,
  );
  const [visible4, setVisible4] = useState<boolean>(false);
  const [editId4, setEditId4] = useState<string | undefined>(undefined);
  const [record4, setRecord4] = useState<workOrderItemType | undefined>(
    undefined,
  );
  const [visible5, setVisible5] = useState<boolean>(false);
  const [editId5, setEditId5] = useState<string | undefined>(undefined);
  const [record5, setRecord5] = useState<workOrderItemType | undefined>(
    undefined,
  );
  // 获取列表
  const getList = async (params: any) => {
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
          field: 'type',
          value: params.type ? params.type : '__ignore__',
          op: 0,
        },
        {
          field: 'level',
          value: params.level ? params.level : '__ignore__',
          op: 0,
        },
        {
          field: 'status',
          value: params.status ? params.status : '__ignore__',
          op: 0,
        },
        {
          field: 'license',
          value: params.license ? params.license : '__ignore__',
          op: 7,
        },
        {
          field: 'contact_phone',
          value: params.contact_phone ? params.contact_phone : '__ignore__',
          op: 7,
        },
      ],
      $tableSort: [],
    };
    const {
      data: { list, total },
      status,
    } = await getWorkOrderListAPI(param);
    return {
      data: list,
      total,
      success: status === 0,
    };
  };
  //  新增  编辑  关闭Modal
  const isShowModal = (show: boolean, row?: workOrderItemType, id?: string) => {
    setVisible(show);
    setEditId(id);
    setRecord(row);
  };
  // 跟进
  const isShowModal1 = (
    show: boolean,
    row?: workOrderItemType,
    id?: string,
  ) => {
    setVisible1(show);
    setEditId1(id);
    setRecord1(row);
  };
  // 指派
  const isShowModal2 = (
    show: boolean,
    row?: workOrderItemType,
    id?: string,
  ) => {
    setVisible2(show);
    setEditId2(id);
    setRecord2(row);
  };
  // 修改工单级别
  const isShowModal3 = (
    show: boolean,
    row?: workOrderItemType,
    id?: string,
  ) => {
    if (row?.status === 4) {
      message.warn('该工单已完成, 不能修改工单级别！');
      return;
    }
    setVisible3(show);
    setEditId3(id);
    setRecord3(row);
  };
  // // 工单详情
  const isShowModal4 = (
    show: boolean,
    row?: workOrderItemType,
    id?: string,
  ) => {
    setVisible4(show);
    setEditId4(id);
    setRecord4(row);
  };
  // // 评价详情
  const isShowModal5 = (
    show: boolean,
    row?: workOrderItemType,
    id?: string,
  ) => {
    setVisible5(show);
    setEditId5(id);
    setRecord5(row);
  };
  //新增  编辑提交
  const onFinish = async (value: any) => {
    if (!editId) {
      const { status, msg } = await addWorkOrderAPI(value);
      if (status === 0) {
        message.success('添加成功');
        // 刷新列表数据
        actionRef.current?.reload();
        isShowModal(false);
      } else {
        message.warn(msg);
      }
    }
  };
  // 跟进
  const onFinish1 = async (value: any) => {
    console.log(value);
    if (value.type === 2) {
      const { status, msg } = await getWorkOrderProcessAPI({
        ...value,
        work_order_id: editId1,
      });
      if (status === 0) {
        message.success('跟进成功');
        // 刷新列表数据
        actionRef.current?.reload();
        isShowModal1(false);
      } else {
        message.warn(msg);
      }
    } else {
      const params = {
        images: value.images && value.images.length > 0 ? value.images : [],
        desc: value.desc ? value.desc : '',
        work_order_id: editId1,
        type: value.type,
      };
      const { status, msg } = await getWorkOrderProcessAPI(params);
      if (status === 0) {
        message.success('跟进成功');
        // 刷新列表数据
        actionRef.current?.reload();
        isShowModal1(false);
      } else {
        message.warn(msg);
      }
    }
  };
  // 指派
  const onFinish2 = async (value: any) => {
    const { status, msg } = await editWorkOrderAPI({ ...value, id: editId2 });
    if (status === 0) {
      message.success('指派成功');
      // 刷新列表数据
      actionRef.current?.reload();
      isShowModal2(false);
    } else {
      message.warn(msg);
    }
  };
  // 修改工单级别
  const onFinish3 = async (value: any) => {
    const { status, msg } = await editWorkOrderAPI({ ...value, id: editId3 });
    if (status === 0) {
      message.success('修改成功');
      // 刷新列表数据
      actionRef.current?.reload();
      isShowModal3(false);
    } else {
      message.warn(msg);
    }
  };
  // 工单详情
  const toDetail = (id, status, type) => {
    if (type === 1) {
      history.push({
        pathname: '/workOrder/localstatus',
        query: {
          id,
          status,
        },
      });
    } else {
      history.push({
        pathname: '/workOrder/status',
        query: {
          id,
          status,
        },
      });
    }
  };
  const columns: ProColumns<workOrderItemType>[] = [
    {
      title: '序号',
      align: 'center',
      key: 'first',
      hideInSearch: true,
      valueType: 'index',
      width: 60,
    },
    {
      title: '工单号',
      align: 'center',
      dataIndex: 'uu_number',
      key: 'uu_number',
      width: 150,
      copyable: true,
      render: (_, row: workOrderItemType) => {
        return (
          <a
            style={{ marginRight: '10px' }}
            onClick={() => {
              toDetail(row.id, row.status, row.creator_type);
            }}
          >
            {row.uu_number}{' '}
          </a>
        );
      },
    },
    {
      title: '问题类型',
      key: 'problem_name',
      align: 'center',
      dataIndex: 'problem_name',
      hideInSearch: true,
    },
    {
      title: '描述',
      dataIndex: 'desc',
      align: 'center',
      key: 'desc',
      hideInSearch: true,
      ellipsis: true,
      render: (_, row: workOrderItemType) => {
        return (
          <a
            onClick={() => {
              isShowModal4(true, row, row.id);
            }}
          >
            {row.desc}{' '}
          </a>
        );
      },
    },
    {
      title: '所属车型',
      key: 'type',
      align: 'center',
      dataIndex: 'type',
      valueType: 'select',
      valueEnum: {
        '1': { text: '重卡' },
        '2': { text: '轻卡' },
        '3': { text: 'van车' },
        '4': { text: '车厢' },
        '5': { text: '挂车' },
      },
    },
    {
      title: '车牌号',
      dataIndex: 'license',
      align: 'center',
      key: 'license',
    },
    {
      title: '联系方式',
      dataIndex: 'contact_phone',
      align: 'center',
      key: 'contact_phone',
    },
    {
      title: '工单级别',
      dataIndex: 'level',
      align: 'center',
      key: 'level',
      hideInSearch: true,
      render: (_, row: workOrderItemType) => {
        return (
          <>
            <span
              style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background:
                  row.level == 1
                    ? '#5578F9'
                    : row.level == 2
                    ? 'orange'
                    : 'red',
                marginRight: '5px',
              }}
            ></span>
            <span>
              {row.level == 1 ? '一般' : row.level == 2 ? '严重' : '紧急'}{' '}
            </span>
          </>
        );
      },
    },
    {
      title: '工单级别',
      key: 'level',
      align: 'center',
      hideInTable: true,
      dataIndex: 'level',
      valueType: 'select',
      valueEnum: {
        '1': { text: '一般' },
        '2': { text: '严重' },
        '3': { text: '紧急' },
      },
    },
    {
      title: '指派时间',
      dataIndex: 'create_time',
      align: 'center',
      key: 'create_time',
      valueType: 'dateTime',
      render: (_, record) =>
        moment(record.create_time * 1000).format('YYYY-MM-DD'),
      hideInSearch: true,
    },
    {
      title: '最新跟进时间',
      dataIndex: 'update_time',
      align: 'center',
      key: 'update_time',
      valueType: 'dateTime',
      render: (_, record) =>
        moment(record.update_time * 1000).format('YYYY-MM-DD'),
      hideInSearch: true,
    },
    {
      title: '工单未处理时间',
      key: 'overdue_days',
      dataIndex: 'overdue_days',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '负责人',
      key: 'owner_name',
      dataIndex: 'owner_name',
      align: 'center',
      hideInSearch: true,
      render: (_, row: workOrderItemType) => {
        return row.owner_name.map((item, index) => {
          return (
            <span>
              {item}
              {index == row.owner_name.length - 1 ? '' : ','}
            </span>
          );
        });
      },
    },
    {
      title: '评价',
      key: 'service_site_name',
      dataIndex: 'service_site_name',
      align: 'center',
      hideInSearch: true,
      render: (_, row: workOrderItemType) => {
        return (
          <a
            onClick={() => {
              isShowModal5(true, row, row.id);
            }}
          >
            查看
          </a>
        );
      },
    },
    {
      title: '工单状态',
      key: 'status',
      align: 'center',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        1: { text: '待处理' },
        2: { text: '处理中' },
        3: { text: '关闭' },
        4: { text: '已完成' },
      },
    },
    {
      title: '操作',
      key: 'option',
      align: 'center',
      fixed: 'right',
      width: 150,
      valueType: 'option',
      render: (text, record_: workOrderItemType) => {
        return [
          record_.status != 4 && (
            <a
              onClick={() => {
                isShowModal1(true, record_, record_.id);
              }}
            >
              跟进
            </a>
          ),
        ];
      },
    },
  ];
  return (
    <PageContainer
      ghost
      header={{
        title: ' ',
        breadcrumb: {},
      }}
    >
      <ProTable<workOrderItemType>
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
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        scroll={{ x: 1800 }}
        pagination={{
          pageSize: pageSize,
          showSizeChanger: true,
          onShowSizeChange: (current, pageSize) => {
            setPageSize(pageSize);
          },
        }}
        options={false}
        dateFormatter="string"
        headerTitle="工单列表"
        toolBarRender={() => []}
      />
      {!visible ? (
        ''
      ) : (
        <WorkOrderAddOrEditModal
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
        <FollowUpAddOrEditModal
          visible={visible1}
          isShowModal={isShowModal1}
          onFinish={onFinish1}
          record={record1}
          editId={editId1}
        />
      )}
      {!visible2 ? (
        ''
      ) : (
        <DesignateModal
          visible={visible2}
          isShowModal={isShowModal2}
          onFinish={onFinish2}
          record={record2}
          editId={editId2}
        />
      )}
      {!visible3 ? (
        ''
      ) : (
        <OrderLevelModal
          visible={visible3}
          isShowModal={isShowModal3}
          onFinish={onFinish3}
          record={record3}
          editId={editId3}
        />
      )}
      {!visible4 ? (
        ''
      ) : (
        <DetailModal
          visible={visible4}
          isShowModal={isShowModal4}
          record={record4}
          editId={editId4}
        />
      )}
      {!visible5 ? (
        ''
      ) : (
        <CommentModal
          visible={visible5}
          isShowModal={isShowModal5}
          record={record5}
          editId={editId5}
        />
      )}
    </PageContainer>
  );
};
export default Index;
