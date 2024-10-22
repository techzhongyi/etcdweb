import React, { useEffect, useState } from 'react';
import { Card, Col, Radio, Row, Tabs } from 'antd';
import TabPane from 'antd/lib/tabs/TabPane';
import styles from '../styles.less';
import './chartList.less';
import PropertyLine from './propertyLine';
import { RingProgress } from '@ant-design/charts';
import {
  getAlertTrend,
  getAlertTrendRecord,
} from '@/services/dashboard/dashboard';
const topColResponsiveProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 24,
  xl: 24,
  style: { marginBottom: 20 },
};
const data1 = [
  {
    level: 1,
    title: '超出运营范围',
    total_count: 100,
    ratio: 0.9,
  },
  {
    level: 2,
    title: '停留超时',
    total_count: 100,
    ratio: 0.65,
  },
  {
    level: 3,
    title: '资产失联',
    total_count: 100,
    ratio: 0.6,
  },
  {
    level: 4,
    title: '年检超时',
    total_count: 100,
    ratio: 0.75,
  },
  {
    level: 5,
    title: '租金逾期',
    total_count: 100,
    ratio: 0.8,
  },
];

const ChartList: React.FC = (props: any) => {
  useEffect(() => {}, []);
  const [select1, setSelect1] = useState([1]);
  const [defaultValue, setDefaultValue] = useState('hour_24');
  const [activeKeys, setActiveKeys] = useState(1);
  const [alertList, setAlertList] = useState([]);
  const [lineData, setLineData] = useState([]);
  const selectChange = (number) => {
    if (select1.indexOf(number) != -1) {
      if (select1.length === 1) {
        return;
      } else {
        let itemLists = [...select1];
        itemLists.splice(select1.indexOf(number), 1);
        setSelect1(itemLists);
        getLine(activeKeys, defaultValue, itemLists);
      }
    } else {
      select1.push(number);
      setSelect1([...select1]);
      getLine(activeKeys, defaultValue, select1);
    }
  };
  const getLine = async (assets_type: any, type: any, levels: any) => {
    const params = {
      assets_type: +assets_type,
      type,
      levels,
    };
    const {
      data: { list },
    } = await getAlertTrendRecord(params);
    setLineData(list);
  };
  const handleTimeType = (e) => {
    setDefaultValue(e.target.value);
    getTrend(activeKeys, e.target.value);
    getLine(activeKeys, e.target.value, select1);
  };
  const handleTabChange = (activeKey: any) => {
    setActiveKeys(activeKey);
    getTrend(activeKey, defaultValue);
    setSelect1([1]);
    getLine(activeKey, defaultValue, [1]);
  };
  const getTrend = async (assets_type: any, type: any) => {
    const params = {
      assets_type: +assets_type,
      type,
    };
    // const { data: { list }, status } = await getAlertTrend(params)
    setAlertList(data1);
  };
  useEffect(() => {
    getTrend(activeKeys, defaultValue);
    getLine(activeKeys, defaultValue, select1);
  }, []);
  return (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <Card
          bordered={false}
          bodyStyle={{ padding: 0 }}
          style={{
            minHeight: '440px',
          }}
        >
          <div className={styles.salesCard}>
            <Tabs
              tabBarExtraContent={
                <div className={styles.salesExtraWrap}>
                  <Radio.Group value={defaultValue} onChange={handleTimeType}>
                    <Radio.Button value="hour_24">近24h</Radio.Button>
                    <Radio.Button value="days_7">近7天</Radio.Button>
                    <Radio.Button value="days_30">近30天</Radio.Button>
                    <Radio.Button value="days_365">近365天</Radio.Button>
                  </Radio.Group>
                </div>
              }
              onChange={handleTabChange}
              size="large"
              tabBarStyle={{ marginBottom: 24 }}
            >
              <TabPane tab="风控预警趋势" key="1">
                <div className="selectCard-content">
                  {alertList?.map((item) => {
                    return (
                      <div
                        key={item?.level}
                        className={[
                          'selectCard',
                          select1.indexOf(item?.level) != -1
                            ? 'selectCardActive'
                            : '',
                        ].join(' ')}
                        onClick={() => {
                          selectChange(item?.level);
                        }}
                      >
                        <div>
                          <div className="selectCard-title">{item.title}</div>
                          <div>数量(次)</div>
                          <div className="selectCard-count">
                            {item.total_count}
                          </div>
                        </div>
                        <div>
                          <div>
                            <RingProgress
                              color="#5578F9"
                              forceFit
                              height={70}
                              width={70}
                              percent={item.ratio}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Row style={{ marginTop: '50px' }}>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <PropertyLine lineData={lineData} />
                    </div>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default ChartList;
