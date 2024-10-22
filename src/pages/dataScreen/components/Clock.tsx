import moment from 'moment';
import React, { useState, useEffect } from 'react';
import './clock.less';
const Clock: React.FC<any> = (props) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const today = new Date();
  const date = today.toDateString();
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className="date-style">
      <div className="currentTime">{currentTime.toLocaleTimeString()}</div>
      <div className="date">{moment(date).format('YYYY.MM.DD')}</div>
    </div>
  );
};

export default Clock;
