import moment from 'moment';
import React, { useState, useEffect } from 'react';
import time0 from '../../../../../public/icons/dataImage2/time0.png';
import time1 from '../../../../../public/icons/dataImage2/time1.png';
import time2 from '../../../../../public/icons/dataImage2/time2.png';
import time3 from '../../../../../public/icons/dataImage2/time3.png';
import time4 from '../../../../../public/icons/dataImage2/time4.png';
import time5 from '../../../../../public/icons/dataImage2/time5.png';
import time6 from '../../../../../public/icons/dataImage2/time6.png';
import time7 from '../../../../../public/icons/dataImage2/time7.png';
import time8 from '../../../../../public/icons/dataImage2/time8.png';
import time9 from '../../../../../public/icons/dataImage2/time9.png';
import timepoint from '../../../../../public/icons/dataImage2/timepoint.png';
import './index.less';
const Clock: React.FC<any> = (props) => {
  const images = [
    time0,
    time1,
    time2,
    time3,
    time4,
    time5,
    time6,
    time7,
    time8,
    time9,
  ];

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVisibel, setIsVisibel] = useState(false);
  const days = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ];
  const today = new Date();
  const date = today.toDateString();
  const dayOfWeek = days[today.getDay()];
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    const intervalId = setInterval(() => {
      const visibel = !isVisibel;
      setIsVisibel(visibel);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isVisibel]);
  return (
    <div className="date-style">
      <div className="time-clock">
        {/* <div className='currentTime'>
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div> */}
        <div className="Clock-hours">
          {(currentTime.getHours() < 10
            ? '0' + currentTime.getHours()
            : currentTime.getHours()
          )
            .toString()
            .split('')
            .map((item) => {
              return <img src={images[item]} alt="" />;
            })}
        </div>
        <div style={{ width: '16px' }}>
          <img
            style={{ display: isVisibel ? 'block' : 'none' }}
            src={timepoint}
            alt=""
          />
        </div>
        <div className="Clock-minutes">
          {(currentTime.getMinutes() < 10
            ? '0' + currentTime.getMinutes()
            : currentTime.getMinutes()
          )
            .toString()
            .split('')
            .map((item) => {
              return <img src={images[item]} alt="" />;
            })}
        </div>
        {/* <div>
                    <img src={timepoint} alt="" />
                </div>
                <div className="Clock-minutes">
                {
                        currentTime.getSeconds().toString().split('').map(item => {
                            return (
                                <img src={images[item]} alt="" />
                            )
                        })
                    }
                </div> */}
      </div>
      <div className="week">
        <div>{dayOfWeek}</div>
        <div className="date">{moment(date).format('YYYY/MM/DD')}</div>
      </div>
    </div>
  );
};

export default Clock;
