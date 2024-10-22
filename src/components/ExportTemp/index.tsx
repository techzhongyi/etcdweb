import React, { useState } from 'react';
import { Button, message, Progress } from 'antd';
import { downloadXhrFile } from '@/services/common/downloadFile';
import { Export, downloadFile } from '@/utils/export';

const ExportTemp: React.FC<any> = (prop) => {
  const { url, searchObj } = prop;
  const [dataLoading, setDataLoading] = useState(false);
  const [dataInfoLine, setDataInfoLine] = useState(0);

  // 批量导出模版
  const exportData = () => {
    setDataLoading(true);
    Export(url, searchObj, async (res_: any) => {
      if (res_.Progress === 1) {
        console.log(res_);
        const params = {
          id: res_.Msg,
        };
        downloadXhrFile(
          params,
          ({ loaded, total }: any) => {
            const percent = Math.round((loaded / total) * 100);
            setDataInfoLine(percent);
          },
          (res: any, type: any, name: any) => {
            if (res.status === 200) {
              const blob = new Blob([res.response], { type });
              downloadFile(blob, name);
              setDataInfoLine(0);
            }
            setDataLoading(false);
          },
        );
      } else {
        message.error(res_.Msg);
        setDataLoading(false);
      }
    });
  };

  return (
    <>
      <Button
        disabled={dataLoading}
        onClick={() => {
          exportData();
        }}
      >
        {dataLoading && (
          <Progress
            style={{ marginRight: '10px' }}
            strokeColor="#F0841A"
            trailColor="#fff"
            type="circle"
            percent={dataInfoLine}
            width={24}
          />
        )}
        {dataLoading ? '导出中' : '导出'}
      </Button>
    </>
  );
};

export default ExportTemp;
