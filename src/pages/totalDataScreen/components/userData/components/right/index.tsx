import React, { useState, useEffect, useRef } from 'react';
import './index.less';
import { Table, message } from 'antd';
import AreasCharts from '../../../lineCharts';
import UserMap from '../map/TotalMap';
import moment from 'moment';
import eventBus from '@/utils/eventBus';
import { getCustomerData } from '@/services/datascreen';
import {
  getAlertListAPI,
  getSevenDayOperateAPI,
} from '@/services/totalDataScreen';
import CountUp from 'react-countup';
import ScrollTable from '../../../scrollTable';
const Right: React.FC<any> = (props) => {
  const [isShow, setShow] = useState(0); // 表格数据
  const [data, setData] = useState(); // 表格数据
  let intervalId1 = useRef(null);
  let currentIndex = 0; // 当前高亮省份的索引
  let currentType = ['run_time_list', 'discharge_list', 'mileage_list'];
  // 报警信息字段
  const columns: any[] = [
    {
      title: '报警信息',
      key: 'type',
      align: 'center',
      width: 100,
      dataIndex: 'type',
      render: (text, record) => {
        let code = record.type;
        return ALERT_TYPE[code - 1];
      },
    },
    {
      title: '车牌号',
      key: 'assets_license',
      align: 'center',
      width: 100,
      dataIndex: 'assets_license',
      render: (text, record) => {
        return record.assets_license;
      },
    },
    {
      title: '报警时间',
      key: 'create_time',
      align: 'center',
      dataIndex: 'create_time',
      render: (_, record) =>
        moment(record.create_time * 1000).format('MM-DD HH:mm'),
    },
    {
      title: '报警状态',
      key: 'status',
      align: 'center',
      width: 80,
      dataIndex: 'status',
      render: (text, record) => {
        let code = record.status;
        return ALERT_STATUS[code - 1];
      },
    },
  ];
  // 报警信息
  const ALERT_TYPE = [
    '年检过期',
    '年检临期',
    '保险过期',
    '保险临期',
    '逾期',
    '停留超时',
    '失联',
  ];

  // 报警状态
  const ALERT_STATUS = ['告警', '恢复'];
  //定义地图数据
  const dataList = {
    front_list: [
      {
        value: 218,
        name: '北京市',
      },
      {
        value: 122,
        name: '广东省',
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
        value: 193,
        name: '其他',
      },
    ],
    other_list: [
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
    ],
  };
  //获取告警信息列表
  const getAlertList = async (userId: any) => {
    const param = {
      $tableLimit: {
        page: 1,
        count: 1000,
      },
      $tableSearch: [{ field: 'uid', value: userId, op: 0 }],
      $tableSort: [],
    };
    const {
      data: { list, total },
      status,
      msg,
    } = await getAlertListAPI(param);

    if (status == 0) {
      setData(list);
    } else {
      message.error(msg);
    }
  };
  // 地图数据设置
  const [customerDetail, setCustomerDetail] = useState({
    front_list: [],
    other_list: [],
  });
  // 最近七天的运营情况数据
  const [sevenDayOperate, setSevenDayOperate] = useState({
    discharge_list: [],
    mileage_list: [],
    run_time_list: [],
    total_discharge: 0,
    total_mileage: 0,
    total_run_time: 0,
  });
  // 最近七天的运营情况
  const getSevenDayOperate = async (userId: any) => {
    const { data, status, msg } = await getSevenDayOperateAPI({
      userId: userId,
    });
    if (status != 0) {
      message.error(msg);
      return;
    }
    setSevenDayOperate(data);
    //setAreaData(data.run_time_list);
  };

  // 地图数据获取
  const getCustomers = async (userId: any) => {
    const { data, status, msg } = await getCustomerData({ userId: userId });
    if (status != 0) {
      message.error(msg);
      return;
    }
    setCustomerDetail({
      front_list: data.front_list,
      other_list: data.other_list,
    });
  };

  // 折线图定时
  const startInterval = () => {
    intervalId1.current = setInterval(() => {
      //setAreaData([])
      // 显示当前类型数据
      setShow(currentIndex);
      let type = currentType[currentIndex];
      //   setAreaData(data[type]);
      // 绑定事件
      // let items = document.getElementsByClassName("operate-data-item-active");
      let items = document.getElementsByClassName('operate-data-item');
      if (!items) {
        return;
      }
      for (var i = 0; i < items.length; i++) {
        if (items[i].children[0].getAttribute('data-key') == type) {
          items[i].classList.add('operate-data-item-active');
        } else {
          items[i].classList.remove('operate-data-item-active');
        }
      }

      // 更新索引，实现轮播效果
      currentIndex = (currentIndex + 1) % currentType.length;
    }, 5000);
  };
  // 七天统计，根据点击切换函数
  const handleDivClick = (e) => {
    // 显示当前类型数据
    setShow(e);
    let type = currentType[e];
    let items = document.getElementsByClassName('operate-data-item');
    if (!items) {
      return;
    }
    for (var i = 0; i < items.length; i++) {
      if (items[i].children[0].getAttribute('data-key') == type) {
        items[i].classList.add('operate-data-item-active');
      } else {
        items[i].classList.remove('operate-data-item-active');
      }
    }
  };

  // 用户信息改变，更新数据
  const handleEvent = (userId: any) => {
    if (userId) {
      stopInterval();
      getCustomers(userId);
      getSevenDayOperate(userId);
      getAlertList(userId);
      // 开启定时
      startInterval();
    }
  };
  const stopInterval = () => {
    clearInterval(intervalId1.current);
  };
  useEffect(() => {
    // 告警信息列表
    //handleArea()
    eventBus.on('message', (userId) => {
      handleEvent(userId);
    });
    return () => {
      stopInterval();
      eventBus.off('message', handleEvent);
    };
  }, []);
  return (
    <div className="right-content">
      <div className="right-tp">
        <div className="title-content">
          <div className="icon"></div>
          <div>实时报警信息</div>
        </div>
        <div className="right-tp-data-content">
          <ScrollTable dataSource={data} columns={columns} rollNum={8} />
        </div>
      </div>
      <div className="right-ct">
        <div className="title-content">
          <div className="icon"></div>
          <div>近7日车辆运营统计</div>
        </div>
        <div className="right-ct-data-content">
          <div className="operate-data">
            <div
              className="operate-data-item operate-data-item-active "
              onClick={() => handleDivClick(0)}
            >
              <div className="item-number" data-key="run_time_list">
                <CountUp
                  start={0}
                  end={sevenDayOperate.total_run_time}
                  duration={2}
                  decimals={2}
                ></CountUp>
              </div>
              <div className="item-title">运营时长(H)</div>
            </div>
            <div
              className="operate-data-item"
              onClick={() => handleDivClick(1)}
            >
              <div className="item-number" data-key="discharge_list">
                <CountUp
                  start={0}
                  end={sevenDayOperate.total_discharge}
                  duration={2}
                  decimals={2}
                ></CountUp>
              </div>
              <div className="item-title">总耗电(KW)</div>
            </div>
            <div
              className="operate-data-item"
              onClick={() => handleDivClick(2)}
            >
              <div className="item-number" data-key="mileage_list">
                <CountUp
                  start={0}
                  end={sevenDayOperate.total_mileage}
                  duration={2}
                  decimals={2}
                ></CountUp>
              </div>
              <div className="item-title">行驶里程(KM)</div>
            </div>
          </div>
          <div className="areas-charts">
            {isShow == 0 && (
              <AreasCharts areasData={sevenDayOperate.run_time_list} type={0} />
            )}
            {isShow == 1 && (
              <AreasCharts
                areasData={sevenDayOperate.discharge_list}
                type={1}
              />
            )}
            {isShow == 2 && (
              <AreasCharts areasData={sevenDayOperate.mileage_list} type={2} />
            )}
          </div>
        </div>
      </div>
      <div className="right-bt">
        <div className="title-content">
          <div className="icon"></div>
          <div>车辆位置分布(辆)</div>
        </div>
        <div className="right-bt-data-content">
          {<UserMap addressListPrv={customerDetail} />}
        </div>
      </div>
    </div>
  );
};

export default Right;
