import { webSocket } from '@/utils/socket';

let webShhUrl = '/devops/ws_pic',
  webShh: any = null,
  timeoutObj: any = undefined,
  serverTimeoutObj: any = undefined,
  connect_ids: any[] = [];
/**
 *长链接上传图片
 *
 * @param {*} data 要传的图片
 * @param {*} params 连接长链接的参数
 */
export const sshImgUp = async (data: any) => {
  // 是否有这个id，这个id是某个终端的id
  return;
  if (!connect_ids.includes(data.connect_id)) {
    connect_ids.push(data.connect_id);
  }
  await isHasWs();
  if (webShh?.readyState == 1) {
    webShh?.send(JSON.stringify(data));
  }
};

/**
 *关闭长链接上传图片
 *
 * @param {*} connect_id 要关闭的终端
 */
export const sshImgCol = async (connect_id: any) => {
  // 是否有这个id，这个id是某个终端的id
  let index = connect_ids.indexOf(connect_id);
  if (index >= 0) {
    connect_ids.splice(index, 1);
  }
  // 当前没有终端链接
  if (connect_ids.length <= 0) {
    webShh.close();
  }
};

// 多个地方调用，所以先判断是否已经有长链接
const isHasWs = async () => {
  if (!webShh) {
    webShh = await webSocket(webShhUrl, {}, 'arraybuffer');
  }
  webShh.onopen = (res: any) => {
    // webShh.send('192.168.10.101')
    // 开启绘图生成图片
    longstart();
  };

  // 回调
  webShh.onmessage = function (recv: any) {};
  // 发生错误的时候
  webShh.onerror = function (recv: any) {
    webShh = null;
  };
};
// 保持心跳
const longstart = () => {
  //1、通过关闭定时器和倒计时进行重置心跳
  clearInterval(timeoutObj);
  clearTimeout(serverTimeoutObj);
  // 2、每隔30s向后端发送一条商议好的数据
  timeoutObj = setInterval(() => {
    webShh.send('ping');
    // 3、发送数据 2s后没有接收到返回的数据进行关闭websocket重连
    serverTimeoutObj = setTimeout(() => {
      webShh?.close();
      webShh = null;
      // destroyed(false)
    }, 2000);
  }, 30000);
};
