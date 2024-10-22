import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Row, Select, Table } from 'antd';
import './statistical.less';
import styles from '../styles.less';
import type { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import DemoLine from './demoLine';
import {
  getAssetsAlertRecord,
  getMonitorRecord,
} from '@/services/dashboard/dashboard';
import moment from 'moment';
import NumberInfo from './NumberInfo';
import ProForm, { ProFormDateRangePicker } from '@ant-design/pro-form';
import { TinyArea } from '@ant-design/charts';
import numeral from 'numeral';
import { ProTable } from '@ant-design/pro-components';
import { ActionType } from '@ant-design/pro-table';
import { history } from 'umi';
type RangePickerValue = RangePickerProps<moment.Moment>['value'];
type TimeType = 'hour_24' | 'days_7' | 'days_30';

const rightColResponsiveProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 24,
  xl: 24,
  style: { marginBottom: 20 },
};
const data1 = [9, 3, 5, 6, 2, 7, 2, 4, 8, 9, 3, 5, 6, 3, 8, 1, 3];
const data2 = [3, 1, 8, 3, 6, 5, 3, 9, 8, 4, 2, 7, 2, 6, 5, 3, 9];
const Statistical: React.FC = (props: any) => {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState<number>(5);
  const { alertData } = props;
  const [data, setData] = useState(alertData);
  const [formObj] = ProForm.useForm();
  const [rangePickerValue, setRangePickerValue] = useState([]);
  const [valueType, setValueType] = useState('days_30');
  const [level, setLevel] = useState(null);
  const [recordData, setRecordData] = useState([]);
  const selectDate = (type: TimeType) => {
    setValueType(type);
    setRangePickerValue([]);
    formObj.setFieldsValue({
      dateRange: [],
    });
    getRecord(type, level);
  };

  const handleRangePickerChange = (
    value: RangePickerValue,
    dataString: any,
  ) => {
    if (dataString) {
      setRangePickerValue(dataString);
      getRecord(valueType, level, dataString);
    }
  };
  const isActive = (type?: any) => {
    if (!rangePickerValue) {
      return '';
    }
    if (rangePickerValue[0] && rangePickerValue[1]) {
      return '';
    } else {
      if (valueType === type) {
        return styles.currentDate;
      }
    }
    return '';
  };

  const getRecord = async (timeType: any, levelParam: any, dataType?: any) => {
    const pramas = {
      type: timeType,
      level: levelParam,
      start_time: 0,
      end_time: 0,
    };
    if (dataType?.length > 0 && dataType[0] && dataType[1]) {
      pramas.type = null;
      pramas.start_time =
        new Date(dataType[0] + ' ' + '00:00:00').getTime() / 1000;
      pramas.end_time =
        new Date(dataType[1] + ' ' + '23:59:59').getTime() / 1000;
    }
    const {
      data: { list },
      status,
    } = await getMonitorRecord(pramas);
    if (status === 0) {
      setRecordData(list);
    }
  };

  useEffect(() => {
    setData(alertData);
  }, [alertData]);
  useEffect(() => {
    getRecord('days_30', null);
  }, []);
  const columns = [
    {
      title: '排名',
      dataIndex: 'cabinet_name',
      key: 'cabinet_name',
      ellipsis: true,
    },
    {
      title: '资产类型',
      dataIndex: 'assets_name',
      ellipsis: true,
      key: 'assets_name',
    },
    {
      title: '资产说明',
      dataIndex: 'assets_ip',
      ellipsis: true,
      key: 'assets_ip',
    },
    {
      title: '租赁次数（笔）',
      dataIndex: 'assets_ip1',
      ellipsis: true,
      key: 'assets_ip1',
    },
    {
      title: '租赁金额（元）',
      dataIndex: 'assets_ip2',
      ellipsis: true,
      key: 'assets_ip2',
    },
    {
      title: '涨幅',
      dataIndex: 'assets_ip3',
      ellipsis: true,
      key: 'assets_ip3',
    },
  ];
  // 获取账号列表
  const getList = async (params: any) => {
    const param = {
      page: params.current,
      count: params.pageSize,
    };
    // const {
    //   data,
    //   data: { list },
    //   status,
    // } = await getAssetsAlertRecord(param);
    // return {
    //   data: list,
    //   total: data.total,
    //   success: status === 0,
    // };
    const list = [
      {
        cabinet_name: '1',
        assets_name: 'VAN车',
        assets_ip: '新吉奥-奥腾PRO-鲁Q12334',
        assets_ip1: '53333',
        assets_ip2: '6132313',
        assets_ip3: '128%',
      },
      {
        cabinet_name: '2',
        assets_name: '重卡',
        assets_ip: '新吉奥-奥腾PRO-鲁Q12335',
        assets_ip1: '2345',
        assets_ip2: '666444',
        assets_ip3: '28%',
      },
      {
        cabinet_name: '3',
        assets_name: '轻卡',
        assets_ip: '新吉奥-奥腾PRO-鲁Q12336',
        assets_ip1: '5221',
        assets_ip2: '63321',
        assets_ip3: '12%',
      },
    ];
    return {
      data: list,
      total: 3,
      success: true,
    };
  };
  return (
    <Card
      bordered={false}
      title="资产租赁订单排名"
      style={{
        height: '440px',
        overflowY: 'auto',
      }}
    >
      <Row>
        <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
          <NumberInfo
            subTitle={<span>资产租赁订单（笔）</span>}
            gap={8}
            // total={numeral(data.warning_count).format('0,0')}
            subTotal={7.56 + '%'}
          />
          <TinyArea
            xField="x"
            height={45}
            forceFit
            yField="y"
            smooth
            data={data1}
          />
        </Col>
        <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
          <NumberInfo
            subTitle={<span>租赁金额（元）</span>}
            // total={data.fixed_count}
            subTotal={12.34 + '%'}
            gap={8}
          />
          <TinyArea
            color={'#4CE4C7'}
            xField="x"
            height={45}
            forceFit
            yField="y"
            smooth
            data={data2}
          />
        </Col>
      </Row>
      <ProTable<any>
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
        search={false}
        pagination={{
          pageSize: pageSize,
          showSizeChanger: true,
          onShowSizeChange: (current, pageSize) => {
            setPageSize(pageSize);
          },
        }}
        options={false}
        dateFormatter="string"
        headerTitle={false}
        toolBarRender={false}
      />
    </Card>
    // <Row gutter={24}>
    //   <Col sm={12} xs={24} style={{ marginBottom: 24 }}>
    //     <NumberInfo
    //       subTitle={
    //         <span>
    //           搜索用户数
    //           {/* <Tooltip title="指标说明">
    //             <InfoCircleOutlined style={{ marginLeft: 8 }} />
    //           </Tooltip> */}
    //         </span>
    //       }
    //       gap={8}
    //       total={numeral(12321).format('0,0')}
    //       status="up"
    //       subTotal={17.1}
    //     />
    //     <TinyArea xField="x" height={45} forceFit yField="y" smooth data={visitData2} />
    //   </Col>
    //   {/* <Col {...rightColResponsiveProps}>
    //     <Card className='monitorStatic' title="报警趋势" style={{ height: '480px' }} extra={
    //       <div className={styles.salesExtraWrap} style={{display:'flex',alignItems: 'center'}}>
    //         <div className={styles.salesExtra}>
    //           <a className={isActive('hour_24')} onClick={() => selectDate('hour_24')}>
    //             24h
    //           </a>
    //           <a className={isActive('days_7')} onClick={() => selectDate('days_7')}>
    //             7天内
    //           </a>
    //           <a className={isActive('days_30')} onClick={() => selectDate('days_30')}>
    //             30天内
    //           </a>
    //         </div>
    //         <ProForm
    //           submitter={{
    //             render: (props) => (
    //               []
    //             ),
    //           }}
    //           form={formObj}
    //           style={{marginTop: '-5px'}}
    //         >
    //           <ProFormDateRangePicker
    //             name="dateRange"
    //             style={{ width: 256 }}
    //             fieldProps={{
    //               onChange: handleRangePickerChange
    //             }}
    //             label=" " />
    //         </ProForm>

    //         <Select
    //           defaultValue={level}
    //           style={{ width: 120, marginLeft: '5px' }}
    //           onChange={(e) => {
    //             setLevel(e)
    //             getRecord(valueType, e)
    //           }}
    //           options={[
    //             {
    //               value: null,
    //               label: '全部',
    //             },
    //             {
    //               value: 1,
    //               label: '提示',
    //             },
    //             {
    //               value: 2,
    //               label: '告警',
    //             },
    //             {
    //               value: 3,
    //               label: '一般严重',
    //             },
    //             {
    //               value: 4,
    //               label: '严重',
    //             },
    //             {
    //               value: 5,
    //               label: '灾难',
    //             }
    //           ]}
    //         />
    //       </div>
    //     }>
    //       <DemoLine recordData={recordData} />
    //     </Card>
    //   </Col> */}
    // </Row>
  );
};
export default Statistical;
