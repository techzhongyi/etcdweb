import { requestConfig } from './requestConfig';
import io from 'socket.io-client';
export const webSocket = async (
  url: string,
  params?: any,
  behavior?: any,
  binaryType?: any,
) => {
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
  const uri = globalConstant.webShh;
  const params_ = JSON.stringify(params);
  let wxurl = '';
  if(behavior){
     wxurl = uri + url + '?p=' + encodeURIComponent(params_) + '&b=' + behavior;
  }else{
    wxurl = uri + url + '?p=' + encodeURIComponent(params_)
  }
  const nonce = requestConfig.getNonce().toString();

  // [opaque  response nonce] 子协议现在传三个请求头的参数
  const ws = new WebSocket(wxurl, [
    requestConfig.getToken(),
    requestConfig.md5_response(params, nonce, '').toString(),
    nonce,
  ]);
  if (binaryType) ws.binaryType = binaryType;
  return ws;
};
