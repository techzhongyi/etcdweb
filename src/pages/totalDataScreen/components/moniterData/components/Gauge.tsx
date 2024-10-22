import { Gauge } from '@ant-design/plots';
import React, { useState, useEffect } from 'react';

const GaugeCharts: React.FC<any> = (props) => {
  const { gaugeData, isSmall } = props;
  const [data, setData] = useState(gaugeData);
  useEffect(() => {
    setData(gaugeData);
  }, [gaugeData]);
  const config = {
    padding: [14, 0, 0, 0],
    autoFit: true,
    percent: gaugeData,
    range: {
      ticks: [0, 0.2, 0.8, 1],
      color: ['#FF6666', '#08A2DE', '#00D2FF'],
    },
    indicator: {
      pointer: {
        style: {
          stroke: '#D0D0D0',
        },
      },
      pin: {
        style: {
          stroke: '#D0D0D0',
        },
      },
    },
    axis: {
      label: {
        formatter(v) {
          return Number(v) * 100;
        },
      },
      subTickLine: {
        count: 3,
      },
    },
    statistic: {
      title: {
        formatter: ({ percent }) => (percent * 100).toFixed(2) + '%',
        style: ({ percent }) => {
          if (percent >= 0 && percent <= 0.2) {
            return {
              fontSize: isSmall ? '20px' : '28px',
              lineHeight: 1,
              color: '#FF6666',
            };
          } else if (percent > 0.2 && percent <= 0.8) {
            return {
              fontSize: isSmall ? '20px' : '28px',
              lineHeight: 1,
              color: '#08A2DE',
            };
          } else if (percent > 0.8) {
            return {
              fontSize: isSmall ? '20px' : '28px',
              lineHeight: 1,
              color: '#00D2FF',
            };
          }
        },
      },
      content: {
        offsetY: isSmall ? 25 : 36,
        style: {
          color: '#fff',
          fontSize: isSmall ? 18 : 24,
        },
        formatter: () => '车辆在租率',
      },
    },
  };
  return <Gauge {...config} />;
};

export default GaugeCharts;
