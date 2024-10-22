import { Empty } from 'antd';
import { Bar } from '@ant-design/plots';
import React, { useState, useEffect } from 'react';
import styles from './demoBar.less';
interface IndexProps {
  funnel?: any;
}

const DemoBar: React.FC<IndexProps> = (props) => {
  const { funnel } = props;
  const [data, setData] = useState(funnel);
  useEffect(() => {
    setData(funnel);
  }, [funnel]);
  const data1 = [
    {
      type: '家具家电',
      sales: 38,
    },
    {
      type: '粮油副食',
      sales: 52,
    },
    {
      type: '生鲜水果',
      sales: 61,
    },
    {
      type: '美容洗护',
      sales: 145,
    },
    {
      type: '母婴用品',
      sales: 48,
    },
    {
      type: '进口食品',
      sales: 38,
    },
    {
      type: '食品饮料',
      sales: 38,
    },
    {
      type: '家庭清洁',
      sales: 38,
    },
  ];
  const config = {
    data: data1,
    xField: 'sales',
    yField: 'type',
    meta: {
      type: {
        alias: '类别',
      },
      sales: {
        alias: '销售额',
      },
    },
    minBarWidth: 20,
    maxBarWidth: 20,
  };
  return (
    <>
      {data.length > 0 ? (
        <Bar {...config} />
      ) : (
        <Empty className={styles.empty} />
      )}
    </>
  );
};

export default DemoBar;
