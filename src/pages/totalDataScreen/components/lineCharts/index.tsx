import { Area } from '@ant-design/plots';
import React, { useState, useEffect } from 'react';

const AreasCharts: React.FC<any> = (props) => {
  const { areasData, type } = props;
  const [data, setData] = useState(areasData);
  useEffect(() => {
    setData(areasData);
  }, [areasData]);

  const config = {
    autoFit: true,
    padding: [20, 10, 20, 40],
    data,
    xField: 'date',
    yField: 'value',
    color: ['#32C9FF'],
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
        fill: 'l(90) 0: rgba(50,201,255,1)  1:rgba(50,201,255,0)',
        fillOpacity: 1,
      };
    },
    smooth: { size: 1 },
    point: {
      size: 0,
      shape: 'circle',
      style: {
        fill: '#00D2FF',
        stroke: '#00D2FF',
        lineWidth: 1,
      },
    },
    legend: false,
    line: {
      color: '#32C9FF',
    },
    meta: {
      value: {
        alias: type == 1 ? '耗电' : type == 2 ? '行驶里程' : '运营时长',
      },
    },
  };

  return <Area {...config} />;
};

export default AreasCharts;
