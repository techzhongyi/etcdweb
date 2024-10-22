import { Empty } from 'antd';
import { Line } from '@ant-design/charts';
import React, { useState, useEffect } from 'react';
import styles from './demoFunnel.less';
interface IndexProps {
  recordData?: any;
}
const DemoLine: React.FC<IndexProps> = (props) => {
  const { recordData } = props;
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(
      recordData.map((item) => {
        return Object.assign(item, {
          type: '告警数',
        });
      }),
    );
  }, [recordData]);
  const config = {
    padding: [20, 20, 70, 40],
    data,
    xField: 'group_time',
    yField: 'count',
    seriesField: 'type',
    // interactions: [
    //   {
    //     type: 'marker-active',
    //   },
    // ],
    label: {},
    point: {
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    smooth: true,
    // lineStyle:{
    //     fill: '#5B8FF9'
    // },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'red',
        },
      },
    },
    interactions: [
      {
        type: 'marker-active',
      },
    ],
  };
  return (
    <>
      {data.length > 0 ? (
        <Line {...config} />
      ) : (
        <Empty className={styles.empty} />
      )}
    </>
  );
};

export default DemoLine;
