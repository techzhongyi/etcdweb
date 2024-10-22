import React, { Suspense, useEffect, useState } from 'react';
import { GridContent, PageContainer } from '@ant-design/pro-layout';
import IntroduceRow from './components/IntroduceRow';
import DetailList from './components/detailList';
import {
  getMonitorStatistics,
  getStatistics,
} from '@/services/dashboard/dashboard';
import { Col, message, Row } from 'antd';
import Statistical from './components/statistical';
import ChartList from './components/chartList';
import PropertyPie from './components/propertyPie';
import GridData from './components/gridData';
import PropertyPie2 from './components/propertyPie2';

// 统计
const initData = {
  total: {
    assets_count: 0,
    order_count: 0,
    user_count: 0,
    earning: 0,
  },
  assets_list: [],
  amount_list: [],
  receipt_list: [],
  user_rank: [],
};

const Dashboard: React.ReactNode = () => {
  const [statisticsData, setStatisticsData] = useState(initData);
  const getData = async () => {
    const { data, status, msg } = await getStatistics({});
    if (status === 0) {
      setStatisticsData(data);
    } else {
      message.error(msg);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <PageContainer
      ghost
      header={{
        title: ' ',
        breadcrumb: {},
      }}
    >
      <GridContent>
        <>
          {/*  */}
          <Suspense fallback={null}>
            <IntroduceRow total={statisticsData.total} />
          </Suspense>
          <Suspense fallback={null}>
            <GridData gridData={statisticsData.assets_list} />
          </Suspense>
          <Row gutter={24}>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <PropertyPie pieData={statisticsData.receipt_list} />
              </Suspense>
            </Col>
            <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <Suspense fallback={null}>
                <PropertyPie2 pieData={statisticsData.receipt_list} />
              </Suspense>
            </Col>
          </Row>
          <Suspense fallback={null}>
            <DetailList
              rankData={statisticsData.user_rank}
              amountListData={statisticsData.amount_list}
            />
          </Suspense>
          {/* <Suspense fallback={null}>
          <ChartList  />
        </Suspense> */}
        </>
      </GridContent>
    </PageContainer>
  );
};

export default Dashboard;
