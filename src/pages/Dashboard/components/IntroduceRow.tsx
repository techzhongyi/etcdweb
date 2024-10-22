import React, { useEffect, useState } from 'react';
import { Col, Row, Tooltip } from 'antd';
import { ChartCard, Field } from './Charts';
import numeral from 'numeral';
import Trend from './Trend';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Area } from '@ant-design/plots';
import dayjs from 'dayjs';
import { TinyArea } from '@ant-design/charts';
import Yuan from '../utils/Yuan';
const topColResponsiveProps = {
  xs: 24,
  sm: 6,
  md: 6,
  lg: 6,
  xl: 6,
  style: { marginBottom: 24 },
};
const IntroduceRow: React.FC = (props: any) => {
  const { total } = props;
  const [data, setData] = useState(total);
  useEffect(() => {
    setData(total);
  }, [total]);

  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          // loading={loading}
          bordered={false}
          title="资产总数"
          action={false}
          total={numeral(data.assets_count).format('0,0')}
          footer={false}
          contentHeight={80}
        >
          {/* <div style={{ margin: '10px 0' }}>
            <TinyArea xField="x" height={45} forceFit yField="y" smooth data={visitData} />
          </div>
          <Trend flag="up" >
            日同比
            <span>11%</span>
          </Trend> */}
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          // loading={loading}
          title="客户总数"
          action={false}
          total={numeral(data.user_count).format('0,0')}
          footer={false}
          contentHeight={80}
        ></ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          // loading={loading}
          bordered={false}
          title="租赁总收入"
          action={false}
          total={() => <Yuan>{data.earning}</Yuan>}
          footer={false}
          contentHeight={80}
        >
          {/* <div style={{ margin: '10px 0' }}>
            <TinyArea xField="x" height={45} forceFit yField="y" smooth data={visitData} />
          </div>
          <Trend flag="up" >
            日同比
            <span>11%</span>
          </Trend> */}
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          // loading={loading}
          bordered={false}
          title="订单总数量"
          action={false}
          total={numeral(data.order_count).format('0,0')}
          footer={false}
          contentHeight={80}
        >
          {/* <div style={{ margin: '10px 0' }}>
            <TinyArea xField="x" height={45} forceFit yField="y" smooth data={visitData} />
          </div>
          <Trend flag="up" >
            日同比
            <span>11%</span>
          </Trend> */}
        </ChartCard>
      </Col>
    </Row>
  );
};

export default IntroduceRow;
