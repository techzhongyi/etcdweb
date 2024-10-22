import { Rose } from '@ant-design/plots';
import React, { useState, useEffect } from 'react';

const RoseCharts: React.FC<any> = (props) => {
  const { roseData } = props;
  const [data, setData] = useState(roseData);
  useEffect(() => {
    setData(roseData);
  }, [roseData]);
  const config = {
    padding: [54, 0, 0, 0],
    autoFit: true,
    radius: 1,
    innerRadius: 0.2,
    data,
    xField: 'name',
    yField: 'value',
    seriesField: 'name',
    color: ['#3A61C2', '#049CF0', '#6CDABD', '#F7B61C', '#F77900'],
    transform: [{ type: 'groupX', y: 'sum' }],
    scale: {
      y: { type: 'sqrt' },
      x: { padding: 0 },
    },
    axis: false,
    legend: false,
    label: {
      // 标签配置
      style: {
        fill: '#fff', // 修改字体颜色为红色
        fontSize: 14, // 可以设置字体大小
        // 其他样式配置...
      },
    },
    labels: [
      {
        text: 'people',
        position: 'outside',
        formatter: '~s',
        transform: [{ type: 'overlapDodgeY' }],
      },
    ],
    tooltip: { items: [{ channel: 'y', valueFormatter: '~s' }] },
  };
  return <Rose {...config} />;
};

export default RoseCharts;
