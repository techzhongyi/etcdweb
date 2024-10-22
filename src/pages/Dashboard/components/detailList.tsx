import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Empty, message, Row, Tabs } from 'antd';
import numeral from 'numeral';
import './detailList.less';
import DemoColumn from './DemoColumn';
import styles from '../styles.less';
import type { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import { getMonitorAssetsColumn } from '@/services/dashboard/dashboard';
import ProForm, { ProFormDateRangePicker } from '@ant-design/pro-form';
import TabPane from 'antd/lib/tabs/TabPane';
import { Column } from '@ant-design/charts';
import PropertyColumn from './propertyColumn';
import ProTable from '@ant-design/pro-table';
import { ActionType } from '@ant-design/pro-table';
type RangePickerValue = RangePickerProps<moment.Moment>['value'];
type TimeType = 'hour_24' | 'days_7' | 'days_30';
const topColResponsiveProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 24,
  xl: 24,
  style: { marginBottom: 20, marginTop: 20 },
};
const cData = [
  {
    name: '京东物流',
    name1: '100',
    name2: '324532',
  },
  {
    name: '兄弟物流',
    name1: '55',
    name2: '64532',
  },
  {
    name: '哥们物流',
    name1: '37',
    name2: '14532',
  },
  {
    name: '悟空租车',
    name1: '24',
    name2: '8532',
  },
  {
    name: '中远海运',
    name1: '19',
    name2: '5532',
  },
  {
    name: '顺丰速运',
    name1: '13',
    name2: '1532',
  },
  {
    name: '德邦物流',
    name1: '8',
    name2: '1032',
  },
  {
    name: '永川物流',
    name1: '4',
    name2: '732',
  },
  {
    name: '致胜物流',
    name1: '3',
    name2: '372',
  },
  {
    name: '临沂中巨物流有限公司',
    name1: '2',
    name2: '352',
  },
];
const DetailList: React.FC = (props: any) => {
  const { rankData, amountListData } = props;
  const [data, setData] = useState();
  const [listData, setListData] = useState();
  useEffect(() => {
    setData(rankData);
    setListData(amountListData);
  }, [rankData, amountListData]);
  const actionRef = useRef<ActionType>();
  const [formObj] = ProForm.useForm();

  useEffect(() => {}, []);

  const columns = [
    {
      title: '排名',
      width: 50,
      key: 'index',
      valueType: 'indexBorder',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '企业名称',
      dataIndex: 'uname',
      key: 'uname',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '租赁资产数量',
      dataIndex: 'assets_count',
      key: 'assets_count',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '租赁金额（元）',
      dataIndex: 'amount',
      align: 'center',
      key: 'amount',
      ellipsis: true,
    },
  ];
  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.salesCard}>
            <Tabs
              // tabBarExtraContent={
              //   <div className={styles.salesExtraWrap}>
              //     <ProForm
              //   submitter={{
              //     render: (props) => (
              //       []
              //     ),
              //   }}
              //   form={formObj}
              //   style={{ marginTop: '-5px' }}
              // >
              //   <ProFormDateRangePicker
              //     name="dateRange"
              //     style={{ width: 256 }}
              //     fieldProps={{
              //       onChange: handleRangePickerChange
              //     }}
              //     label=" " />
              // </ProForm>
              //   </div>
              // }
              size="large"
              tabBarStyle={{ marginBottom: 24 }}
            >
              <TabPane tab="租赁收款" key="1">
                <Row>
                  <Col xl={14} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <PropertyColumn listData={listData} />
                    </div>
                  </Col>
                  <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}>企业租赁排名</h4>
                      {rankData && (
                        <ProTable<any>
                          bordered={false}
                          columns={columns}
                          actionRef={actionRef}
                          dataSource={rankData}
                          // request={(params) => getList(params)}
                          editable={{
                            type: 'multiple',
                          }}
                          columnsState={{
                            persistenceKey: 'pro-table-singe-demos',
                            persistenceType: 'localStorage',
                          }}
                          rowKey="title"
                          search={false}
                          pagination={false}
                          options={false}
                          dateFormatter="string"
                          headerTitle={false}
                          toolBarRender={false}
                        />
                      )}
                    </div>
                  </Col>
                </Row>
              </TabPane>
              {/* <TabPane tab="资产租赁" key="2">
                <Row>
                  <Col xl={14} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <PropertyColumn hardwareData={data} />
                    </div>
                  </Col>
                  <Col xl={10} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}>企业租赁排名</h4>
                      {
                        ipData&& <ProTable<any>
                        bordered={false}
                        columns={columns}
                        actionRef={actionRef}
                        dataSource={ipData}
                        // request={(params) => getList(params)}
                        editable={{
                          type: 'multiple',
                        }}
                        columnsState={{
                          persistenceKey: 'pro-table-singe-demos',
                          persistenceType: 'localStorage',
                        }}
                        rowKey="title"
                        search={false}
                        pagination={false}
                        options={false}
                        dateFormatter="string"
                        headerTitle={false}
                        toolBarRender={false}
                      />
                      }
                    </div>
                  </Col>
                </Row>
              </TabPane> */}
            </Tabs>
          </div>
        </Card>
        {/* <Card
          title="报警数排行"
          className='monitorStatic'
          bordered={false}
          extra={
            <div className={styles.salesExtraWrap} style={{ display: 'flex', alignItems: 'center' }}>
              <div className={styles.salesExtra}>
                <a className={isActive('hour_24')} onClick={() => selectDate('hour_24')}>
                  24h
                </a>
                <a className={isActive('days_7')} onClick={() => selectDate('days_7')}>
                  7天内
                </a>
                <a className={isActive('days_30')} onClick={() => selectDate('days_30')}>
                  30天内
                </a>
              </div>
              <ProForm
                submitter={{
                  render: (props) => (
                    []
                  ),
                }}
                form={formObj}
                style={{ marginTop: '-5px' }}
              >
                <ProFormDateRangePicker
                  name="dateRange"
                  style={{ width: 256 }}
                  fieldProps={{
                    onChange: handleRangePickerChange
                  }}
                  label=" " />
              </ProForm>

            </div>
          }
        >
          <Row>
            <Col xl={8} lg={12} md={12} sm={24} xs={24} className='monitorList'>
              <div className={styles.salesRank} style={{ paddingRight: '8px' }}>
                <h4 className={styles.rankingTitle}>监控资产</h4>
                {
                  rankingListData.length == 0 ? <Empty className={styles.empty} /> : <ul className={styles.rankingList} style={{ height: '380px', overflowY: 'auto', paddingRight: '12px' }}>
                    {rankingListData.map((item, i) => (
                      <li className={item.asser_id === rowId ? 'active' : ''} key={item.asser_id} style={{ cursor: 'pointer', padding: '5px 15px' }} onClick={() => {
                        setRowId(item.asser_id)
                        getColumnData(item.asser_id, valueType, rangePickerValue)
                      }}>
                        <span className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}>
                          {i + 1}
                        </span>
                        <span className={styles.rankingItemTitle} title={item.asserts_ip}>
                          {item.asserts_ip}
                        </span>
                        <span>{numeral(item.total_count).format('0,0')}</span>
                      </li>
                    ))}
                  </ul>
                }
              </div>
            </Col>
            <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                <DemoColumn columnData={columnData} />
            </Col>
          </Row>
        </Card> */}
      </Col>
    </Row>
  );
};

export default DetailList;
