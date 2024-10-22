import React, { useEffect, useRef, useState } from 'react';
import './index.less';
// import datalogo from "../../../public/icons/dataImage/datalogo@3x.png";
import icon1 from '../../../public/icons/dataImage/icon1@2x.png';
import icon2 from '../../../public/icons/dataImage/icon2@2x.png';
import icon3 from '../../../public/icons/dataImage/icon3@2x.png';
import icon4 from '../../../public/icons/dataImage/icon4@2x.png';
import icon5 from '../../../public/icons/dataImage/icon5@3x.png';
import icon6 from '../../../public/icons/dataImage/icon6@3x.png';
import icon7 from '../../../public/icons/dataImage/icon7@3x.png';
import icon8 from '../../../public/icons/dataImage/icon8@3x.png';
import icon9 from '../../../public/icons/dataImage/icon9@3x.png';
import icon10 from '../../../public/icons/dataImage/icon10@3x.png';
import icon11 from '../../../public/icons/dataImage/icon11@3x.png';
import icon12 from '../../../public/icons/dataImage/icon12@3x.png';
import icon13 from '../../../public/icons/dataImage/icon13@2x.png';
import GaugeCharts from './components/Gauge';
import RoseCharts from './components/Rose';
import { Progress, message } from 'antd';
import PieCharts from './components/Pie';
import AreaCharts from './components/Area';
import AreasCharts from './components/Areas';
import MixCharts from './components/Mix';

import ChinaMap from './components/Map';
import {
  getAssetsMaintenance,
  getDownScreen,
  getLeftScreen,
  getDevopsData,
} from '@/services/datascreen';
import DualAxesCharts from './components/DualAxes';
import Weather from '../totalDataScreen/components/weather';
import Clock from '../totalDataScreen/components/clock';
//定义地图数据
const dataList = [
  {
    value: 218,
    name: '北京市',
  },
  {
    value: 122,
    name: '广东省',
  },
  {
    value: 119,
    name: '台湾省',
  },
  {
    value: 81,
    name: '香港特别行政区',
  },
  {
    value: 74,
    name: '山东省',
  },
  {
    value: 68,
    name: '江苏省',
  },
  {
    value: 62,
    name: '浙江省',
  },
  {
    value: 49,
    name: '上海市',
  },
  {
    value: 48,
    name: '河北省',
  },
  {
    value: 43,
    name: '河南省',
  },
  {
    value: 41,
    name: '辽宁省',
  },
  {
    value: 38,
    name: 'NULL',
  },
  {
    value: 36,
    name: '四川省',
  },
  {
    value: 33,
    name: '湖北省',
  },
  {
    value: 31,
    name: '湖南省',
  },
  {
    value: 29,
    name: '安徽省',
  },
  {
    value: 28,
    name: '吉林省',
  },
  {
    value: 26,
    name: '江西省',
  },
  {
    value: 24,
    name: '新疆维吾尔自治区',
  },
  {
    value: 24,
    name: '重庆市',
  },
  {
    value: 23,
    name: '福建省',
  },
  {
    value: 19,
    name: '广西壮族自治区',
  },
  {
    value: 18,
    name: '山西省',
  },
  {
    value: 16,
    name: '云南省',
  },
  {
    value: 16,
    name: '内蒙古自治区',
  },
  {
    value: 16,
    name: '黑龙江省',
  },
  {
    value: 12,
    name: '陕西省',
  },
  {
    value: 12,
    name: '天津市',
  },
  {
    value: 11,
    name: '宁夏回族自治区',
  },
  {
    value: 10,
    name: '甘肃省',
  },
  {
    value: 8,
    name: '贵州省',
  },
  {
    value: 4,
    name: '西藏自治区',
  },
  {
    value: 4,
    name: '青海省',
  },
  {
    value: 1,
    name: '海南省',
  },
];
const Index: React.FC = () => {
  let intervalId = useRef();
  const [isScrolle, setIsScrolle] = useState(true);
  const [isSmall, setIsSmall] = useState(false);
  const [dataDetail, setDataDetail] = useState({
    assets_maintenance_list: [],
    deliverable_assets_list: [],
    deliverable_assets_list_pie: [],
  });
  const [leftDetail, setLeftDetail] = useState({
    month_deliverable_count: 0,
    month_pending_recv_count: 0,
    month_prepare_count: 0,
    month_rent_count: 0,
    rent_rate: 0,
    rent_percentage: [],
    user_rank: [],
  });
  const [downDetail, setDownDetail] = useState({
    date_alert: [],
    date_deliverable: [],
    date_mileage: [],
    date_rent: [],
  });
  const [devopsDetail, setDevopsDetail] = useState({
    assets_count: 0,
    carbon_reduction_count: 0,
    geo_data: [],
    mileage_count: 0,
    operating_areas_count: 0,
    status_rent_assets_count: 0,
  });

  // 滚动速度，值越小，滚动越快
  const speed = 50;
  const warper = useRef();
  const childDom1 = useRef();
  const childDom2 = useRef();
  // 1920*1080
  const handleScreenAuto = () => {
    const designDraftWidth = 1920; //设计稿的宽度
    const designDraftHeight = 1080; //设计稿的高度
    if (
      document.documentElement.clientWidth >= 1920 &&
      document.documentElement.clientHeight >= 1080
    ) {
      setIsSmall(false);
      // 根据屏幕的变化适配的比例
      const scale =
        document.documentElement.clientWidth /
          document.documentElement.clientHeight <
        designDraftWidth / designDraftHeight
          ? document.documentElement.clientWidth / designDraftWidth
          : document.documentElement.clientHeight / designDraftHeight;
      // 缩放比例
      const refData = document.getElementById('refData');
      if (refData) {
        refData.style.transform = `scale(${scale})`;
      }
    } else {
      setIsSmall(true);
    }
  };
  const getAssetsMaintenanceData = async () => {
    const { data, status, msg } = await getAssetsMaintenance({});
    if (status != 0) {
      message.error(msg);
      stopInterval();
      return;
    }
    setDataDetail({
      assets_maintenance_list: data.assets_maintenance_list,
      deliverable_assets_list: data.deliverable_assets_list,
      deliverable_assets_list_pie: data.deliverable_assets_list_pie.filter(
        (item: any) => item.value != 0,
      ),
    });
    return data;
  };
  const getLeftScreenData = async () => {
    const { data, status, msg } = await getLeftScreen({});
    if (status != 0) {
      message.error(msg);
      stopInterval();
      return;
    }
    setLeftDetail(data);
    return data;
  };
  const getDownScreenData = async () => {
    const { data, status, msg } = await getDownScreen({});
    if (status != 0) {
      message.error(msg);
      stopInterval();
      return;
    }
    setDownDetail(data);
    return data;
  };
  const getDevops = async () => {
    const { data, status, msg } = await getDevopsData({});
    if (status != 0) {
      message.error(msg);
      stopInterval();
      return;
    }
    setDevopsDetail(data);
    return data;
  };
  const startInterval = () => {
    intervalId.current = setInterval(() => {
      getAssetsMaintenanceData();
      getLeftScreenData();
      getDownScreenData();
      getDevops();
    }, 60000);
  };
  const stopInterval = () => {
    clearInterval(intervalId.current);
  };

  useEffect(() => {
    // 设置一个定时器，每60秒（60000毫秒）执行一次
    // const intervalId = setInterval(() => {
    //     getAssetsMaintenanceData();
    //     getLeftScreenData();
    //     getDownScreenData();
    //     getDevops();
    // }, 60000);
    startInterval();
    // 清除定时器的函数，用于在组件卸载时停止定时器
    // const cleanup = () => clearInterval(intervalId);
    // Promise.all([getAssetsMaintenanceData(), getLeftScreenData(), getDownScreenData(), getDevops()]).then((res) => {
    //     console.log(res)
    //     if (res.indexOf(false) !== -1) {
    //         cleanup
    //         return
    //     }
    // })
    // 组件挂载后执行一次接口请求
    getAssetsMaintenanceData();
    getLeftScreenData();
    getDownScreenData();
    getDevops();
    // 初始化自适应  ----在刚显示的时候就开始适配一次
    handleScreenAuto();
    // 绑定自适应函数   ---防止浏览器栏变化后不再适配
    window.onresize = () => handleScreenAuto();
    return () => {
      window.onresize = null;
      // cleanup
      stopInterval();
    };
  }, []);
  // 单位转换
  const convertKm = (km: number) => {
    if (km < 10000) {
      return km;
    } else if (km >= 10000 && km < 100000000) {
      return (km / 10000).toFixed(2) + '万';
    } else if (km >= 100000000) {
      return (km / 100000000).toFixed(2) + '亿';
    }
  };
  // 开始滚动
  useEffect(() => {
    if (leftDetail.user_rank.length < 8) {
      return;
    }
    // 多拷贝一层，让它无缝滚动
    childDom2.current.innerHTML = childDom1?.current?.innerHTML;
    let timer: NodeJS.Timer;
    if (isScrolle) {
      timer = setInterval(
        () =>
          warper.current.scrollTop >= childDom1.current.scrollHeight
            ? (warper.current.scrollTop = 0)
            : warper.current.scrollTop++,
        speed,
      );
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isScrolle]);

  const hoverHandler = (flag: boolean) => setIsScrolle(flag);
  return (
    <div className="screen-wrapper">
      <div className="data-bg" id="refData">
        <div className="data-top">
          <div className="data-top-left">
            {/* <div>
                            <img src={datalogo} alt="" />
                        </div>
                        <div>
                            <div>国科智运技术支持</div>
                            <div className="data-top-left-china">
                                GUO KE ZHI YUN JI SHU ZHI CHI
                            </div>
                        </div> */}
          </div>
          <div className="data-top-center">沂威数据运营管理系统</div>
          <div className="data-top-right">
            <Clock />
            <Weather />
          </div>
        </div>
        <div className="data-content">
          <div className="data-content-top">
            <div className="data-content-top-left">
              <div className="left-first">
                <div className="title">本月车辆租赁统计</div>
                <div className="left-first-content">
                  <div className="left-first-content-list">
                    <div className="item">
                      <div className="icon1">
                        <img src={icon1} alt="" />
                      </div>
                      <div className="data">
                        <div>整备中车辆</div>
                        <div>{leftDetail.month_prepare_count}辆</div>
                      </div>
                    </div>
                    <div className="item">
                      <div className="icon2">
                        <img src={icon2} alt="" />
                      </div>
                      <div className="data">
                        <div>待租赁车辆</div>
                        <div>{leftDetail.month_deliverable_count}辆</div>
                      </div>
                    </div>
                    <div className="item">
                      <div className="icon3">
                        <img src={icon3} alt="" />
                      </div>
                      <div className="data">
                        <div>在租中车辆</div>
                        <div>{leftDetail.month_rent_count}辆</div>
                      </div>
                    </div>
                    <div className="item">
                      <div className="icon4">
                        <img src={icon4} alt="" />
                      </div>
                      <div className="data">
                        <div>待还车车辆</div>
                        <div>{leftDetail.month_pending_recv_count}辆</div>
                      </div>
                    </div>
                  </div>

                  <div className="gauge-charts">
                    <GaugeCharts
                      gaugeData={leftDetail.rent_rate}
                      isSmall={isSmall}
                    />
                  </div>
                </div>
              </div>
              <div className="left-second">
                <div className="title">车辆类型在租中占比</div>
                <div className="left-second-content">
                  <div className="rose-charts">
                    <RoseCharts roseData={leftDetail.rent_percentage} />
                  </div>
                  <div className="left-second-content-list">
                    {leftDetail.rent_percentage.map((item, index) => {
                      return (
                        <div className="item">
                          <div className={'icon' + (index + 1)}></div>
                          <div className="data">
                            <div>{item.name}</div>
                            <div>{item.value}辆</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="data-content-top-center">
              <div className="title">运营数据概览</div>
              <div className="data-content-top-center-content">
                <div className="tags">
                  <div className="tags-item">
                    <div className="tags-item-left">
                      {convertKm(devopsDetail.assets_count)}辆
                    </div>
                    <div className="tags-item-right">车辆总数</div>
                  </div>
                  <div className="tags-item">
                    <div className="tags-item-left">
                      {convertKm(devopsDetail.status_rent_assets_count)}辆
                    </div>
                    <div className="tags-item-right">在租总数</div>
                  </div>
                  <div className="tags-item">
                    <div className="tags-item-left">
                      {convertKm(devopsDetail.operating_areas_count)}个
                    </div>
                    <div className="tags-item-right">所在区域</div>
                  </div>
                  <div className="tags-item">
                    <div className="tags-item-left">
                      {convertKm(devopsDetail.mileage_count)}公里
                    </div>
                    <div className="tags-item-right">总里程数</div>
                  </div>
                  <div className="tags-item">
                    <div className="tags-item-left">
                      {convertKm(devopsDetail.carbon_reduction_count)}吨
                    </div>
                    <div className="tags-item-right">减碳排放</div>
                  </div>
                </div>
                <div className="map">
                  {devopsDetail.geo_data.length > 0 && (
                    <ChinaMap addressListPrv={devopsDetail.geo_data} />
                  )}
                </div>
              </div>
            </div>
            <div className="data-content-top-right">
              <div className="right-first">
                <div className="title">车辆维保详情统计</div>
                <div className="right-first-content">
                  {dataDetail.assets_maintenance_list.map((item, index) => {
                    return (
                      <div className="right-first-content-list">
                        <div>
                          <img
                            src={
                              index == 0
                                ? icon5
                                : index == 1
                                ? icon6
                                : index == 2
                                ? icon7
                                : index == 3
                                ? icon8
                                : index == 4
                                ? icon9
                                : index == 5
                                ? icon10
                                : index == 6
                                ? icon11
                                : index == 7
                                ? icon12
                                : index == 8
                                ? icon13
                                : ''
                            }
                            alt=""
                          />
                        </div>
                        <div className="rigth-data">
                          <div className="rigth-data-content">
                            <div>{item.title}</div>
                            <div className="num">{item.count}</div>
                          </div>
                          <div>
                            <Progress
                              percent={item.percentage * 100}
                              strokeColor="#3FC3D0"
                              strokeLinecap="square"
                              trailColor="rgba(58,97,194,0.1)"
                              showInfo={false}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="right-second">
                <div className="title">待租赁车辆类型占比</div>
                <div className="right-second-content">
                  <div className="pie-charts">
                    {dataDetail.deliverable_assets_list_pie.length > 0 && (
                      <PieCharts
                        pieData={dataDetail.deliverable_assets_list_pie}
                      />
                    )}
                  </div>
                  <div className="right-second-content-list">
                    {dataDetail.deliverable_assets_list.map((item) => {
                      return (
                        <div className="progress-list">
                          <div
                            className="progress-title"
                            style={{
                              color:
                                item.type == '轻卡'
                                  ? '#049CF0'
                                  : item.type == 'VAN车'
                                  ? '#6CDABD'
                                  : item.type == '车厢'
                                  ? '#F7B61C'
                                  : item.type == '挂车'
                                  ? '#F77900'
                                  : '',
                            }}
                          >
                            {item.type}({item.deliverable_count}/
                            {item.heavy_count})
                          </div>
                          <div>
                            <Progress
                              percent={item.percentage * 100}
                              strokeColor={
                                item.type == '轻卡'
                                  ? '#049CF0'
                                  : item.type == 'VAN车'
                                  ? '#6CDABD'
                                  : item.type == '车厢'
                                  ? '#F7B61C'
                                  : item.type == '挂车'
                                  ? '#F77900'
                                  : ''
                              }
                              strokeLinecap="square"
                              trailColor="rgba(58,97,194,0.1)"
                              showInfo={false}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="data-content-bottom">
            <div className="bottom-first">
              <div className="title">已租车辆客户排名</div>
              <div className="parent" ref={warper}>
                <div className="bottom-first-content" ref={childDom1}>
                  {leftDetail.user_rank.map((item, index) => {
                    return (
                      <div
                        onMouseOver={() => hoverHandler(false)}
                        onMouseLeave={() => hoverHandler(true)}
                        className="bottom-first-content-list"
                      >
                        <div
                          className={
                            index == 0
                              ? 'rangkeRed1'
                              : index == 1
                              ? 'rangkeRed2'
                              : index == 2
                              ? 'rangkeRed3'
                              : 'rangkeRed'
                          }
                        >
                          NO<span>{index + 1}</span>
                        </div>
                        <div className="rangke-data">
                          <div className="uname">{item.uname}</div>
                          <div className="pro-center">
                            <Progress
                              percent={item.percentage}
                              size="small"
                              steps={isSmall ? 50 : 60}
                              strokeColor={
                                index == 0
                                  ? '#FF2424'
                                  : index == 1
                                  ? '#FF7800'
                                  : index == 2
                                  ? '#FFD800'
                                  : '#00A0FE'
                              }
                              strokeWidth={10}
                              showInfo={false}
                            />
                          </div>
                          <div>{item.assets_count}辆</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="bottom-first-content" ref={childDom2}></div>
              </div>
            </div>
            <div className="data-content-bottom-center">
              <div className="bottom-second">
                <div className="title">近7日里程增长趋势</div>
                <div className="area-charts">
                  <AreaCharts areaData={downDetail.date_mileage} />
                </div>
              </div>
              <div className="bottom-threed">
                <div className="title">近7日车辆报警趋势</div>
                <div className="area-charts">
                  <AreasCharts areasData={downDetail.date_alert} />
                </div>
              </div>
            </div>
            <div className="bottom-last">
              <div className="title">近7日车辆租赁数据</div>
              <div className="mix-charts">
                <DualAxesCharts
                  mixLineData={downDetail.date_deliverable}
                  mixColData={downDetail.date_rent}
                />
                {/* <MixCharts
                                    mixLineData={downDetail.date_deliverable}
                                    mixColData={downDetail.date_rent}
                                /> */}
              </div>
            </div>
          </div>
        </div>
        <div className="data-bottom">技术支持方@国科智运</div>
      </div>
    </div>
  );
};
export default Index;
