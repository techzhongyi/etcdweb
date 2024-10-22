import React from 'react';
import { message, Progress, Upload } from 'antd';
import { requestConfig } from '@/utils/requestConfig';

const globalConstant = await fetch('/env.json', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
  .then((response) => response.json()) //解析为Promise
  .then((data) => {
    return data;
  });
const url = globalConstant.webExport + '/httpCore/file';
export default class UploadImg extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    const nonce = requestConfig.getNonce().toString();
    this.state = {
      fileList: [],
      fname: '',
      upLoadStatus: '',
      percent: 0,
      newBlobStr: '',
      headers: {
        'WWW-Authenticate': 'JCUST cting.com user_name=',
        // 'Content-Type': 'multipart/form-data',
        opaque: requestConfig.getToken(),
        response: requestConfig
          .md5_response({ file_name: '' }, nonce, '')
          .toString(),
        nonce,
        uri: '/httpCore/file',
      },
    };
  }
  onChange = (e: any) => {
    if (this.props.accept) {
      const dataLength = this.props.accept.split(',').length;
      if (dataLength == 1) {
        if (!e.file.name.endsWith(this.props.accept)) {
          message.error(
            '文件格式不正确, 请上传正确的' + this.props.accept + '文件',
          );
          return;
        }
      } else {
        if (
          !e.file.name.endsWith(this.props.accept.split(',')[0]) &&
          !e.file.name.endsWith(this.props.accept.split(',')[1])
        ) {
          message.error(
            '文件格式不正确, 请上传正确的' +
              this.props.accept.split(',')[0] +
              '或' +
              this.props.accept.split(',')[1] +
              '文件',
          );
          return;
        }
      }
    }
    const nonce = requestConfig.getNonce().toString();
    const val: any = e?.event?.percent || 0;
    this.setState({
      fileList: e.fileList,
      upLoadStatus: e.file.status,
      percent: parseInt(val) >= 99 ? 99 : parseInt(val),
      headers: {
        'WWW-Authenticate': 'JCUST cting.com user_name=',
        opaque: requestConfig.getToken(),
        response: requestConfig
          .md5_response({ file_name: e.file.name }, nonce, '')
          .toString(),
        nonce,
        uri: '/httpCore/file',
      },
    });
    if (e.file.status === 'done') {
      // 服务器上传成功
      if (e.file.response.status === 0) {
        // 上传成功的url,上传的码值,当前上传的file对象
        this.setState({
          percent: 100,
        });
        this.props.setSrc(
          e.file.response.data.file_id,
          e.file.response.status,
          this.state.newBlobStr,
        );
      }

      // this.state.getUrl = e.file.url;
      // this.props.setSrc(this.state.getUrl, e.file.status, e.fileList);
      // } else {
      //   this.props.setSrc(this.state.getUrl, e.file.status, e.fileList);
      // }
    }
    // if (this.props.maxCount === 1) {
    //   if (this.props.isCanvas === 1) {
    //     if (e.file?.url) {
    //       this.state.getUrl = e.file.url;
    //       this.props.setSrc(this.state.getUrl, e.file.status, e.fileList);
    //     } else {
    //       this.props.setSrc(this.state.getUrl, e.file.status, e.fileList);
    //     }
    //   } else {
    //     this.props.setSrc(e.file.url, e.file.status, e.fileList);
    //   }
    // } else {
    //   this.props.setSrc(
    //     e.fileList.map((item: any) => item.url),
    //     e.file.status,
    //     e.fileList,
    //   );
    // }
  };
  // 接口请求完成回调
  // uploadcomplete = (uri: any, status: any) => {
  //   this.props.setSrc(uri, status);
  // }

  // 选择文件之后  上传文件之前的回调
  beforeUpload = async (file: any) => {
    this.setState({
      fname: file.name,
    });
    // 限制上传10M以内
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('上传文件过大！(文件大小小于10M)');
      return;
    }
    // file.url =  file.name; // 上传完成后  用于显示内容
    file.total_size = file.size;
    //图片是否添加水印
    if (this.props.isCanvas === 1) {
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const img: any = document.createElement('img');
          img.src = reader.result;
          img.onload = async () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx: any = canvas.getContext('2d');
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
              '国科智运专用',
              canvas.width * 0.68,
              canvas.height * 0.88,
            );
            canvas.toBlob((blob) => {
              this.setState({
                newBlobStr: blob,
              });
              resolve(blob);
            });
          };
        };
      });
    }
    return file;
  };
  // 额外的上传参数
  getExtraData = (file: any) => {
    return file.file;
  };

  render() {
    const {
      listType = 'picture',
      accept,
      onDrop,
      maxCount,
      isShowUploadList = true,
      disabled,
      isCanvas = 0,
    } = this.props;
    const rest = {
      accept: accept || '',
      name: 'file',
      fileList: this.state.fileList,
      listType: listType, //上传的文件以哪种类型显示
      action: url + '?p=' + JSON.stringify({ file_name: this.state.fname }),
      onChange: this.onChange,
      data: this.getExtraData,
      beforeUpload: this.beforeUpload,
      showUploadList: isShowUploadList,
      maxCount: maxCount,
      ondrop: onDrop,
      onRemove: true,
      disabled: disabled,
      isCanvas: isCanvas,
      method: 'post',
      headers: this.state.headers,
      // onPreview(file){
      //   console.log('Your upload file:', file);
      //   // Your process logic. Here we just mock to the same file
      //   // return fetch('https://next.json-generator.com/api/json/get/4ytyBoLK8', {
      //   //   method: 'POST',
      //   //   body: file,
      //   // })
      //   //   .then((res) => res.json())
      //   //   .then(({ thumbnail }) => thumbnail);
      // },
    };
    return (
      <Upload {...rest} className="ellipsis uploadClass">
        {this.state.upLoadStatus === 'uploading' ? (
          <Progress
            width={40}
            type="circle"
            percent={this.state.percent}
            strokeColor="#5578F9"
          />
        ) : (
          this.props.children
        )}
      </Upload>
    );
  }
}
