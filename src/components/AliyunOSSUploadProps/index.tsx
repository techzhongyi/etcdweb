import { getOSSConfig } from '@/services/common/common';
import type { UploadProps } from 'antd';
import { message, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import React, { useEffect, useState } from 'react';

interface OSSDataType {
  key: string;
  dir: string;
  expire: string;
  host: string;
  accessid: string;
  policy: string;
  signature: string;
  OSSAccessKeyId: string;
}

interface AliyunOSSUploadProps {
  // accept: string;
  // listType: any;
  value?: UploadFile[];
  children: any;
  onChange?: (fileList: UploadFile[]) => void;
}

const AliyunOSSUploadProp: React.FC<AliyunOSSUploadProps> = ({
  value,
  onChange,
  ...props
}: AliyunOSSUploadProps) => {
  const [OSSData, setOSSData] = useState<OSSDataType>();

  const init = async () => {
    try {
      const { data } = await getOSSConfig();
      setOSSData(data);
    } catch (error) {
      message.error(error);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const handleChange: UploadProps['onChange'] = ({ fileList }) => {
    onChange?.([...fileList]);
  };

  const onRemove = (file: UploadFile) => {
    const files = (value || []).filter((v) => v.url !== file.url);
    if (onChange) {
      onChange(files);
    }
  };

  const getExtraData: UploadProps['data'] = (file) => ({
    key: file.key,
    policy: OSSData?.policy,
    signature: OSSData?.signature,
    OSSAccessKeyId: OSSData?.accessid,
  });

  const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
    if (!OSSData) return false;
    const expire = Number(OSSData.expire) * 1000;

    if (expire < Date.now()) {
      await init();
    }
    // __GKZY__ CICD平台 方便之后解析
    file.key = OSSData.dir + '/' + Date.now() + '__GKZY__' + file.name; // 在getExtraData函数中会用到  在云存储中存储的文件的key
    file.url =
      OSSData.host + OSSData.dir + '/' + Date.now() + '__GKZY__' + file.name; // 上传完成后  用于显示内容
    // const suffix = file.name.slice(file.name.lastIndexOf('.'));
    // const filename = Date.now() + suffix;
    // @ts-ignore
    // file.url = OSSData.host + OSSData.dir + filename;

    return file;
  };

  const uploadProps: UploadProps = {
    name: 'file',
    fileList: value,
    action: OSSData?.host,
    showUploadList: props.maxCount === 1 ? false : true,
    onChange: handleChange,
    onRemove,
    data: getExtraData,
    beforeUpload,
    ...props,
  };

  return <Upload {...uploadProps}>{props.children}</Upload>;
};

export default AliyunOSSUploadProp;
