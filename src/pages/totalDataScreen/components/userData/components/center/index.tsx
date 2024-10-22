import React, { useState, useEffect } from 'react';
import './index.less';
import zlsc from '../../../../../../../public/icons/dataImage2/zlsc.png';
import yxsc from '../../../../../../../public/icons/dataImage2/yxsc.png';
import bncs from '../../../../../../../public/icons/dataImage2/bncs.png';
import zk from '../../../../../../../public/icons/dataImage2/zk.png';
import qk from '../../../../../../../public/icons/dataImage2/qk.png';
import van from '../../../../../../../public/icons/dataImage2/van.png';
import gc from '../../../../../../../public/icons/dataImage2/gc.png';
import cx from '../../../../../../../public/icons/dataImage2/cx.png';
import power from '../../../../../../../public/icons/dataImage2/power.png';
import powerRed from '../../../../../../../public/icons/dataImage2/powerRed.png';
import powerOther from '../../../../../../../public/icons/dataImage2/powerOther.png';
import img1 from '../../../../../../../public/icons/dataImage2/1.png';
import img2 from '../../../../../../../public/icons/dataImage2/2.png';
import img3 from '../../../../../../../public/icons/dataImage2/3.png';
import img4 from '../../../../../../../public/icons/dataImage2/4.png';
import img5 from '../../../../../../../public/icons/dataImage2/5.png';
import img6 from '../../../../../../../public/icons/dataImage2/6.png';
import img7 from '../../../../../../../public/icons/dataImage2/7.png';
import img8 from '../../../../../../../public/icons/dataImage2/8.png';
import img9 from '../../../../../../../public/icons/dataImage2/9.png';
import img0 from '../../../../../../../public/icons/dataImage2/0.png';
import imgpoint from '../../../../../../../public/icons/dataImage2/point.png';
import address from '../../../../../../../public/icons/dataImage2/address.png';
import circlebg from '../../../../../../../public/icons/dataImage2/circlebg.png';
import { Table } from 'antd';
import eventBus from '@/utils/eventBus';
import {
  getAssetsListAPI,
  getCarDetailInfoAPI,
  getuserInfoAPI,
} from '@/services/totalDataScreen';
import { history } from 'umi';
import CountUp from 'react-countup';
const Center: React.FC<any> = (props) => {
  const [id, setId] = useState('');
  const [isVisibel, setIsVisibel] = useState(false);
  const [selctedCar, setSelctedCar] = useState(undefined);
  const [data, setData] = useState([]); // 表格数据
  const [baseInfoData, setBaseInfoData] = useState({
    book_assets_count: 0,
    mileage: 0,
    order_count: 0,
    rent_assets_count: 0,
    return_assets_count: 0,
    send_assets_count: 0,
    total_assets_count: 0,
  });
  const [carInfoData, setCarInfoData] = useState({
    assets_type: 1,
    charge_count: 0,
    consumption: 0,
    discharge: 0,
    is_valid: 0,
    mileage: 0,
    rent_time: 0,
    run_time: 0,
    soc: 0,
    speed: 0,
    charge: 0,
  });
  // 加载状态
  const [isLoading, setIsLoading] = useState(false); // 加载状态
  const [rowIndex, setRowIndex] = useState(0); // 选中某一行
  const [hasMore, setHasMore] = useState(true); // 是否还有更多数据
  const [page, setPage] = useState(2); // 当前页数
  const pageSize = 12; // 每页数据量
  const columns: any[] = [
    {
      title: '资产类型',
      dataIndex: 'assets_type',
      key: 'assets_type',
      hideInSearch: true,
      align: 'center',
      render: (_, row) => {
        return (
          <div>
            {row.assets_type === 1
              ? '重卡'
              : row.assets_type === 2
              ? '轻卡'
              : row.assets_type === 3
              ? 'VAN车'
              : row.assets_type === 4
              ? '车厢'
              : row.assets_type === 5
              ? '挂车'
              : ''}
          </div>
        );
      },
    },
    {
      title: '车牌号',
      key: 'assets_license',
      align: 'center',
      dataIndex: 'assets_license',
    },
    {
      title: '是否启动',
      key: 'car_status',
      align: 'center',
      dataIndex: 'car_status',
      render: (_, row) => {
        if (row.car_status === 1) {
          return (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#4CFFA7',
                }}
              ></span>
            </div>
          );
        } else {
          return (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <span
                style={{
                  display: 'inline-block',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#7a7a7a',
                }}
              ></span>
            </div>
          );
        }
      },
    },
  ];
  // 获取top数据
  const getTopData = async (userId) => {
    const params = {
      page: 1,
      count: pageSize,
      uid: userId,
    };
    const {
      data: { base_info, assets_list },
    } = await getuserInfoAPI(params);
    setBaseInfoData(base_info);
    setSelctedCar(assets_list.list[0]);
    setData(assets_list.list);
  };
  // 获取车辆信息
  const carDetailInfo = async (info, uid) => {
    const params = {
      assets_id: info.assets_id,
      vin: info.assets_vin,
      uid,
    };
    const { data } = await getCarDetailInfoAPI(params);
    setCarInfoData(data);
  };
  const handleEvent = (userId) => {
    getTopData(userId);
    setId(userId);
  };
  const getList = async () => {
    try {
      const {
        data: { list },
      } = await getAssetsListAPI({
        uid: id,
        page: page,
        count: pageSize,
      });
      if (list.length > 0) {
        setData([...data, ...list]);
        setPage(page + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleScroll = (e) => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    console.log(scrollHeight, scrollTop, clientHeight);
    if (scrollHeight - scrollTop - clientHeight <= 10) {
      // 距离底部10px时加载更多
      if (hasMore && !isLoading) {
        setIsLoading(true);
        getList();
      }
    }
  };
  useEffect(() => {
    if (id && selctedCar) {
      carDetailInfo(selctedCar, id);
    }
  }, [id, selctedCar]);
  // 获取初始数据
  useEffect(() => {
    eventBus.on('message', (userId) => {
      handleEvent(userId);
    });
    return () => {
      eventBus.off('message', handleEvent);
    };
  }, []);
  const goAddress = () => {
    history.push({
      pathname: '/riskControl/propertyMonitoring',
    });
  };
  const images = [
    img0,
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    imgpoint,
  ];
  useEffect(() => {
    const intervalId = setInterval(() => {
      const visibel = !isVisibel;
      setIsVisibel(visibel);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isVisibel]);
  return (
    <div className="center-content">
      <div className="center-top">
        <div className="static-count-top">
          <div className="total-car">
            <div>累计租赁</div>
            <div className="total-car-count">
              <CountUp
                start={0}
                end={baseInfoData.total_assets_count}
                duration={2}
                decimals={0}
              ></CountUp>
              {/* {baseInfoData.total_assets_count} */}
            </div>
            <div>辆车</div>
          </div>
          <div className="total-km">
            <div>行驶里程</div>
            <div className="total-km-count">
              <CountUp
                start={0}
                end={baseInfoData.mileage}
                duration={2}
                decimals={2}
              ></CountUp>
            </div>
            <div>KM</div>
          </div>
        </div>
        <div className="static-count-bottom">
          <div className="static-count-order">
            <div className="number">
              <CountUp
                start={0}
                end={baseInfoData.order_count}
                duration={2}
                decimals={0}
              ></CountUp>
            </div>
            <div className="order-title">订单数</div>
          </div>
          <div className="static-count-order">
            <div className="number">
              <CountUp
                start={0}
                end={baseInfoData.book_assets_count}
                duration={2}
                decimals={0}
              ></CountUp>
            </div>
            <div className="order-title">已预定车辆</div>
          </div>
          <div className="static-count-order">
            <div className="number">
              <CountUp
                start={0}
                end={baseInfoData.send_assets_count}
                duration={2}
                decimals={0}
              ></CountUp>
            </div>
            <div className="order-title">待收车辆</div>
          </div>
          <div className="static-count-order">
            <div className="number">
              <CountUp
                start={0}
                end={baseInfoData.rent_assets_count}
                duration={2}
                decimals={0}
              ></CountUp>
            </div>
            <div className="order-title">已租车辆</div>
          </div>
          <div className="static-count-order">
            <div className="number">
              <CountUp
                start={0}
                end={baseInfoData.return_assets_count}
                duration={2}
                decimals={0}
              ></CountUp>
            </div>
            <div className="order-title">待还车辆</div>
          </div>
        </div>
      </div>
      <div className="center-bottom">
        <div className="title-content">
          <div className="title-content-left">
            <div className="icon"></div>
            <div>客户租赁综合统计</div>
          </div>
          <div
            className="title-content-right"
            onClick={() => {
              goAddress();
            }}
          >
            <div className="title-address">查看位置</div>
            <div className="icon-address">
              <img src={address} alt="" />
            </div>
          </div>
        </div>
        <div className="center-bottom-data-content">
          <div className="left">
            <div className="car-info">
              <div className="car-info-list">
                <div>
                  <img src={zlsc} alt="" />
                </div>
                <div>
                  <div className="number">
                    <span>
                      <CountUp
                        start={0}
                        end={carInfoData.rent_time}
                        duration={2}
                        decimals={0}
                      ></CountUp>
                    </span>
                    天
                  </div>
                  <div>租赁时长</div>
                </div>
              </div>
              <div className="car-info-list">
                <div>
                  <img src={yxsc} alt="" />
                </div>
                <div>
                  <div className="number">
                    <span>
                      <CountUp
                        start={0}
                        end={carInfoData.run_time}
                        duration={2}
                        decimals={2}
                      ></CountUp>
                    </span>
                    小时
                  </div>
                  <div>运营时长</div>
                </div>
              </div>{' '}
              <div className="car-info-list">
                <div>
                  <img src={bncs} alt="" />
                </div>
                <div>
                  <div className="number">
                    <span>
                      <CountUp
                        start={0}
                        end={carInfoData.charge_count}
                        duration={2}
                        decimals={0}
                      ></CountUp>
                    </span>
                    次
                  </div>
                  <div>充电次数</div>
                </div>
              </div>
            </div>
            <div className="car-ki-info">
              <div className="car-ki-data">
                <div>已行驶里程数</div>
                <div className="number-img">
                  {carInfoData.mileage
                    .toString()
                    .split('')
                    .map((item) => {
                      if (item >= 0 && item <= 9) {
                        return <img src={images[parseInt(item)]} alt="" />;
                      } else {
                        return <img src={imgpoint} alt="" />;
                      }
                    })}
                </div>
                <div>KM</div>
              </div>
            </div>
            <div className="car-power-info">
              <div className="car-power-content">
                <div className="car-power">
                  <div className="bg-image">
                    <img src={circlebg} alt="" />
                  </div>
                  <div className="car-power-number" id="circle">
                    <div className="number16">
                      <CountUp
                        start={0}
                        end={carInfoData.consumption}
                        duration={2}
                        decimals={2}
                      ></CountUp>
                    </div>
                    <div className="number12">KWH/1KM</div>
                  </div>
                  <div className="car-power-title">平均能耗</div>
                </div>
                <div className="car-power">
                  <div className="bg-image">
                    <img src={circlebg} alt="" />
                  </div>
                  <div className="car-power-number" id="circle">
                    <div className="number16">
                      <CountUp
                        start={0}
                        end={carInfoData.discharge}
                        duration={2}
                        decimals={0}
                      ></CountUp>
                    </div>
                    <div className="number12">KWH</div>
                  </div>
                  <div className="car-power-title">累计耗电量</div>
                </div>
              </div>
              <div className="car-img">
                <div>
                  <img
                    src={
                      carInfoData.assets_type == 1
                        ? zk
                        : carInfoData.assets_type == 2
                        ? qk
                        : carInfoData.assets_type == 3
                        ? van
                        : carInfoData.assets_type == 4
                        ? cx
                        : carInfoData.assets_type == 5
                        ? gc
                        : zk
                    }
                    alt=""
                  />
                </div>
                <div className="car-power-progress">
                  <div className="car-power-progress-top">
                    <div>平均速度：{carInfoData.speed}KM/H</div>
                    <div className="power-remaining">
                      <div
                        className="power-remaining-number"
                        style={{
                          color:
                            carInfoData.soc >= 75
                              ? '#00D5B0'
                              : carInfoData.soc < 75 && carInfoData.soc >= 50
                              ? '#8BB1FF'
                              : '#FD4E22',
                        }}
                      >
                        <CountUp
                          start={0}
                          end={carInfoData.soc}
                          duration={2}
                          decimals={0}
                        ></CountUp>
                      </div>
                      <div>
                        <div style={{ width: '13px', height: '20px' }}>
                          <img
                            style={{ display: isVisibel ? 'block' : 'none' }}
                            src={
                              carInfoData.soc >= 75
                                ? power
                                : carInfoData.soc < 75 && carInfoData.soc >= 50
                                ? powerOther
                                : powerRed
                            }
                            alt=""
                          />
                        </div>
                        <div
                          style={{
                            color:
                              carInfoData.soc >= 75
                                ? '#00D5B0'
                                : carInfoData.soc < 75 && carInfoData.soc >= 50
                                ? '#8BB1FF'
                                : '#FD4E22',
                          }}
                        >
                          %
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="progress-style">
                    <div
                      className="progress-border"
                      style={{
                        border:
                          carInfoData.soc >= 75
                            ? '1px solid #00D5B0'
                            : carInfoData.soc < 75 && carInfoData.soc >= 50
                            ? '1px solid #8BB1FF'
                            : '1px solid #FD4E22',
                      }}
                    >
                      <div
                        className="progress-content"
                        style={{
                          width: carInfoData.soc + '%',
                          background:
                            carInfoData.soc >= 75
                              ? 'linear-gradient(to right, #1CB9CC 0%, #22E1FF 100%)'
                              : carInfoData.soc < 75 && carInfoData.soc >= 50
                              ? 'linear-gradient(to right, #a4c2fe 0%, #8BB1FF 100%)'
                              : 'linear-gradient(to right, #ff5050 0%, #FF2323 100%)',
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="right-table" onScrollCapture={handleScroll}>
            <div className="selected-car-title">已租车辆选择</div>
            <Table
              dataSource={data}
              columns={columns}
              locale={{
                emptyText: '', // 使用自定义组件作为“暂无数据”的提示
              }}
              rowKey={(record) => record.id}
              rowClassName={(_, index) =>
                index === rowIndex ? 'rowBgColor' : ''
              }
              onRow={(record, index) => {
                return {
                  onClick: () => {
                    // 确定点击的是哪一行
                    setRowIndex(index);
                    carDetailInfo(record, id);
                  },
                };
              }}
              loading={isLoading}
              pagination={false}
              scroll={{ y: '400px' }} // 根据需要设置表格高度
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Center;
