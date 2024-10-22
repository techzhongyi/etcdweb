import React, { useEffect, useState } from 'react';
import { Image, Spin } from 'antd';
// import { getImg } from '@/services/common/common';
// import { downloadFile } from '@/utils/export';
import { getThumbUrl } from '@/utils/common';

interface imgProps {
  src: string; //需要解码的src
  defaultSrc?: string; //默认的图
  [propName: string]: any;
}
const Index: React.FC<imgProps> = ({ src, defaultSrc, ...rest }) => {
  const [URL, setURL] = useState<any>('');
  useEffect(() => {
    let mounted = true;
    if (src) {
      getThumbUrl(src).then((res) => {
        if (mounted) {
          setURL(res);
        }
      });
    } else {
      setURL(defaultSrc || '');
    }
    return () => {
      mounted = false;
    };
  }, [src]);

  return (
    <Spin spinning={!URL}>
      <Image preview={false} {...rest} src={URL} />
    </Spin>
  );
};
export default Index;
