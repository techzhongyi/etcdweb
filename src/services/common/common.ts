import request from '@/utils/request';

/**
 * 获取阿里OSS配置相关
 *
 */
export const getOSSConfig = async (options?: { [key: string]: any }) => {
  return request('/user/oss', {
    method: 'GET',
    params: options,
  });
};

/**
 * 上传图片
 *
 */
export const getUploadImg = async (options?: { [key: string]: any }) => {
  return request('/pub/eoss', {
    method: 'PUT',
    data: options,
  });
};
/**
 * 解密图片
 *
 */
export const getImg = async (options?: { [key: string]: any }) => {
  return request('/pub/eoss', {
    method: 'GET',
    params: options,
  });
};

/**
 * 获取文件下载配置
 *
 */
export const getDownloadConfig = async (options?: { [key: string]: any }) => {
  return request('/common/admin/oss', {
    method: 'GET',
    params: options,
  });
};
// 保留两位小数 浮点数四舍五入 位数不够 不补0
export const fomatFloat = (src: number, pos: number) => {
  return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
};

const X_PI = (3.14159265358979324 * 3000.0) / 180.0;
const PI = 3.1415926535897932384626; //π
const a = 6378245.0; // 长半轴
const ee = 0.00669342162296594323; // 扁率

// WGS84坐标系转火星坐标系
export function wgs84togcj02(lng: number, lat: number) {
  // if (outOfChina(lng, lat)) {
  //   return [lng, lat]
  // }
  // else {
  var dlat = transformlat(lng - 105.0, lat - 35.0);
  var dlng = transformlng(lng - 105.0, lat - 35.0);
  var radlat = (lat / 180.0) * PI;
  var magic = Math.sin(radlat);
  magic = 1 - ee * magic * magic;
  var sqrtmagic = Math.sqrt(magic);
  dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
  dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
  const mglat = lat + dlat;
  const mglng = lng + dlng;
  return [mglng, mglat];
  // }
}
const transformlat = (lng: number, lat: number) => {
  const PI = 3.1415926535897932384626;
  let ret =
    -100.0 +
    2.0 * lng +
    3.0 * lat +
    0.2 * lat * lat +
    0.1 * lng * lat +
    0.2 * Math.sqrt(Math.abs(lng));
  ret +=
    ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
      2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) /
    3.0;
  ret +=
    ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) *
      2.0) /
    3.0;
  return ret;
};

const transformlng = (lng: number, lat: number) => {
  const PI = 3.1415926535897932384626;
  let ret =
    300.0 +
    lng +
    2.0 * lat +
    0.1 * lng * lng +
    0.1 * lng * lat +
    0.1 * Math.sqrt(Math.abs(lng));
  ret +=
    ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
      2.0) /
    3.0;
  ret +=
    ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) /
    3.0;
  ret +=
    ((150.0 * Math.sin((lng / 12.0) * PI) +
      300.0 * Math.sin((lng / 30.0) * PI)) *
      2.0) /
    3.0;
  return ret;
};

// 火星坐标系转百度坐标系
export function bd_decrypt(bd_lon: number, bd_lat: number) {
  // var pi_value=Math.PI;
  // var X_PI = pi_value * 3000.0 / 180.0;
  // var x = bd_lon - 0.0065;
  // var y = bd_lat - 0.006;
  // var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
  // var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
  // var gg_lon = z * Math.cos(theta);
  // var gg_lat = z * Math.sin(theta);
  return [bd_lon, bd_lat];
  // return {
  //     gg_lon: gg_lon,
  //     gg_lat: gg_lat
  // }
}

// 火星坐标系 转 WGS84
export function gcj02towgs84(lng: number, lat: number) {
  // if (outOfChina(lng, lat)) {
  //   return [lng, lat]
  // }
  // else {
  var dlat = transformlat(lng - 105.0, lat - 35.0);
  var dlng = transformlng(lng - 105.0, lat - 35.0);
  var radlat = (lat / 180.0) * PI;
  var magic = Math.sin(radlat);
  magic = 1 - ee * magic * magic;
  var sqrtmagic = Math.sqrt(magic);
  dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
  dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
  const mglat = lat + dlat;
  const mglng = lng + dlng;
  return [lng * 2 - mglng, lat * 2 - mglat];
  // }
}
