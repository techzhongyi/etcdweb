import { Empty } from 'antd';
import { Line } from '@ant-design/charts';
import React, { useState, useEffect } from 'react';
import styles from './demoFunnel.less';
interface IndexProps {
  lineData?: any;
}
const data1 = [
  {
    name: '待处理',
    date: '07/01',
    value: 1211,
  },
  {
    name: '待处理',
    date: '07/02',
    value: 1339,
  },
  {
    name: '待处理',
    date: '07/03',
    value: 1470,
  },
  {
    name: '待处理',
    date: '07/04',
    value: 1660,
  },
  {
    name: '待处理',
    date: '07/05',
    value: 1955,
  },
  {
    name: '待处理',
    date: '07/06',
    value: 2285,
  },
  {
    name: '待处理',
    date: '07/07',
    value: 2752,
  },
  {
    name: '待处理',
    date: '07/08',
    value: 3550,
  },
  {
    name: '待处理',
    date: '07/09',
    value: 4594,
  },
  {
    name: '待处理',
    date: '07/10',
    value: 5101,
  },
  {
    name: '待处理',
    date: '07/11',
    value: 6087,
  },
  {
    name: '待处理',
    date: '07/12',
    value: 7551,
  },
  {
    name: '待处理',
    date: '07/13',
    value: 8532,
  },
  {
    name: '待处理',
    date: '07/14',
    value: 9570,
  },
  {
    name: '待处理',
    date: '07/15',
    value: 1043,
  },
  {
    name: '待处理',
    date: '07/16',
    value: 1101,
  },
  {
    name: '待处理',
    date: '07/17',
    value: 1113,
  },
  {
    name: '待处理',
    date: '07/18',
    value: 1214,
  },
  {
    name: '待处理',
    date: '07/19',
    value: 1360,
  },
  {
    name: '已处理',
    date: '07/01',
    value: 1025,
  },
  {
    name: '已处理',
    date: '07/02',
    value: 1058,
  },
  {
    name: '已处理',
    date: '07/03',
    value: 1093,
  },
  {
    name: '已处理',
    date: '07/04',
    value: 1145,
  },
  {
    name: '已处理',
    date: '07/05',
    value: 1221,
  },
  {
    name: '已处理',
    date: '07/06',
    value: 1303,
  },
  {
    name: '已处理',
    date: '07/07',
    value: 1381,
  },
  {
    name: '已处理',
    date: '07/08',
    value: 1445,
  },
  {
    name: '已处理',
    date: '07/09',
    value: 1471,
  },
  {
    name: '已处理',
    date: '07/10',
    value: 1444,
  },
  {
    name: '已处理',
    date: '07/11',
    value: 1499,
  },
  {
    name: '已处理',
    date: '07/12',
    value: 1554,
  },
  {
    name: '已处理',
    date: '07/13',
    value: 1619,
  },
  {
    name: '已处理',
    date: '07/14',
    value: 1678,
  },
  {
    name: '已处理',
    date: '07/15',
    value: 1752,
  },
  {
    name: '已处理',
    date: '07/16',
    value: 1821,
  },
  {
    name: '已处理',
    date: '07/17',
    value: 1870,
  },
  {
    name: '已处理',
    date: '07/18',
    value: 1948,
  },
  {
    name: '已处理',
    date: '07/19',
    value: 2054,
  },
];
const PropertyLine: React.FC<IndexProps> = (props) => {
  const { lineData } = props;
  const [data, setData] = useState(lineData);
  useEffect(() => {
    setData(data1);
  }, [lineData]);
  const config = {
    data,
    padding: [30, 30, 70, 30],
    xField: 'date',
    yField: 'value',
    seriesField: 'name',
    xAxis: {
      tickCount: 5,
    },
    slider: {
      start: 0,
      end: 1,
    },
  };
  return (
    <>
      {data?.length > 0 ? (
        <Line {...config} />
      ) : (
        <Empty className={styles.empty} />
      )}
    </>
  );
};

export default PropertyLine;
