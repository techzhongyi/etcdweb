import React, { useState, useEffect, useRef } from 'react';
import './index.less';
import { Progress, message } from 'antd';
import RadarCharts from '../../../radarCharts';
import { DownOutlined } from '@ant-design/icons';
import { getCustomerList } from '@/services/custom/customer';
import {
  getAssetsMaintenanceAPI,
  getMileageRankListAPI,
} from '@/services/totalDataScreen';
import eventBus from '@/utils/eventBus';
const Left: React.FC<any> = (props) => {
  // 滚动速度，值越小，滚动越快
  const speed = 50;
  const ctDataWarper = useRef();
  const ctDataDom1 = useRef();
  const ctDataDom2 = useRef();
  const [isScrolle, setIsScrolle] = useState(true);
  const [userList, setUserList] = useState([]);
  const [rankList, setRankList] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [defaultUser, setDefaultUser] = useState<any>({});
  const [userId, setuserId] = useState('');
  const [data, setData] = useState({
    assets_maintenance4day: [],
    rate: {
      charge_rate: 0,
      devops_rate: 0,
      late_rate: 0,
    },
  });
  //获取用户列表
  const getList = async () => {
    const param = {
      generation_order_user: 1,
      $tableLimit: {
        page: 1,
        count: 1000,
      },
      $tableSearch: [],
      $tableSort: [],
    };
    const {
      data: { list },
      status,
      msg,
    } = await getCustomerList(param);
    if (status == 0) {
      setUserList(list);
      setDefaultUser(list[0]);
      setuserId(list[0].id);
    } else {
      message.error(msg);
    }
  };
  // 选择客户 触发
  const selectUser = (item: any) => {
    setDefaultUser(item);
    setuserId(item.id);
    setIsVisible(false);
  };
  useEffect(() => {
    getList();
  }, []);
  const getUserData = async () => {
    const { data, status, msg } = await getAssetsMaintenanceAPI({
      user_id: userId,
    });
    if (status === 0) {
      setData(data);
    } else {
      message.error(msg);
    }
  };
  const getMileageRankData = async () => {
    const {
      data: { list },
      status,
      msg,
    } = await getMileageRankListAPI({ userId: userId });
    if (status === 0) {
      setRankList(list);
    } else {
      message.error(msg);
    }
  };
  useEffect(() => {
    if (userId) {
      getUserData();
      getMileageRankData();
      eventBus.emit('message', userId);
    }
  }, [userId]);
  // 鼠标时间
  const hoverHandler = (flag: boolean) => setIsScrolle(flag);
  // 开始滚动
  // useEffect(() => {
  //     let timer: NodeJS.Timer;
  //     if (rankList.length < 6) {
  //         return
  //     }
  //     // 多拷贝一层，让它无缝滚动
  //     // ctDataDom2.current.innerHTML = ctDataDom1?.current?.innerHTML;
  //     if (isScrolle) {
  //         timer = setInterval(
  //             () =>
  //                 ctDataWarper.current.scrollTop >= ctDataDom1.current.scrollHeight
  //                     ? (ctDataWarper.current.scrollTop = 0)
  //                     : ctDataWarper.current.scrollTop++,
  //             speed
  //         );
  //     }
  //     return () => {
  //         clearTimeout(timer);
  //     };
  // }, [isScrolle, rankList]);
  const listRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isScrolle) {
        if (listRef.current) {
          listRef.current.scrollTop += 1;
          if (
            listRef.current.scrollHeight ===
            listRef.current.scrollTop + listRef.current.offsetHeight
          ) {
            listRef.current.scrollTop = 0;
          }
        }
      }
    }, 30); // 可以调整时间间隔来改变滚动速度
    return () => clearInterval(intervalId);
  }, [isScrolle]); // 空依赖数组确保间隔ID只设置一次

  return (
    <div className="left-content">
      <div className="tp">
        <div className="title-content">
          <div className="icon"></div>
          <div>客户租赁综合统计</div>
        </div>
        <div className="tp-data-content">
          <div
            className="select-style"
            onMouseOver={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
          >
            <div className="select-border">
              <div>请选择客户</div>
              <div>
                <DownOutlined />
              </div>
            </div>
            {isVisible && (
              <div className="select-user-list">
                {userList.map((item: any) => {
                  return (
                    <div
                      className="left-user-name"
                      onClick={() => {
                        selectUser(item);
                      }}
                    >
                      <div className="left-user-name-icon">
                        {item.name.substring(0, 4)}
                      </div>
                      <div className="left-user-name-info">
                        <div>{item.contact}</div>
                        <div>{item.name}</div>
                        <div>{item.phone}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="left-user-name">
            <div className="left-user-name-icon">
              {defaultUser?.name?.substring(0, 4)}
            </div>
            <div className="left-user-name-info">
              <div>{defaultUser?.contact}</div>
              <div>{defaultUser?.name}</div>
              <div>{defaultUser?.phone}</div>
            </div>
          </div>
          <div className="left-user-progress">
            <div className="first-progress">
              <Progress
                style={{ color: '#fff' }}
                type="circle"
                strokeColor={
                  data.rate.devops_rate >= 0.75
                    ? '#00D5B0'
                    : data.rate.devops_rate >= 0.5
                    ? '#8BB1FF'
                    : '#FD4E22'
                }
                trailColor="#03205D"
                format={(percent) => `${percent}%`}
                success={{ strokeColor: '#00D5B0' }}
                strokeWidth={3}
                percent={(data.rate.devops_rate * 100).toFixed(2)}
                width={87}
              />
              <div className="progress-title">运营率</div>
            </div>
            <div className="second-progress">
              <Progress
                type="circle"
                strokeColor={
                  data.rate.devops_rate >= 0.75
                    ? '#00D5B0'
                    : data.rate.devops_rate >= 0.5
                    ? '#8BB1FF'
                    : '#FD4E22'
                }
                trailColor="#03205D"
                format={(percent) => `${percent}%`}
                success={{ strokeColor: '#00D5B0' }}
                strokeWidth={3}
                percent={(data.rate.charge_rate * 100).toFixed(2)}
                width={87}
              />
              <div className="progress-title">补能率</div>
            </div>
            <div className="third-progress">
              <Progress
                type="circle"
                strokeColor={
                  data.rate.devops_rate >= 0.75
                    ? '#00D5B0'
                    : data.rate.devops_rate >= 0.5
                    ? '#8BB1FF'
                    : '#FD4E22'
                }
                trailColor="#03205D"
                format={(percent) => `${percent}%`}
                success={{ strokeColor: '#00D5B0' }}
                strokeWidth={3}
                percent={(data.rate.late_rate * 100).toFixed(2)}
                width={87}
              />
              <div className="progress-title">履约率</div>
            </div>
          </div>
        </div>
      </div>
      <div className="ct">
        <div className="title-content">
          <div className="icon"></div>
          <div>车辆行驶里程排行(KM)</div>
        </div>

        <div className="ct-data-content" ref={listRef}>
          {rankList.map((item, index) => {
            return (
              <div
                className="ct-data-list"
                onMouseOver={() => hoverHandler(false)}
                onMouseLeave={() => hoverHandler(true)}
              >
                <div className="left">
                  <div className="rank">{index + 1}</div>
                  <div>{item.name}</div>
                </div>
                <div className="right">{item.value}</div>
              </div>
            );
          })}
        </div>
        {/* <div className='ct-data-content' ref={ctDataDom2}></div> */}
      </div>
      <div className="bt">
        <div className="title-content">
          <div className="icon"></div>
          <div>维保数据统计</div>
        </div>
        <div className="bt-data-content">
          <RadarCharts data={data.assets_maintenance4day} />
        </div>
      </div>
    </div>
  );
};

export default Left;
