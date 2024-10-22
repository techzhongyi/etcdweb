import { Empty } from 'antd';
import { Column } from '@ant-design/charts';
import React, { useState, useEffect } from 'react';
import styles from './demoFunnel.less';
interface IndexProps {
  listData?: any;
}

const PropertyColumn: React.FC<IndexProps> = (props) => {
  const { listData } = props;
  const [data, setData] = useState(listData);
  useEffect(() => {
    setData(listData);
  }, [listData]);
  const config = {
    data,
    xField: 'day',
    yField: 'value',
    isGroup: true,
    isStack: true,
    seriesField: 'name',
    groupField: 'name',
    xAxis: {
      label: {
        autoHide: false,
        autoRotate: true,
      },
    },
    color: ['#6491f2', '#eebe45', '#7dd4a9', 'plum'],
    tooltip: {
      formatter: (datum) => ({
        name: `${datum.name}`,
        value: datum.value,
      }),
    },
  };
  return (
    <>
      {data?.length > 0 ? (
        <Column {...config} />
      ) : (
        <Empty className={styles.empty} />
      )}
    </>
  );
};

export default PropertyColumn;
