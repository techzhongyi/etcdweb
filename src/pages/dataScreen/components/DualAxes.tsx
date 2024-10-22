import { DualAxes, Mix } from '@ant-design/plots';
import React, { useState, useEffect } from 'react';

const DualAxesCharts: React.FC<any> = (props) => {
  const { mixLineData, mixColData } = props;
  const [lineData, setLineData] = useState(mixLineData);
  const [colData, setColData] = useState(mixColData);
  useEffect(() => {
    setLineData(mixLineData);
    setColData(
      mixColData.map((item) => {
        return Object.assign(item, {
          count: item.asset_count,
        });
      }),
    );
  }, [mixLineData, mixColData]);

  const config = {
    padding: [44, 20, 10, 30],
    autoFit: true,
    data: [lineData, colData],
    xField: 'date',
    yField: ['asset_count', 'count'],
    legend: false,
    meta: {
      asset_count: {
        alias: '待租赁',
      },
      count: {
        alias: '已租赁',
      },
    },

    geometryOptions: [
      {
        geometry: 'column',
        label: {
          visible: true, // 开启数据标签
          position: 'middle', // 数据标签位置
          content: ({ asset_count }) => `${asset_count}`, // 自定义内容，这里直接显示值
          // offset: 10, // 数据标签偏移量
          // color: 'red'
        },
        color: 'rgba(0,160,254, 0.5)',
      },
      {
        geometry: 'line',
        shape: 'circle',
        label: {
          visible: true, // 开启数据标签
          position: 'top', // 数据标签位置，可以是 'top', 'bottom', 'start', 'end', 'center' 等
          content: ({ count }) => `${count}`, // 自定义内容，这里直接显示值
          // offset: -10, // 数据标签偏移量
          color: '#00D2FF',
        },
        lineStyle: {
          stroke: '#00D2FF',
          lineWidth: 2,
        },
      },
    ],
  };

  return <DualAxes {...config} />;
};

export default DualAxesCharts;
