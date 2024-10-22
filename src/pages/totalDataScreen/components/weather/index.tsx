import React, { useState, useEffect } from 'react';
import './index.less';
import qing from '../../../../../public/icons/weather/qing.png';
import duoyun from '../../../../../public/icons/weather/duoyun.png';
import shaoyun from '../../../../../public/icons/weather/shaoyun.png';
import xiaoyu from '../../../../../public/icons/weather/xiaoyu.png';
import zhongyu from '../../../../../public/icons/weather/zhongyu.png';
import dayu from '../../../../../public/icons/weather/dayu.png';
import leizhenyu from '../../../../../public/icons/weather/leizhenyu.png';
import youfeng from '../../../../../public/icons/weather/youfeng.png';
import yin from '../../../../../public/icons/weather/yin.png';
import xue from '../../../../../public/icons/weather/xue.png';
import yu from '../../../../../public/icons/weather/yu.png';
const Weather: React.FC<any> = (props) => {
  const [weatherData, setWeatherData] = useState({
    weather: '',
    windpower: '',
    temperature: '',
  });
  const init = async () => {
    const data = await fetch(
      'https://restapi.amap.com/v3/weather/weatherInfo?key=572cf12a344f81326917997a26cbc55d&city=371300&extensions=base',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
    setWeatherData(data.lives[0]);
  };
  useEffect(() => {
    // 设置一个定时器，每60秒（60000毫秒）执行一次
    const intervalId = setInterval(() => {
      init();
    }, 60000);
    // 清除定时器的函数，用于在组件卸载时停止定时器
    const cleanup = () => clearInterval(intervalId);
    // 组件挂载后执行一次接口请求
    init();
    // 返回清除函数，以便在组件卸载时清除定时器
    return cleanup;
  }, []);
  return (
    <div className="weather-style">
      <div className="weather-img">
        <img
          src={
            weatherData.weather == '晴'
              ? qing
              : weatherData.weather == '少云'
              ? shaoyun
              : weatherData.weather == '多云'
              ? duoyun
              : weatherData.weather == '阴'
              ? yin
              : weatherData.weather == '有风'
              ? youfeng
              : weatherData.weather == '雨'
              ? yu
              : weatherData.weather == '小雨'
              ? xiaoyu
              : weatherData.weather == '中雨'
              ? zhongyu
              : weatherData.weather == '大雨'
              ? dayu
              : weatherData.weather == '雷阵雨'
              ? leizhenyu
              : weatherData.weather == '雪'
              ? xue
              : yin
          }
          alt=""
        />
      </div>
      <div className="temperature">{weatherData.temperature}°C</div>
      <div className="weather">{weatherData.weather}</div>
    </div>
  );
};

export default Weather;
