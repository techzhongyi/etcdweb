import { Radar } from '@ant-design/plots';
import React, { useState, useEffect } from 'react';

const RadarCharts: React.FC<any> = (props) => {
  const { data } = props;
  const [radarData, setRadarData] = useState([]);
  useEffect(() => {
    setRadarData(data);
  }, [data]);
  const config = {
    padding: [40, 20, 20, 20],
    autoFit: true,
    data: radarData,
    xField: 'name',
    yField: 'value',
    meta: {
      value: {
        alias: '次数',
        min: 0,
        // max: 80,
      },
    },
    legend: false,
    radiusAxis: {
      grid: {
        line: {
          type: 'line',
        },
      },
      label: null, // 去除刻度数据
    },
    axis: {
      label: null, // 或者 false
    },
    xAxis: {
      line: false,
      tickLine: false,
      label: {
        style: {
          fill: '#5BABF8',
        },
      },
      grid: {
        line: {
          style: {
            lineDash: false,
            opacity: 0, // 设置刻度不可见
          },
        },
      },
    },
    radar: false,
    yAxis: {
      line: null,
      tickLine: null,
      label: false,
      grid: {
        line: {
          type: 'line',
          style: {
            lineDash: null,
          },
        },
      },
    },
    area: {
      style: {
        fill: 'rgba(92,255,235,0.40)', // 这里设置区域填充的颜色
        fillOpacity: 1, // 填充的不透明度
      },
    },
    // 开启辅助点
    point: false,
  };
  return <Radar {...config} />;
};

export default RadarCharts;
