import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Tooltip } from 'antd';
import { ChartCard, Field } from './Charts';
import numeral from 'numeral';
import Trend from './Trend';
import { InfoCircleOutlined, RightOutlined } from '@ant-design/icons';
import { Area } from '@ant-design/plots';
import dayjs from 'dayjs';
import { TinyArea } from '@ant-design/charts';
import './gridData.less';
const topColResponsiveProps = {
  xs: 24,
  sm: 6,
  md: 6,
  lg: 6,
  xl: 6,
  style: { marginBottom: 24 },
};

const GridData: React.FC = (props: any) => {
  const { gridData } = props;
  const [data, setData] = useState(gridData);

  useEffect(() => {
    setData(gridData);
  }, [gridData]);

  return (
    <>
      <Row gutter={24}>
        {data.map((item: any) => {
          return (
            <Col {...topColResponsiveProps}>
              <Card bodyStyle={{ padding: 0 }}>
                <div className="wrap">
                  <div className="wrap-top">
                    <div className="wrap-title">
                      <div className="title">
                        {item.status == 0
                          ? '整备中资产'
                          : item.status == 1
                          ? '可交付资产'
                          : item.status == 2
                          ? ' 已锁定资产'
                          : item.status == 3
                          ? '已发车资产'
                          : item.status == 4
                          ? '在租中资产'
                          : item.status == 5
                          ? '待还车资产'
                          : item.status == 6
                          ? '已报废资产'
                          : item.status == 7
                          ? '已回收资产'
                          : ''}
                      </div>
                      <div className="icon"></div>
                    </div>
                    <div className="wrap-data">
                      <div className="wrap-data-number">{item.total}</div>
                      <div className="wrap-data-up"></div>
                    </div>
                  </div>

                  <div className="wrap-bottom">
                    <div className="box-group">
                      <div
                        className="heavy"
                        style={{
                          width:
                            ((item.heavy_count / item.total) * 100).toFixed(2) +
                            '%',
                        }}
                      ></div>
                      <div
                        className="light"
                        style={{
                          width:
                            ((item.light_count / item.total) * 100).toFixed(2) +
                            '%',
                        }}
                      ></div>
                      <div
                        className="van"
                        style={{
                          width:
                            ((item.wan_count / item.total) * 100).toFixed(2) +
                            '%',
                        }}
                      ></div>
                      <div
                        className="trailer"
                        style={{
                          width:
                            ((item.mounted_count / item.total) * 100).toFixed(
                              2,
                            ) + '%',
                        }}
                      ></div>
                      <div
                        className="carriage"
                        style={{
                          width: (item.carriage_count / item.total) * 100 + '%',
                        }}
                      ></div>
                    </div>
                    <div className="data-group">
                      <div>
                        <div className="data">{item.heavy_count}</div>
                        <div className="icon">
                          <div className="heavy-icon"></div>
                          <div className="right-text">重卡</div>
                        </div>
                      </div>
                      <div>
                        <div className="data">{item.light_count}</div>
                        <div className="icon">
                          <div className="light-icon"></div>
                          <div className="right-text">轻卡</div>
                        </div>
                      </div>
                      <div>
                        <div className="data">{item.wan_count}</div>
                        <div className="icon">
                          <div className="van-icon"></div>
                          <div className="right-text">VAN车</div>
                        </div>
                      </div>
                      <div>
                        <div className="data">{item.mounted_count}</div>
                        <div className="icon">
                          <div className="trailer-icon"></div>
                          <div className="right-text">挂车</div>
                        </div>
                      </div>
                      <div>
                        <div className="data">{item.carriage_count}</div>
                        <div className="icon">
                          <div className="carriage-icon"></div>
                          <div className="right-text">车厢</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          );
        })}
        {/* <Col {...topColResponsiveProps}>
                    <Card bodyStyle={{ padding: 0 }}>
                        <div className='wrap'>
                            <div className='wrap-top'>
                                <div className='wrap-title'>
                                    <div className='title'>整备中资产</div>
                                    <div className='icon'><RightOutlined /></div>
                                </div>
                                <div className='wrap-data'>
                                    <div className='wrap-data-number'>26556</div>
                                    <div className='wrap-data-up'>较昨日 +109</div>
                                </div>
                            </div>

                            <div className='wrap-bottom'>
                                <div className='box-group'>
                                    <div className='heavy'></div>
                                    <div className='light'></div>
                                    <div className='van'></div>
                                    <div className='trailer'></div>
                                    <div className='carriage'></div>
                                </div>
                                <div className='data-group'>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='heavy-icon'></div>
                                            <div className='right-text'>重卡</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='light-icon'></div>
                                            <div className='right-text'>轻卡</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='van-icon'></div>
                                            <div className='right-text'>VAN车</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='trailer-icon'></div>
                                            <div className='right-text'>挂车</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='carriage-icon'></div>
                                            <div className='right-text'>车厢</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col {...topColResponsiveProps}>
                    <Card bodyStyle={{ padding: 0 }}>
                        <div className='wrap'>
                            <div className='wrap-top'>
                                <div className='wrap-title'>
                                    <div className='title'>已预定资产</div>
                                    <div className='icon'><RightOutlined /></div>
                                </div>
                                <div className='wrap-data'>
                                    <div className='wrap-data-number'>26556</div>
                                    <div className='wrap-data-up'>较昨日 +109</div>
                                </div>
                            </div>

                            <div className='wrap-bottom'>
                                <div className='box-group'>
                                    <div className='heavy'></div>
                                    <div className='light'></div>
                                    <div className='van'></div>
                                    <div className='trailer'></div>
                                    <div className='carriage'></div>
                                </div>
                                <div className='data-group'>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='heavy-icon'></div>
                                            <div className='right-text'>重卡</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='light-icon'></div>
                                            <div className='right-text'>轻卡</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='van-icon'></div>
                                            <div className='right-text'>VAN车</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='trailer-icon'></div>
                                            <div className='right-text'>挂车</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='carriage-icon'></div>
                                            <div className='right-text'>车厢</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col {...topColResponsiveProps}>
                    <Card bodyStyle={{ padding: 0 }}>
                        <div className='wrap'>
                            <div className='wrap-top'>
                                <div className='wrap-title'>
                                    <div className='title'>待租赁资产</div>
                                    <div className='icon'></div>
                                </div>
                                <div className='wrap-data'>
                                    <div className='wrap-data-number'>{status0.total}</div>
                                    <div className='wrap-data-up'></div>
                                </div>
                            </div>

                            <div className='wrap-bottom'>
                                <div className='box-group'>
                                    <div className='heavy' style={{ width: (status0.heavy_count / status0.total).toFixed(2) }}></div>
                                    <div className='light' style={{ width: (status0.light_count / status0.total).toFixed(2) }}></div>
                                    <div className='van' style={{ width: (status0.wan_count / status0.total).toFixed(2) }}></div>
                                    <div className='trailer' style={{ width: (status0.mounted_count / status0.total).toFixed(2) }}></div>
                                    <div className='carriage' style={{ width: (status0.carriage_count / status0.total).toFixed(2) }}></div>
                                </div>
                                <div className='data-group'>
                                    <div>
                                        <div className='data'>{status0.heavy_count}</div>
                                        <div className='icon'>
                                            <div className='heavy-icon'></div>
                                            <div className='right-text'>重卡</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>{status0.light_count}</div>
                                        <div className='icon'>
                                            <div className='light-icon'></div>
                                            <div className='right-text'>轻卡</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>{status0.wan_count}</div>
                                        <div className='icon'>
                                            <div className='van-icon'></div>
                                            <div className='right-text'>VAN车</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>{status0.mounted_count}</div>
                                        <div className='icon'>
                                            <div className='trailer-icon'></div>
                                            <div className='right-text'>挂车</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>{status0.carriage_count}</div>
                                        <div className='icon'>
                                            <div className='carriage-icon'></div>
                                            <div className='right-text'>车厢</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col {...topColResponsiveProps}>
                    <Card bodyStyle={{ padding: 0 }}>
                        <div className='wrap'>
                            <div className='wrap-top'>
                                <div className='wrap-title'>
                                    <div className='title'>待交车资产</div>
                                    <div className='icon'><RightOutlined /></div>
                                </div>
                                <div className='wrap-data'>
                                    <div className='wrap-data-number'>26556</div>
                                    <div className='wrap-data-up'>较昨日 +109</div>
                                </div>
                            </div>

                            <div className='wrap-bottom'>
                                <div className='box-group'>
                                    <div className='heavy'></div>
                                    <div className='light'></div>
                                    <div className='van'></div>
                                    <div className='trailer'></div>
                                    <div className='carriage'></div>
                                </div>
                                <div className='data-group'>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='heavy-icon'></div>
                                            <div className='right-text'>重卡</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='light-icon'></div>
                                            <div className='right-text'>轻卡</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='van-icon'></div>
                                            <div className='right-text'>VAN车</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='trailer-icon'></div>
                                            <div className='right-text'>挂车</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='carriage-icon'></div>
                                            <div className='right-text'>车厢</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col> */}
      </Row>
      {/* <Row gutter={24}>
                <Col {...topColResponsiveProps}>
                    <Card bodyStyle={{ padding: 0 }}>
                        <div className='wrap'>
                            <div className='wrap-top'>
                                <div className='wrap-title'>
                                    <div className='title'>在租中资产</div>
                                    <div className='icon'><RightOutlined /></div>
                                </div>
                                <div className='wrap-data'>
                                    <div className='wrap-data-number'>26556</div>
                                    <div className='wrap-data-up'>较昨日 +109</div>
                                </div>
                            </div>

                            <div className='wrap-bottom'>
                                <div className='box-group'>
                                    <div className='heavy'></div>
                                    <div className='light'></div>
                                    <div className='van'></div>
                                    <div className='trailer'></div>
                                    <div className='carriage'></div>
                                </div>
                                <div className='data-group'>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='heavy-icon'></div>
                                            <div className='right-text'>重卡</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='light-icon'></div>
                                            <div className='right-text'>轻卡</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='van-icon'></div>
                                            <div className='right-text'>VAN车</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='trailer-icon'></div>
                                            <div className='right-text'>挂车</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='carriage-icon'></div>
                                            <div className='right-text'>车厢</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col {...topColResponsiveProps}>
                    <Card bodyStyle={{ padding: 0 }}>
                        <div className='wrap'>
                            <div className='wrap-top'>
                                <div className='wrap-title'>
                                    <div className='title'>待还车资产</div>
                                    <div className='icon'><RightOutlined /></div>
                                </div>
                                <div className='wrap-data'>
                                    <div className='wrap-data-number'>26556</div>
                                    <div className='wrap-data-up'>较昨日 +109</div>
                                </div>
                            </div>

                            <div className='wrap-bottom'>
                                <div className='box-group'>
                                    <div className='heavy'></div>
                                    <div className='light'></div>
                                    <div className='van'></div>
                                    <div className='trailer'></div>
                                    <div className='carriage'></div>
                                </div>
                                <div className='data-group'>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='heavy-icon'></div>
                                            <div className='right-text'>重卡</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='light-icon'></div>
                                            <div className='right-text'>轻卡</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='van-icon'></div>
                                            <div className='right-text'>VAN车</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='trailer-icon'></div>
                                            <div className='right-text'>挂车</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='carriage-icon'></div>
                                            <div className='right-text'>车厢</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col {...topColResponsiveProps}>
                    <Card bodyStyle={{ padding: 0 }}>
                        <div className='wrap'>
                            <div className='wrap-top'>
                                <div className='wrap-title'>
                                    <div className='title'>已报废资产</div>
                                    <div className='icon'><RightOutlined /></div>
                                </div>
                                <div className='wrap-data'>
                                    <div className='wrap-data-number'>26556</div>
                                    <div className='wrap-data-up'>较昨日 +109</div>
                                </div>
                            </div>

                            <div className='wrap-bottom'>
                                <div className='box-group'>
                                    <div className='heavy'></div>
                                    <div className='light'></div>
                                    <div className='van'></div>
                                    <div className='trailer'></div>
                                    <div className='carriage'></div>
                                </div>
                                <div className='data-group'>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='heavy-icon'></div>
                                            <div className='right-text'>重卡</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='light-icon'></div>
                                            <div className='right-text'>轻卡</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='van-icon'></div>
                                            <div className='right-text'>VAN车</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='trailer-icon'></div>
                                            <div className='right-text'>挂车</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='carriage-icon'></div>
                                            <div className='right-text'>车厢</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col {...topColResponsiveProps}>
                    <Card bodyStyle={{ padding: 0 }}>
                        <div className='wrap'>
                            <div className='wrap-top'>
                                <div className='wrap-title'>
                                    <div className='title'>已回收资产</div>
                                    <div className='icon'><RightOutlined /></div>
                                </div>
                                <div className='wrap-data'>
                                    <div className='wrap-data-number'>26556</div>
                                    <div className='wrap-data-up'>较昨日 +109</div>
                                </div>
                            </div>

                            <div className='wrap-bottom'>
                                <div className='box-group'>
                                    <div className='heavy'></div>
                                    <div className='light'></div>
                                    <div className='van'></div>
                                    <div className='trailer'></div>
                                    <div className='carriage'></div>
                                </div>
                                <div className='data-group'>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='heavy-icon'></div>
                                            <div className='right-text'>重卡</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='light-icon'></div>
                                            <div className='right-text'>轻卡</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='van-icon'></div>
                                            <div className='right-text'>VAN车</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='trailer-icon'></div>
                                            <div className='right-text'>挂车</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='data'>110</div>
                                        <div className='icon'>
                                            <div className='carriage-icon'></div>
                                            <div className='right-text'>车厢</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row> */}
    </>
  );
};

export default GridData;
