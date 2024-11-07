import React from 'react';
import { Upload, message } from 'antd';
import { getOSSConfig } from '@/services/common/common';
import './index.less';

export default class AliyunOSSUpload extends React.Component<any, any> {
  state = {
    OSSData: {
      accessid: '',
      policy: '',
      signature: '',
      expire: '',
      dir: '',
      host: '',
    },
    loading: false,
    getUrl: '',
  };
  async componentDidMount() {
    await this.init();
  }

  // 初始化 获取OSS签名
  init = async () => {
    try {
      const { data } = await getOSSConfig({});
      this.setState({
        OSSData: {
          ...data,
        },
      });
    } catch (error) {
      message.error('');
    }
  };

  // 文件上传过程中触发的回调， 知道上传完成
  onChange = (e: any) => {
    if (this.props.maxCount === 1) {
      if (this.props.isCanvas === 1) {
        if (e.file?.url) {
          this.state.getUrl = e.file.url;
          this.props.setSrc(this.state.getUrl, e.file.status, e.fileList);
        } else {
          this.props.setSrc(this.state.getUrl, e.file.status, e.fileList);
        }
      } else {
        this.props.setSrc(e.file.url, e.file.status, e.fileList);
      }
    } else {
      this.props.setSrc(
        e.fileList.map((item: any) => item.url),
        e.file.status,
        e.fileList,
      );
    }
  };

  // 额外的上传参数
  getExtraData = (file: any) => {
    const { OSSData } = this.state;
    return {
      key: file.key,
      OSSAccessKeyId: OSSData.accessid,
      policy: OSSData.policy,
      Signature: OSSData.signature,
    };
  };

  // 选择文件之后  上传文件之前的回调
  beforeUpload = async (file: any) => {
    const { OSSData } = this.state;
    const expire = +OSSData?.expire * 1000;
    // 如果签名过期了 重新获取
    if (expire < Date.now()) {
      await this.init();
      // await this.initTest();
    }
    // __GKZY__ CICD平台 方便之后解析
    file.key = OSSData.dir + '/' + Date.now() + '__GKZY__' + file.name; // 在getExtraData函数中会用到  在云存储中存储的文件的key
    file.url =
      OSSData.host + OSSData.dir + '/' + Date.now() + '__GKZY__' + file.name; // 上传完成后  用于显示内容

    //图片是否添加水印
    if (this.props.isCanvas === 1) {
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const img = document.createElement('img');
          img.src = reader.result;
          img.onload = async () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            const fSize =
              canvas.width * 0.02 > 36
                ? 36
                : canvas.width * 0.02 < 7
                ? 7
                : canvas.width * 0.02;
            const fontSize = fSize + 'px Arial';
            ctx?.drawImage(img, 0, 0);
            ctx.fillStyle = '#000';
            ctx.shadowColor = '#ccc';
            ctx.textBaseline = 'middle';
            ctx.font = fontSize;
            ctx?.fillText(
              'CICD平台专用',
              canvas.width * 0.68,
              canvas.height * 0.88,
            );
            canvas.toBlob(resolve);
            console.log('canvas---->', file);
          };
        };
      });
    }
    return file;
  };

  render() {
    const {
      listType = 'picture',
      accept,
      onDrop,
      maxCount,
      isShowUploadList = true,
      fileList,
      disabled,
      isCanvas = 0,
    } = this.props;
    const props = {
      accept: accept || '',
      name: 'file',
      fileList: fileList,
      listType: listType, //上传的文件以哪种类型显示
      action: this.state.OSSData.host,
      onChange: this.onChange,
      data: this.getExtraData,
      beforeUpload: this.beforeUpload,
      showUploadList: isShowUploadList, //
      maxCount: maxCount,
      ondrop: onDrop,
      // onRemove: true,
      disabled: disabled,
      isCanvas: isCanvas,
    };
    return (
      <Upload {...props} className="ellipsis uploadClass">
        {this.props.children}
      </Upload>
    );
  }
}
