import React, { useEffect, useState } from 'react';
import { Card, Progress, Radio, Tooltip } from 'antd';
import './detailList.less';
import styles from '../styles.less';
import DemoPie from './DemoPie';
import { getAssetsDist } from '@/services/dashboard/dashboard';
const PropertyPie2: React.FC = (props: any) => {
  const { pieData } = props;
  const [data, setData] = useState(pieData);
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    if (pieData.filter((item: any) => item.type == 6).length > 0) {
      setData(pieData.filter((item: any) => item.type == 6));
    } else {
      setData([]);
    }
  }, [pieData]);

  return (
    <Card
      title="车辆租赁类型金额逾期占比"
      bordered={false}
      style={{ height: '440px' }}
      // extra={
      //     <div className={styles.salesExtraWrap}>
      //         <Radio.Group value={radioType} onChange={handleType}>
      //             <Radio.Button value="vm">周</Radio.Button>
      //             <Radio.Button value="cable">月</Radio.Button>
      //             <Radio.Button value="software">全年</Radio.Button>
      //         </Radio.Group>
      //     </div>
      // }
    >
      <div className={styles.salesCard}>
        <DemoPie pieData={data} />
      </div>
    </Card>
  );
};

export default PropertyPie2;
