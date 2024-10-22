import { requestConfig } from '@/utils/requestConfig';
import { message } from 'antd';

let globalConstant = await fetch('/env.json', {
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
/** 所有下载 GET /export/download_file */
export async function downloadXhrFile(
  formData: any,
  onprogress: any,
  success: any,
) {
  /**
     * websocket 返回的
     * {
     *  filename: "resume-2021-11-30_16_27_826621870357.zip"
        generator: "do_preprice_userintro"
        }
     */
  const _formData = {
    file_id: formData.id,
  };
  const params = encodeURIComponent(JSON.stringify(_formData));
  const nonce = requestConfig.getNonce().toString();
  const response = requestConfig.md5_response(_formData, nonce, '').toString();
  const headers = {
    'Content-type': 'application/x-www-form-urlencoded',
    'WWW-Authenticate': 'JCUST cting.com user_name=',
    opaque: requestConfig.getToken(),
    response,
    nonce,
    uri: '/httpCore/file',
  };
  //创建xhr对象
  var xhr = new XMLHttpRequest();
  //设置xhr请求的超时时间
  // xhr.timeout = 3000;
  //设置响应返回的数据格式
  xhr.responseType = 'arraybuffer';
  //创建一个 get 请求，采用异步
  xhr.open(
    'GET',
    globalConstant.webExport + '/httpCore/file?p=' + params,
    true,
  );
  // 循环设置请求头 请求头必须在xhr.open之后设置
  for (var i in headers) {
    xhr.setRequestHeader(i, headers[i]);
  }
  //注册相关事件回调处理函数
  xhr.onload = function (e) {
    if (e.currentTarget.status === 200) {
      const file_type = xhr.getResponseHeader('Content-Type')?.split(';')[0];
      const file_name = xhr.getResponseHeader('Content-Type')?.split(';')[1];
      success(e.currentTarget, file_type, file_name);
    } else {
      message.error('下载失败 请重试');
    }
  };
  xhr.onerror = function (e) {
    message.error('下载失败 请重试');
  };
  xhr.onprogress = function (e) {
    onprogress(e);
  };
  //发送数据
  xhr.send(null);
}
