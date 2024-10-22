import React, { useEffect, useState } from 'react';
import './index.less';
import Clock from './components/clock';
import Weather from './components/weather';
import User from './components/userData';
import MoniterData from './components/moniterData';
import { history } from 'umi';
import autofit from 'autofit.js';
const Index: React.FC = () => {
  const list = [
    // {
    //     id: 1,
    //     name: '监控管理'
    // },
    {
      id: 2,
      name: '运营管理',
    },
    // {
    //     id: 3,
    //     name: '车辆管理'
    // },
    {
      id: 4,
      name: '客户管理',
    },
  ];
  const [activeIndex, setActiveIndex] = useState(2);
  useEffect(() => {
    // 初始化autofit.js
    autofit.init({
      designHeight: 1080,
      designWidth: 1920,
      renderDom: '#screen-data',
      resize: true,
    });
    return () => {
      // 销毁autofit.js 否则会影响其他页面
      autofit.off();
    };
  }, []);
  return (
    <div className="screen-wrapper" id="screen-data">
      <div className="data-bg">
        <div className="data-top">
          <div className="data-top-left">
            {list.map((item: any) => {
              return (
                <div
                  style={{
                    marginRight: '15px',
                    cursor: 'pointer',
                    paddingBottom: '10px',
                  }}
                  onClick={() => {
                    if (item.id == 1) {
                      history.push({
                        pathname: '/riskControl/propertyMonitoring',
                      });
                    } else {
                      setActiveIndex(item.id);
                    }
                  }}
                  className={activeIndex == item.id ? 'activetop' : ''}
                >
                  {item.name}
                </div>
              );
            })}
          </div>
          <div className="data-top-center">沂威数据运营管理系统</div>
          <div className="data-top-right">
            <Clock />
            <Weather />
          </div>
        </div>
        <div className="data-content">
          {activeIndex == 4 && <User />}
          {activeIndex == 2 && <MoniterData />}
        </div>
        <div className="copy-right">
          技术服务支持：国科智运山东新能源技术有限公司
        </div>
      </div>
    </div>
  );
};
export default Index;
