import { Area, Gauge } from '@ant-design/plots';
import React, { useState, useEffect } from 'react';

const AreasCharts: React.FC<any> = (props) => {
  const { areasData } = props;
  const [data, setData] = useState(areasData);
  useEffect(() => {
    setData(areasData);
  }, [areasData]);
  const config = {
    autoFit: true,
    padding: [74, 30, 20, 40],
    data,
    xField: 'date',
    yField: 'alert_count',
    color: ['#00D2FF'],
    xAxis: {
      range: [0, 1],
      tickCount: 7,
      label: {
        // 设置横坐标字体颜色
        style: {
          fill: '#32C9FF', // 这里设置为红色
        },
      },
    },
    yAxis: {
      label: {
        // 设置横坐标字体颜色
        style: {
          fill: '#32C9FF', // 这里设置为红色
        },
      },
    },
    areaStyle: () => {
      return {
        fill: 'l(270) 0:#ffffff 0.5:#00A0FE 1:#00D2FF',
      };
    },
    point: {
      size: 5,
      shape: 'circle',
      style: {
        fill: '#00D2FF',
        stroke: '#00D2FF',
        lineWidth: 2,
      },
    },
    legend: false,
    line: {
      color: '#00D2FF',
    },
    meta: {
      alert_count: {
        alias: '报警次数',
      },
    },
  };

  return <Area {...config} />;
};

export default AreasCharts;
