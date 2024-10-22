import { Area } from '@ant-design/plots';
import React, { useState, useEffect } from 'react';

const AreaCharts: React.FC<any> = (props) => {
  const { areaData } = props;
  const [data, setData] = useState(areaData);
  useEffect(() => {
    setData(areaData);
  }, [areaData]);
  const config = {
    autoFit: true,
    padding: [74, 30, 20, 60],
    data,
    xField: 'date',
    yField: 'mileage',
    color: ['#00D2FF'],
    xAxis: {
      range: [0, 1],
      tickCount: 7,
    },
    yAxis: {
      label: {
        formatter: (val) => {
          // 根据 val 的值来决定使用什么单位

          return `${val} 万`;
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
    line: {
      color: '#00D2FF',
    },
    meta: {
      mileage: {
        alias: '里程(万公里)',
      },
    },
  };

  return <Area {...config} />;
};

export default AreaCharts;
