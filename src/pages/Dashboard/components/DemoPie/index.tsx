import { Card, Empty, Radio, Typography } from 'antd';
import { Datum, Pie } from '@ant-design/charts';
import React, { useState, useEffect } from 'react';
import numeral from 'numeral';
import { history } from 'umi';
import styles from './index.less';
import { ConsoleSqlOutlined } from '@ant-design/icons';

interface IndexProps {
  pieData?: any;
  totalCount: number;
}
const DemoPie: React.FC<IndexProps> = (props) => {
  const { pieData } = props;
  const [data, setData] = useState([]);
  // const [total, setTotal] = useState(totalCount);
  useEffect(() => {
    // setData(pieData[0]?.list.filter((item: { value: number; }) => item.value != 0));
    setData(pieData);
  }, [pieData]);

  const areaClicked = (plot: any) => {
    plot.on('plot:click', (...args: any) => {
      // const data = args[0].data?.data;
      // history.push({
      //     pathname: '/procurement/NoSourceList/list',
      //     query: {
      //         status: data?.status,
      //     },
      // });
    });
  };
  const config = {
    appendPadding: 15,
    with: 270,
    height: 250,
    data: pieData[0]?.list.filter((item) => item.value != 0),
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.8,
    label: {
      type: 'spider',
      content: '{name}\n{value}\n{percentage}',
      style: {
        textAlign: 'center',
        fontSize: 12,
      },
      normal: {
        overflow: 'none',
      },
    },
    // label: {
    //     type: 'spider',
    //     labelHeight: 28,
    //     content: '{name}\n{percentage}',
    //   },
    tooltip: {
      // formatter: (datum: Datum) => {
      //     return { name: datum.type, value: datum.value + '%' };
      // },
      customContent: (title: any, data: any) => {
        if (data?.length > 0) {
          return (
            <div style={{ padding: '12px 14px', fontSize: '14px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  minWidth: '100px',
                }}
              >
                <div style={{ marginRight: '20px' }}>
                  <i
                    style={{ backgroundColor: data[0].color }}
                    className={styles.circle}
                  />
                  {data[0].data.type}
                </div>
                <div>{data[0].data.value.toFixed(2)}</div>
              </div>
              <div
                style={{
                  marginTop: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  minWidth: '120px',
                }}
              >
                <div>
                  <i
                    style={{ backgroundColor: data[0].color }}
                    className={styles.circle}
                  />
                  占比
                </div>
                <div>
                  {((data[0].data.value / pieData[0]?.total) * 100).toFixed(2)}%
                </div>
              </div>
            </div>
          );
        }
      },
    },
    color: ['blue', 'green', 'orangered', 'plum', 'purple'],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '16px',
          color: 'gray',
        },
        content: pieData[0]?.total + '\n总金额',
      },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    legend: {
      position: 'right',
    },
  };
  return (
    <>
      {pieData[0]?.list.length > 0 ? (
        <Pie onReady={areaClicked} {...config} />
      ) : (
        <Empty className={styles.empty} />
      )}
    </>
  );
};

export default DemoPie;
