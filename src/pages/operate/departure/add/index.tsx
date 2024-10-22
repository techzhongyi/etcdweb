import React, { useEffect, useRef, useState } from 'react';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import ProForm from '@ant-design/pro-form';
import { Button, Card, Form, Popconfirm, Skeleton, message } from 'antd';
import { history } from 'umi';
import { ProDescriptions } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import moment from 'moment';
import ConfigPerpotyModal from '../components/configPerpoty';
import { departureItemType, modalType } from '../../data';
import ProTable, { EditableProTable } from '@ant-design/pro-table';
import { getOrderDetail } from '@/services/custom/order';
import {
  cancelSendDevopsOrderAssets,
  configDevopsOrderAssets,
  removeOrderAssets,
  sendAllDevopsOrderAssets,
  sendDevopsOrderAssets,
} from '@/services/operate/departure';
const Index: React.FC<modalType<departureItemType>> = () => {
  const [editForm] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const actionRef1 = useRef<ActionType>();
  const [formObj] = ProForm.useForm();
  const [initialValues, setInitialValues] = useState(undefined);
  // 重卡数量
  const [heavyCount, setHeavyCount] = useState<number>(0);
  // 轻卡数量
  const [lightCount, setLightCount] = useState<number>(0);
  // van车数量
  const [vanCount, setVanCount] = useState<number>(0);
  // 挂车数量
  const [trailerCount, setTrailerCount] = useState<number>(0);
  // 车厢数量
  const [carriageCount, setCarriageCount] = useState<number>(0);
  // 已经配置重卡数量
  const [preheavyCount, setPreHeavyCount] = useState<number>(0);
  // 已经配置轻卡数量
  const [prelightCount, setPreLightCount] = useState<number>(0);
  // 已经配置van车数量
  const [prevanCount, setPreVanCount] = useState<number>(0);
  // 已经配置挂车数量
  const [pretrailerCount, setPreTrailerCount] = useState<number>(0);
  // 已经配置车厢数量
  const [precarriageCount, setPreCarriageCount] = useState<number>(0);
  const [userInfo, setUserInfo] = useState({
    user_name: '',
    user_contact: '',
    user_phone: '',
    user_address: '',
  });
  const [orderInfo, setOrderInfo] = useState({
    seller_name: '',
    start_time: 0,
    status: 0,
    deposit: '',
    payment_day: '',
    period: '',
    contract_amount: '',
    remark: '',
    contract_url: '',
    is_show: 0,
  });
  const [orderSkuList, setOrderSkuList] = useState([]);
  const [preOrderSkuList, setPreOrderSkuList] = useState<any[]>([]);
  const [newOrderSkuList, setNewOrderSkuList] = useState<any[]>([]);
  const [dataList, setDataList] = useState<any[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [record, setRecord] = useState<departureItemType | undefined>(
    undefined,
  );
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    newOrderSkuList.map((item: { id: any }) => item.id),
  );
  // 新增 编辑 关闭Modal
  const isShowModal = (show: boolean, row?: any, id?: string) => {
    setVisible(show);
    if (id) {
      setEditId(id);
    }
    if (row) {
      setRecord(row);
    }
  };

  // 提交
  const onFinish = async (value: any) => {
    if (newOrderSkuList.length == 0) {
      message.error('请配置车辆');
      return;
    }
    let isOn = false;
    newOrderSkuList.map((item: any) => {
      if (!item.address) {
        isOn = true;
      }
    });
    if (isOn) {
      message.error('请填全交车地址');
      return;
    }
    const param = {
      order_id: history?.location?.query?.id,
      items: newOrderSkuList.map((item) => {
        return {
          assets_id: item.id, // 资产id
          order_sku_id: item.order_sku_id,
          address: item.address,
        };
      }),
    };
    const { status, msg } = await configDevopsOrderAssets(param);
    if (status === 0) {
      message.success('操作成功');
      history.push('/operate/departure');
    } else {
      message.error(msg);
    }
  };
  // 获取发车单详情-- 订单详情接口
  const getGoodsDetail = async (id: string | string[]) => {
    const {
      data: { order_detail, order_sku_list, order_assets_list, contract_list },
    } = await getOrderDetail({ order_id: id });
    setInitialValues(order_detail);
    setUserInfo(order_detail);
    setOrderInfo(order_detail);
    setOrderSkuList(order_sku_list);
    setPreOrderSkuList(order_assets_list);
    setDataList(contract_list);
    // 重卡数量
    setHeavyCount(
      order_sku_list
        ?.filter((item: any) => item.category_type == 1)
        .reduce((sum: any, obj: any) => {
          return sum + obj.count;
        }, 0),
    );
    // 轻卡数量
    setLightCount(
      order_sku_list
        ?.filter((item: any) => item.category_type == 2)
        .reduce((sum: any, obj: any) => {
          return sum + obj.count;
        }, 0),
    );
    // van车数量
    setVanCount(
      order_sku_list
        ?.filter((item: any) => item.category_type == 3)
        .reduce((sum: any, obj: any) => {
          return sum + obj.count;
        }, 0),
    );
    // 车厢数量
    setCarriageCount(
      order_sku_list
        ?.filter((item: any) => item.category_type == 4)
        .reduce((sum: any, obj: any) => {
          return sum + obj.count;
        }, 0),
    );
    // 挂车数量
    setTrailerCount(
      order_sku_list
        ?.filter((item: any) => item.category_type == 5)
        .reduce((sum: any, obj: any) => {
          return sum + obj.count;
        }, 0),
    );
  };
  useEffect(() => {
    if (history?.location?.query?.id) {
      getGoodsDetail(history?.location?.query?.id);
    }
  }, []);
  // 配车
  const onFinishConfig = async (value: any) => {
    const value_ = value.map((item: any) => {
      return Object.assign(item, {
        order_sku_id: record!.id,
      });
    });
    // configItem(value);
    setNewOrderSkuList([...newOrderSkuList, ...value_]);
    setPreOrderSkuList([...preOrderSkuList]);
    sumPreData([...newOrderSkuList, ...value_]);
    isShowModal(false);
  };
  // 计算已经配置的资产信息数量
  const sumPreData = (list: any[]) => {
    // 重卡数量
    setPreHeavyCount(list?.filter((item: any) => item.type == 1).length);
    // 轻卡数量
    setPreLightCount(list?.filter((item: any) => item.type == 2).length);
    // van车数量
    setPreVanCount(list?.filter((item: any) => item.type == 3).length);
    // 车厢数量
    setPreCarriageCount(list?.filter((item: any) => item.type == 4).length);
    // 挂车数量
    setPreTrailerCount(list?.filter((item: any) => item.type == 5).length);
  };
  // 发车
  const sendCard = async (record: departureItemType) => {
    const data_ = [...preOrderSkuList];
    const index = data_.findIndex((item) => item.id == record.id);
    data_[index].status = 3;
    const { status, msg } = await sendDevopsOrderAssets({
      order_assets_id: record.id,
    });
    if (status === 0) {
      message.success('发车成功');
      setPreOrderSkuList(data_);
    } else {
      message.error(msg);
    }
  };
  // 取消发车
  const cancelSendCard = async (record: departureItemType) => {
    const data_ = [...preOrderSkuList];
    const index = data_.findIndex((item) => item.id == record.id);
    data_[index].status = 2;
    const { status, msg } = await cancelSendDevopsOrderAssets({
      order_assets_id: record.id,
    });
    if (status === 0) {
      message.success('取消发车成功');
      setPreOrderSkuList(data_);
    } else {
      message.error(msg);
    }
  };
  // 全部发车
  const sendAll = async () => {
    const data_ = [...preOrderSkuList];
    data_.map((item) => {
      item.status = 3;
    });
    const { status, msg } = await sendAllDevopsOrderAssets({
      order_id: history?.location?.query?.id,
    });
    if (status === 0) {
      message.success('全部发车成功');
      setPreOrderSkuList(data_);
    } else {
      message.error(msg);
    }
  };
  const btn = (
    <Button
      type="primary"
      onClick={() => {
        sendAll();
      }}
    >
      全部发车
    </Button>
  );
  useEffect(() => {
    if (newOrderSkuList?.length > 0) {
      setEditableRowKeys(() =>
        newOrderSkuList.map((item: { id: any }) => item.id),
      );
    }
  }, [newOrderSkuList]);
  const columns: ProColumns<any>[] = [
    {
      title: '资产类型',
      dataIndex: 'category_type',
      key: 'category_type',
      hideInSearch: true,
      align: 'center',
      valueType: 'select',
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
      dataIndex: 'category_detail',
      key: 'category_detail',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '数量',
      key: 'count',
      dataIndex: 'count',
      align: 'center',
    },
    {
      title: '月租金',
      key: 'rent_month_amount',
      dataIndex: 'rent_month_amount',
      align: 'center',
      valueType: 'money',
    },
    {
      title: '租金总计',
      key: 'total_deposit',
      align: 'center',
      dataIndex: 'total_deposit',
      valueType: 'money',
    },
    {
      title: '预计交车日期',
      dataIndex: 'pre_deliver_time',
      key: 'pre_deliver_time',
      valueType: 'dateTime',
      align: 'center',
      render: (_, record) =>
        moment(record.pre_deliver_time * 1000).format('YYYY-MM-DD'),
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      align: 'center',
      hideInTable: orderInfo.is_show == 1,
      render: (_, record: departureItemType) => [
        <a
          onClick={() => {
            isShowModal(true, record, record.assets_category_id);
          }}
        >
          配置资产
        </a>,
      ],
    },
  ];
  const columns1: ProColumns<departureItemType>[] = [
    {
      title: '序号',
      key: 'index',
      hideInSearch: true,
      valueType: 'index',
      align: 'center',
      editable: false,
      width: 60,
    },
    {
      title: '资产编号',
      dataIndex: 'num',
      key: 'num',
      hideInSearch: true,
      align: 'center',
      editable: false,
    },
    {
      title: '资产类型',
      dataIndex: 'type',
      key: 'type',
      hideInSearch: true,
      valueType: 'select',
      valueEnum: {
        '1': { text: '重卡' },
        '2': { text: '轻卡' },
        '3': { text: 'VAN车' },
        '4': { text: '车厢' },
        '5': { text: '挂车' },
      },
      align: 'center',
      editable: false,
    },
    {
      title: '资产说明',
      dataIndex: 'info',
      key: 'info',
      hideInSearch: true,
      align: 'center',
      editable: false,
    },
    {
      title: '月租金',
      dataIndex: 'yuezujin',
      key: 'uu_number',
      hideInSearch: true,
      hideInTable: true,
      align: 'center',
      editable: false,
    },
    {
      title: '押金',
      key: 'name',
      dataIndex: 'yajin',
      hideInTable: true,
      align: 'center',
      editable: false,
    },
    {
      title: '交车地址',
      key: 'address',
      align: 'center',
      dataIndex: 'address',
    },
    {
      title: '操作',
      key: 'option',
      align: 'center',
      valueType: 'option',
      render: (_, record: departureItemType) => [
        <Popconfirm
          onConfirm={async () => {
            setPreOrderSkuList(
              preOrderSkuList.filter((item) => item.id !== record.id),
            );
          }}
          key="popconfirm"
          title="确认移除吗?"
          okText="是"
          cancelText="否"
        >
          <a key="delete">移除</a>
        </Popconfirm>,
      ],
    },
  ];
  const columns2: ProColumns<departureItemType>[] = [
    {
      title: '序号',
      key: 'index',
      hideInSearch: true,
      valueType: 'index',
      align: 'center',
      editable: false,
      width: 60,
    },
    {
      title: '资产编号',
      dataIndex: 'assets_uu_number',
      key: 'assets_uu_number',
      hideInSearch: true,
      align: 'center',
      editable: false,
    },
    {
      title: '资产类型',
      dataIndex: 'assets_type',
      key: 'assets_type',
      hideInSearch: true,
      valueType: 'select',
      valueEnum: {
        '1': { text: '重卡' },
        '2': { text: '轻卡' },
        '3': { text: 'VAN车' },
        '4': { text: '车厢' },
        '5': { text: '挂车' },
      },
      align: 'center',
      editable: false,
    },
    {
      title: '资产说明',
      dataIndex: 'assets_detail',
      key: 'assets_detail',
      hideInSearch: true,
      align: 'center',
      editable: false,
    },
    {
      title: '月租金',
      dataIndex: 'assets_rent_month_amount',
      key: 'assets_rent_month_amount',
      hideInSearch: true,
      align: 'center',
      editable: false,
      valueType: 'money',
    },
    {
      title: '押金',
      key: 'deposit',
      dataIndex: 'deposit',
      align: 'center',
      editable: false,
      valueType: 'money',
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        '0': { text: '整备中' },
        '1': { text: '可交付' },
        '2': { text: '已锁定' },
        '3': { text: '已发车' },
        '4': { text: '在租中' },
        '5': { text: '待还车' },
        '6': { text: '已报废' },
        '7': { text: '已回收' },
      },
      align: 'center',
      editable: false,
    },
    {
      title: '交车地址',
      key: 'address',
      align: 'center',
      dataIndex: 'address',
      editable: false,
    },
    {
      title: '操作',
      key: 'option',
      align: 'center',
      valueType: 'option',
      render: (_, record: departureItemType) => {
        if (record.status === 2) {
          return [
            <a
              onClick={() => {
                sendCard(record);
              }}
            >
              发车
            </a>,
            <Popconfirm
              onConfirm={async () => {
                const { status, msg } = await removeOrderAssets({
                  order_assets_id: record?.id,
                });
                if (status === 0) {
                  setPreOrderSkuList(
                    preOrderSkuList.filter((item) => item.id !== record.id),
                  );
                  message.success('操作成功');
                  actionRef.current?.reload();
                } else {
                  message.error(msg);
                }
              }}
              key="popconfirm"
              title="移除后不可恢复，确认移除吗?"
              okText="是"
              cancelText="否"
            >
              <a>移除</a>
            </Popconfirm>,
          ];
        } else if (record.status === 3) {
          return [
            <a
              onClick={() => {
                cancelSendCard(record);
              }}
            >
              取消发车
            </a>,
          ];
        } else {
          return [];
        }
      },
    },
  ];
  const columnsHt: ProColumns<any>[] = [
    {
      title: '序号',
      align: 'center',
      key: 'index',
      hideInSearch: true,
      valueType: 'index',
      width: 60,
    },
    {
      title: '合同编号',
      dataIndex: 'number',
      key: 'number',
      align: 'center',
    },
    {
      title: '客户名称',
      dataIndex: 'user_name',
      key: 'user_name',
      align: 'center',
    },
    {
      title: '客户经理',
      key: 'seller_name',
      align: 'center',
      dataIndex: 'seller_name',
    },
    {
      title: '合同类型',
      dataIndex: 'type',
      key: 'type',
      hideInSearch: true,
      align: 'center',
      valueType: 'select',
      valueEnum: {
        '1': { text: '重卡' },
        '2': { text: '轻卡' },
        '3': { text: 'VAN车' },
        '4': { text: '车厢' },
        '5': { text: '挂车' },
      },
    },
    {
      title: '资产数量',
      align: 'center',
      key: 'assets_count',
      dataIndex: 'assets_count',
      hideInSearch: true,
    },
    {
      title: '开始日期',
      align: 'center',
      dataIndex: 'start_time',
      key: 'start_time',
      valueType: 'date',
      hideInSearch: true,
      render: (_, record) =>
        moment(record.start_time * 1000).format('YYYY-MM-DD'),
    },
    {
      title: '截止日期',
      dataIndex: 'end_time',
      align: 'center',
      key: 'end_time',
      valueType: 'date',
      hideInSearch: true,
      render: (_, record) =>
        moment(record.end_time * 1000).format('YYYY-MM-DD'),
    },
    {
      title: '操作',
      align: 'center',
      valueType: 'option',
      render: (text, row: any, index) => [
        <a
          onClick={() => {
            window.location.href = row.images[0];
          }}
        >
          下载合同
        </a>,
      ],
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
      <Card>
        {initialValues === undefined &&
        history?.location?.query?.id !== undefined ? (
          <Skeleton active={true} paragraph={{ rows: 3 }} />
        ) : (
          <ProForm
            submitter={{
              render: (props) => (
                <FooterToolbar>
                  <Button
                    key="rest"
                    onClick={() => history.push('/operate/departure')}
                  >
                    返回
                  </Button>
                  {newOrderSkuList.length > 0 && (
                    <Button
                      type="primary"
                      key="submit2"
                      onClick={() => {
                        props.form?.submit?.();
                        // props.form?.validateFields().then(value=>{
                        //   props.form?.submit?.();
                        // }).catch()
                      }}
                    >
                      确认
                    </Button>
                  )}
                </FooterToolbar>
              ),
            }}
            onFinish={onFinish}
            initialValues={initialValues}
            form={formObj}
          >
            <Card title="客户信息" style={{ marginBottom: '5px' }}>
              <ProDescriptions column={4}>
                <ProDescriptions.Item valueType="text" label="客户名称">
                  {userInfo?.user_name}
                </ProDescriptions.Item>
                <ProDescriptions.Item valueType="text" label="负责人">
                  {userInfo?.user_contact}
                </ProDescriptions.Item>
                <ProDescriptions.Item valueType="text" label="手机号码">
                  {userInfo?.user_phone}
                </ProDescriptions.Item>
                <ProDescriptions.Item valueType="text" label="客户地址">
                  {userInfo?.user_address}
                </ProDescriptions.Item>
              </ProDescriptions>
            </Card>
            <Card title="订单信息" style={{ marginBottom: '5px' }}>
              <ProDescriptions column={4}>
                <ProDescriptions.Item
                  valueType="text"
                  ellipsis
                  label="客户经理"
                >
                  {orderInfo?.seller_name}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                  valueType="text"
                  ellipsis
                  label="起租日期"
                >
                  {moment(orderInfo?.start_time * 1000).format('YYYY-MM-DD')}
                </ProDescriptions.Item>
                <ProDescriptions.Item valueType="text" ellipsis label="押金">
                  {orderInfo?.deposit}元
                </ProDescriptions.Item>
                <ProDescriptions.Item
                  valueType="text"
                  ellipsis
                  label="每月交租日"
                >
                  {orderInfo?.payment_day}号
                </ProDescriptions.Item>
              </ProDescriptions>
              <ProDescriptions column={4}>
                <ProDescriptions.Item valueType="text" ellipsis label="租期">
                  {orderInfo?.period}
                </ProDescriptions.Item>
                <ProDescriptions.Item
                  valueType="text"
                  ellipsis
                  label="预计租金总金额"
                >
                  {orderInfo?.contract_amount}元
                </ProDescriptions.Item>
              </ProDescriptions>
              <ProDescriptions column={1}>
                <ProDescriptions.Item valueType="text" ellipsis label="备注">
                  {orderInfo?.remark}
                </ProDescriptions.Item>
              </ProDescriptions>
              {orderInfo?.contract_url && (
                <ProDescriptions column={4}>
                  <ProDescriptions.Item
                    valueType="text"
                    ellipsis
                    label="租车合同"
                  >
                    <a href={orderInfo?.contract_url}>
                      {orderInfo?.contract_url.split('__GKZY__')[1]}
                    </a>
                  </ProDescriptions.Item>
                </ProDescriptions>
              )}
            </Card>
            {dataList.length > 0 && (
              <Card title="合同列表" style={{ marginBottom: '5px' }}>
                <ProTable<any>
                  bordered
                  columns={columnsHt}
                  tableAlertRender={false}
                  actionRef={actionRef}
                  dataSource={dataList}
                  editable={{
                    type: 'multiple',
                  }}
                  columnsState={{
                    persistenceKey: 'pro-table-singe-demos',
                    persistenceType: 'localStorage',
                  }}
                  rowKey="id"
                  search={false}
                  pagination={false}
                  options={false}
                  dateFormatter="string"
                  headerTitle={false}
                  toolBarRender={false}
                />
              </Card>
            )}

            <Card title="已预定资产信息" style={{ marginBottom: '5px' }}>
              <ProTable<departureItemType>
                dataSource={orderSkuList}
                bordered
                columns={columns}
                actionRef={actionRef}
                editable={{
                  type: 'multiple',
                }}
                columnsState={{
                  persistenceKey: 'pro-table-singe-demos',
                  persistenceType: 'localStorage',
                }}
                rowKey="id"
                search={false}
                pagination={false}
                options={false}
                dateFormatter="string"
                headerTitle={false}
                toolBarRender={false}
              />
              <ProDescriptions column={6} style={{ marginTop: '20px' }}>
                <ProDescriptions.Item valueType="text" ellipsis label="重卡">
                  {heavyCount}辆
                </ProDescriptions.Item>
                <ProDescriptions.Item valueType="text" ellipsis label="轻卡">
                  {lightCount}辆
                </ProDescriptions.Item>
                <ProDescriptions.Item valueType="text" ellipsis label="VAN车">
                  {vanCount}辆
                </ProDescriptions.Item>
                <ProDescriptions.Item valueType="text" ellipsis label="挂车">
                  {trailerCount}辆
                </ProDescriptions.Item>
                <ProDescriptions.Item valueType="text" ellipsis label="车厢">
                  {carriageCount}个
                </ProDescriptions.Item>
                <ProDescriptions.Item
                  valueType="text"
                  ellipsis
                  label="资产总数"
                >
                  {heavyCount +
                    lightCount +
                    vanCount +
                    trailerCount +
                    carriageCount}
                  辆
                </ProDescriptions.Item>
              </ProDescriptions>
            </Card>
            <Card
              style={{ marginBottom: '5px' }}
              title="已配置资产信息"
              extra={
                preOrderSkuList.filter((item) => item.status == 2).length > 0
                  ? btn
                  : false
              }
            >
              {preOrderSkuList.length > 0 && (
                <ProTable<departureItemType>
                  dataSource={preOrderSkuList}
                  bordered
                  columns={columns2}
                  actionRef={actionRef1}
                  editable={{
                    type: 'multiple',
                  }}
                  columnsState={{
                    persistenceKey: 'pro-table-singe-demos',
                    persistenceType: 'localStorage',
                  }}
                  rowKey="id"
                  search={false}
                  pagination={false}
                  options={false}
                  dateFormatter="string"
                  headerTitle={false}
                  toolBarRender={false}
                />
              )}
            </Card>
            {newOrderSkuList.length > 0 && (
              <Card style={{ marginBottom: '5px' }} title="新配置资产信息">
                {
                  <EditableProTable<any>
                    columns={columns1}
                    rowKey="id"
                    bordered
                    value={newOrderSkuList}
                    onChange={(e) => {
                      console.log(e);
                    }}
                    recordCreatorProps={false}
                    editable={{
                      type: 'multiple',
                      editableKeys,
                      form: editForm,
                      actionRender: (row, config, defaultDoms) => {
                        return [defaultDoms.delete];
                      },
                      onValuesChange: (record, recordList) => {
                        if (!record) {
                          setNewOrderSkuList(recordList);
                          return;
                        }
                        Object.assign(record, {
                          address: record.address,
                        });
                        setNewOrderSkuList(recordList);
                      },
                      onChange: setEditableRowKeys,
                    }}
                  />
                }
              </Card>
            )}
          </ProForm>
        )}
      </Card>
      {!visible ? (
        ''
      ) : (
        <ConfigPerpotyModal
          visible={visible}
          isShowModal={isShowModal}
          onFinish={onFinishConfig}
          ids={preOrderSkuList}
          record={record}
          editId={editId}
        />
      )}
    </PageContainer>
  );
};
export default Index;
