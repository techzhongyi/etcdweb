import React, { useEffect, useState } from 'react';
import { Card, Progress, Radio, Tooltip } from 'antd';
import './detailList.less';
import styles from '../styles.less';
import DemoPie from './DemoPie';
import { getAssetsDist } from '@/services/dashboard/dashboard';
const PropertyPie: React.FC = (props: any) => {
  const { pieData } = props;
  const [data, setData] = useState<any[]>([]);
  // const [totalCount, setTotalCount] = useState(0)
  // const [data, setData] = useState({})
  // const getDistData = async (assetsType: string) => {
  //     // const { data, data: { list, total_count } } = await getAssetsDist({
  //     //     type: assetsType
  //     // });
  //     // setData(data)
  //     // // setPieData(list)
  //     // setTotalCount(total_count)
  // }
  useEffect(() => {
    if (pieData.filter((item: any) => item.type == 5).length > 0) {
      setData(pieData.filter((item: any) => item.type == 5));
    } else {
      setData([]);
    }
  }, [pieData]);
  // const handleType = (e: any) => {
  //     setRadioType(e.target.value)
  //     getDistData(e.target.value)
  // }
  return (
    <Card
      title="车辆租赁金额类型占比"
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

export default PropertyPie;
