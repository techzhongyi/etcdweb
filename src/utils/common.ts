import { getDownloadConfig, getImg } from '@/services/common/common';
// import { forIn, forInRight } from "lodash";
import * as CryptoJS from 'crypto-js'; // aes加密
export const fomatFloat = (src: number, pos: number) => {
  return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
};
// 设置上传文件的展示内容
export const setShowUrl = (src: string) => {
  const srcArr = src.includes('__ctkj__') ? src.split('__ctkj__') : '';
  return srcArr[srcArr.length - 1] || src;
};
// 删除空格 只支持两级嵌套
export const trimObj = (item: any) => {
  if (Object.keys(item).length > 0) {
    const newObj = item;
    for (const key in item) {
      const ditem = item[key];
      if (typeof ditem == 'string') {
        newObj[key] = ditem.trim();
      } else if (typeof ditem == 'object') {
        for (const i in ditem) {
          if (typeof ditem[i] == 'string') {
            newObj[key][i] = ditem[i].trim();
          } else {
            newObj[key][i] = ditem[i];
          }
        }
      } else {
        newObj[key] = ditem;
      }
    }
    return newObj;
  } else {
    return item;
  }
};

export const setHttp = (src: string) => {
  if (src == '' || src == null || src == undefined) {
    return '';
  }
  const isHttps = src.includes('https://');
  if (!isHttps) {
    return 'https://' + src;
  }
  return src;
};

// 图片展示 必须传递头信息
export const getThumbUrl = async (src: any) => {
  const res = await getImg({
    behavior: 'download',
    download: {
      uri: src,
    },
  });
  const blob = new Blob([res], { type: 'image/*' });
  const WURL = window.URL || window.webkitURL;
  return WURL.createObjectURL(blob);
};

// 图片下载
export const downloadImg = async (src: any) => {
  getThumbUrl(src).then((res) => {
    const a = document.createElement('a');
    a.href = res;
    a.download = '下载.png'; // 这里填保存成的文件名
    a.click();
    URL.revokeObjectURL(a.href);
    a.remove();
  });
};

// 文件下载 调后台接口获取参数拼接到返回的url后
export const getDownload = async (src: any) => {
  const {
    data: { sign_url },
  } = await getDownloadConfig({
    behavior: 'sign_url',
    sign_url: {
      url: src,
    },
  });
  // window.location = sign_url.url
  const a = document.createElement('a');
  a.href = sign_url.url;
  a.target = '_blank';
  a.download = sign_url.url;
  // a.href = sign_url.url+'&response-content-type=application/octet-stream';
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
};

// 截取文件后缀
export const getSuffix = (filename: string) => {
  const fileName = filename.lastIndexOf('.'); //取到文件名开始到最后一个点的长度
  const fileNameLength = filename.length; //取到文件名长度
  // let fileFormat = filename.substring(fileName + 1, fileNameLength);//截
  return filename.substring(fileName + 1, fileNameLength);
};

export const dataURLtoFile = (dataURI: string, type: string) => {
  let binary = atob(dataURI.split(',')[1]);
  let array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: type });
};

// 是否为json字符串，parseFlag是否返回字符串
export const canParseToJson = (str: string, parseFlag: boolean = true) => {
  try {
    if (
      typeof JSON.parse(str) === 'object' &&
      Object.prototype.toString.call(JSON.parse(str)) === '[object Object]'
    ) {
      return parseFlag === true ? JSON.parse(str) : true;
    }
  } catch (e) {}
  return false;
};

// JSON转URL参数
export const parseParams = (data: any) => {
  try {
    var tempArr = [];
    for (var i in data) {
      var key = encodeURIComponent(i);
      var value = encodeURIComponent(data[i]);
      tempArr.push(key + '=' + value);
    }
    var urlParamsStr = tempArr.join('&');
    return urlParamsStr;
  } catch (err) {
    return '';
  }
};

/*AES加密*/
// data 要加密的数据  iv偏移量
export const Encrypt = (data: any, iv: any) => {
  let encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Latin1.parse(iv), {
    iv: CryptoJS.enc.Latin1.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

// 随机数
export const randomString = (_num?: number) => {
  const num = _num || 32;
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 默认去掉容易混淆的字符
  const maxPos = chars.length;
  let pwd = '';
  for (let i = 0; i < num; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
};

// 查看当前系统
export const detectOS = () => {
  var sUserAgent = navigator.userAgent;
  var isWin = navigator.platform == 'Win32' || navigator.platform == 'Windows';
  var isMac =
    navigator.platform == 'Mac68K' ||
    navigator.platform == 'MacPPC' ||
    navigator.platform == 'Macintosh' ||
    navigator.platform == 'MacIntel';
  if (isMac) return 'Mac';
  var isUnix = navigator.platform == 'X11' && !isWin && !isMac;
  if (isUnix) return 'Unix';
  var isLinux = String(navigator.platform).indexOf('Linux') > -1;
  if (isLinux) return 'Linux';
  if (isWin) {
    var isWin2K =
      sUserAgent.indexOf('Windows NT 5.0') > -1 ||
      sUserAgent.indexOf('Windows 2000') > -1;
    if (isWin2K) return 'Win2000';
    var isWinXP =
      sUserAgent.indexOf('Windows NT 5.1') > -1 ||
      sUserAgent.indexOf('Windows XP') > -1;
    if (isWinXP) return 'WinXP';
    var isWin2003 =
      sUserAgent.indexOf('Windows NT 5.2') > -1 ||
      sUserAgent.indexOf('Windows 2003') > -1;
    if (isWin2003) return 'Win2003';
    var isWinVista =
      sUserAgent.indexOf('Windows NT 6.0') > -1 ||
      sUserAgent.indexOf('Windows Vista') > -1;
    if (isWinVista) return 'WinVista';
    var isWin7 =
      sUserAgent.indexOf('Windows NT 6.1') > -1 ||
      sUserAgent.indexOf('Windows 7') > -1;
    if (isWin7) return 'Win7';
  }
  return 'other';
};
