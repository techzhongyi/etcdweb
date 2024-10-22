import { Empty } from 'antd';
import { Funnel, FUNNEL_CONVERSATION_FIELD } from '@ant-design/plots';
import React, { useState, useEffect } from 'react';
import styles from './demoFunnel.less';
interface IndexProps {
  funnel?: any;
}

const DemoFunnel: React.FC<IndexProps> = (props) => {
  const { funnel } = props;
  const [data, setData] = useState(funnel);
  useEffect(() => {
    setData(funnel);
  }, [funnel]);
  const config = {
    data: data,
    xField: 'stage',
    yField: 'number',
    dynamicHeight: true,
    legend: true,
    padding: [50, 0, 50, 0],
    label: {
      formatter: (datum: { [x: string]: number; stage: any; number: any }) => {
        return `${datum.stage}${datum.number}\n${(
          datum['$$percentage$$'] * 100
        ).toFixed(2)}%`;
      },
    },
    conversionTag: {
      formatter: (datum: Record<string, number[]>) => {
        return `转化率 ${(
          (datum[FUNNEL_CONVERSATION_FIELD][1] /
            datum[FUNNEL_CONVERSATION_FIELD][0]) *
          100
        ).toFixed(2)}%`;
      },
    }, // 关闭 conversionTag 转化率 展示
  };
  return (
    <>
      {data.length > 0 ? (
        <Funnel {...config} />
      ) : (
        <Empty className={styles.empty} />
      )}
    </>
  );
};

export default DemoFunnel;
