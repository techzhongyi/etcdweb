import { Empty } from 'antd';
import { Column } from '@ant-design/charts';
import React, { useState, useEffect } from 'react';
import styles from './demoFunnel.less';
interface IndexProps {
  columnData?: any;
}
const DemoColumn: React.FC<IndexProps> = (props) => {
  const { columnData } = props;
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(
      columnData.map((item) => {
        return Object.assign(item, {
          type: '告警数',
        });
      }),
    );
  }, [columnData]);
  const config = {
    data,
    xField: 'group_time',
    yField: 'count',
    seriesField: 'type',
    interactions: [
      {
        type: 'marker-active',
      },
    ],
    minColumnWidth: 30,
    maxColumnWidth: 30,
    label: {
      padding: [20, 40, 50, 40],
      // 可手动配置 label 数据标签位置
      position: 'middle',
      // 'top', 'bottom', 'middle',
      // 配置样式
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: '类别',
      },
      sales: {
        alias: '销售额',
      },
    },
  };
  return (
    <>
      {data.length > 0 ? (
        <Column {...config} />
      ) : (
        <Empty className={styles.empty} />
      )}
    </>
  );
};

export default DemoColumn;
