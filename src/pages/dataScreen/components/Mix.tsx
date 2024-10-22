import { Mix } from '@ant-design/plots';
import React, { useState, useEffect } from 'react';

const MixCharts: React.FC<any> = (props) => {
  const { mixLineData, mixColData } = props;
  const [lineData, setLineData] = useState(mixLineData);
  const [colData, setColData] = useState(mixColData);
  useEffect(() => {
    setLineData(mixLineData);
    setColData(mixColData);
  }, [mixLineData, mixColData]);
  // const averageData = [
  //     {
  //         date: '2015-02',
  //         value: 50,
  //     },
  //     {
  //         date: '2015-08',
  //         value: 30,
  //     },
  //     {
  //         date: '2016-01',
  //         value: 100,
  //     },
  //     {
  //         date: '2017-02',
  //         value: 70,
  //     },
  //     {
  //         date: '2018-01',
  //         value: 20,
  //     },
  //     {
  //         date: '2018-08',
  //         value: 10,
  //     },
  // ];
  const config = {
    tooltip: {
      shared: true,
    },
    autoFit: true,
    padding: [34, 10, 10, 30],
    syncViewPadding: true,
    plots: [
      {
        type: 'column',
        options: {
          data: lineData,
          xField: 'date',
          yField: 'asset_count',
          yAxis: {
            type: 'log',
            max: 500,
            tickCount: 10,
            min: 0,
          },
          columnStyle: {
            fill: '#00A0FE',
            fillOpacity: 0.5,
          },
          meta: {
            date: {
              sync: true,
            },
            asset_count: {
              alias: '待租赁',
            },
          },
          label: {
            position: 'middle',
          },
        },
      },
      {
        type: 'line',
        options: {
          data: colData,
          xField: 'date',
          yField: 'asset_count',
          xAxis: false,
          yAxis: {
            type: 'log',
            max: 500,
            tickCount: 5,
            min: 0,
          },
          label: {
            offsetY: -8,
            style: {
              fill: '#00D2FF', // 设置字体颜色为红色
            },
          },
          meta: {
            asset_count: {
              alias: '已租赁',
            },
          },
          color: '#00D2FF',
          point: {
            size: 5,
            shape: 'circle',
            style: {
              fill: '#00D2FF',
              stroke: '#00D2FF',
              lineWidth: 2,
            },
          },
        },
      },
    ],
  };

  return <Mix {...config} />;
};

export default MixCharts;
