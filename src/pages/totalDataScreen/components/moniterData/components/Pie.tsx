import { Pie } from '@ant-design/plots';
import React, { useState, useEffect } from 'react';

const PieCharts: React.FC<any> = (props) => {
  const { pieData } = props;
  // useEffect(()=> {},[pieData])
  const config = {
    padding: [44, 0, 0, 0],
    autoFit: true,
    percent: true,
    data: pieData,
    angleField: 'percentage',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.4,
    label: {
      content: '{percentage}',
      type: 'inner',
      offset: '-50%',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    legend: false,
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
                  <i style={{ backgroundColor: data[0].color }} />
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
                  <i style={{ backgroundColor: data[0].color }} />
                  占比
                </div>
                <div>{(data[0].data.percentage * 100).toFixed(2)}%</div>
              </div>
            </div>
          );
        }
      },
    },
    color: (item) => {
      // 根据 item 的值来返回不同的颜色
      switch (item.type) {
        case '重卡':
          return '#3A61C2'; // 红色
        case '轻卡':
          return '#049CF0'; // 绿色
        case 'VAN车':
          return '#6CDABD'; // 绿色
        case '车厢':
          return '#F7B61C'; // 绿色
        case '挂车':
          return '#F77900'; // 蓝色
        default:
          return '#6CDABD'; // 默认颜色
      }
    },
    // color: ['#3A61C2', '#049CF0', '#6CDABD', '#F7B61C', '#F77900'],
    statistic: false,
  };
  return <Pie {...config} />;
};

export default PieCharts;
