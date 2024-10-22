import { requestConfig } from './requestConfig';
export const Export = async (url: string, params?: any, cb?: any) => {
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
  const uri = globalConstant.webexport;
  const params_ = JSON.stringify({ ...params });
  const wxurl = uri + url + '?p=' + params_;
  const nonce = requestConfig.getNonce().toString();
  // const ws = new WebSocket(uri + url + '?token=' + requestConfig.getToken() + '&p=' + params_);
  // [opaque  response nonce] 子协议现在传三个请求头的参数
  const ws = new WebSocket(wxurl, [
    requestConfig.getToken(),
    requestConfig.md5_response(params, nonce, '').toString(),
    nonce,
  ]);
  let timer: NodeJS.Timer | null = null;
  ws.onopen = function () {
    timer = setInterval(heart, 5000);
  };
  ws.onmessage = function (evt) {
    const result = JSON.parse(evt.data);
    if (result.status === 0 || result.status === -1 || result.status === 2) {
      // 0正在连接 1 完成 -1 失败
      if (timer !== null) {
        clearInterval(timer);
      }
      if (result.status === -1 || result.status === 2) {
        cb(result);
      }
    } else {
      cb(result);
    }
  };
  ws.onclose = function (evt) {
    if (timer !== null) {
      clearInterval(timer);
    }
  };
  ws.onerror = function (evt) {
    if (timer !== null) {
      clearInterval(timer);
    }
  };

  ws.addEventListener('close', function (event) {
    const code = event.code;
    const reason = event.reason;
    const wasClean = event.wasClean;
  });
  const heart = function () {
    ws.send('1');
  };
};

export const downloadFile = (blob: any, name: any) => {
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, name);
    return;
  }
  const WURL = window.URL || window.webkitURL;
  // 转为url:"blob:null/4b27d1aa-d7dc-4c91-a6f8-60f0a1b26134"
  const bloburl = WURL.createObjectURL(blob);
  const anchor = document.createElement('a');
  if ('download' in anchor) {
    anchor.style.visibility = 'hidden';
    anchor.href = bloburl;
    anchor.download = name;
    document.body.appendChild(anchor);
    const evt = document.createEvent('MouseEvents');
    evt.initEvent('click', true, true);
    anchor.dispatchEvent(evt);
    document.body.removeChild(anchor);
    //  释放对象
    WURL.revokeObjectURL(bloburl);
  } else {
    location.href = bloburl;
  }
};
