//map文件
//1.中国地图
import chinaMap from './data/china.json';
//2.台湾省地图
import taiWanMap from './data/台湾省.json';
//3.海南省地图
import haiNanMap from './data/海南省.json';
//4.安徽省地图
import anHuiMap from './data/安徽省.json';
//5.江西省地图
import jiangXiMap from './data/江西省.json';
//6.湖南省地图
import huNanMap from './data/湖南省.json';
//7.云南省地图
import yunNanMap from './data/云南省.json';
//8.贵州省地图
import guiZhouMap from './data/贵州省.json';
//9.广东省地图
import guangDongMap from './data/广东省.json';
//10.福建省地图
import fuJianMap from './data/福建省.json';

//11.浙江省地图
import zheJiangMap from './data/浙江省.json';
//12.江苏省地图
import jiangSuMap from './data/江苏省.json';
//13.四川省地图
import siChuanMap from './data/四川省.json';
//14.重庆市市地图
import chongQingMap from './data/重庆市.json';
//15.湖北省地图
import huBeiMap from './data/湖北省.json';
//16.河南省地图
import heNanMap from './data/河南省.json';
//17.山东省地图

import shanDongMap from './data/山东省.json';
//18.吉林省地图
import jiLinMap from './data/吉林省.json';
//19.辽宁省地图
import liaoNingMap from './data/辽宁省.json';
//20.天津市市地图
import tianJinMap from './data/天津市.json';
//21.北京市市地图
import beiJingMap from './data/北京市.json';
//22.河北省地图
import heBeiMap from './data/河北省.json';
//23.山西省地图
import shanXiMap from './data/山西省.json';
//24.陕西省地图
import shanXi2Map from './data/陕西省.json';
//25.宁夏回族自治区省地图
import ningXiaMap from './data/宁夏回族自治区.json';
//26.青海省地图
import qingHaiMap from './data/青海省.json';
//27.西藏自治区地图
import xiZangMap from './data/西藏自治区.json';
//28.黑龙江省地图
import heiLongJiangMap from './data/黑龙江省.json';

//29.内蒙古自治区地图
import neiMengGuMap from './data/内蒙古自治区.json';
//30.甘肃省地图
import ganSuMap from './data/甘肃省.json';
//31.新疆维吾尔自治区省地图
import xinJiangMap from './data/新疆维吾尔自治区.json';
//32.广西壮族自治区地图
import guangXiMap from './data/广西壮族自治区.json';
//33.香港
import xiangGangMap from './data/香港特别行政区.json';
//34.澳门
import aoMenMap from './data/澳门特别行政区.json';

let mapJson = [
  {
    name: '台湾省',
    json: taiWanMap,
    key: 'taiWanMap',
  },
  {
    name: '海南省',
    json: haiNanMap,
    key: 'haiNanMap',
  },
  {
    name: '安徽省',
    json: anHuiMap,
    key: 'anHuiMap',
  },
  {
    name: '江西省',
    json: jiangXiMap,
    key: 'jiangXiMap',
  },
  {
    name: '湖南省',
    json: huNanMap,
    key: 'huNanMap',
  },
  {
    name: '云南省',
    json: yunNanMap,
    key: 'yunNanMap',
  },
  {
    name: '贵州省',
    json: guiZhouMap,
    key: 'guiZhouMap',
  },
  {
    name: '广东省',
    json: guangDongMap,
    key: 'guangDongMap',
  },
  {
    name: '福建省',
    json: fuJianMap,
    key: 'fuJianMap',
  },
  {
    name: '浙江省',
    json: zheJiangMap,
    key: 'zheJiangMap',
  },
  {
    name: '江苏省',
    json: jiangSuMap,
    key: 'jiangSuMap',
  },
  {
    name: '四川省',
    json: siChuanMap,
    key: 'siChuanMap',
  },
  {
    name: '重庆市',
    json: chongQingMap,
    key: 'chongQingMap',
  },
  {
    name: '湖北省',
    json: huBeiMap,
    key: 'huBeiMap',
  },
  {
    name: '河南省',
    json: heNanMap,
    key: 'heNanMap',
  },
  {
    name: '山东省',
    json: shanDongMap,
    key: 'shanDongMap',
  },
  {
    name: '吉林省',
    json: jiLinMap,
    key: 'jiLinMap',
  },
  {
    name: '辽宁省',
    json: liaoNingMap,
    key: 'liaoNingMap',
  },
  {
    name: '天津市',
    json: tianJinMap,
    key: 'tianJinMap',
  },
  {
    name: '北京市',
    json: beiJingMap,
    key: 'beiJingMap',
  },
  {
    name: '河北省',
    json: heBeiMap,
    key: 'heBeiMap',
  },
  {
    name: '山西省',
    json: shanXiMap,
    key: 'shanXiMap',
  },
  {
    name: '陕西省',
    json: shanXi2Map,
    key: 'shanXi2Map',
  },
  {
    name: '宁夏回族自治区',
    json: ningXiaMap,
    key: 'ningXiaMap',
  },
  {
    name: '青海省',
    json: qingHaiMap,
    key: 'qingHaiMap',
  },
  {
    name: '西藏自治区',
    json: xiZangMap,
    key: 'xiZangMap',
  },
  {
    name: '黑龙江省',
    json: heiLongJiangMap,
    key: 'heiLongJiangMap',
  },
  {
    name: '内蒙古自治区',
    json: neiMengGuMap,
    key: 'neiMengGuMap',
  },
  {
    name: '甘肃省',
    json: ganSuMap,
    key: 'ganSuMap',
  },
  {
    name: '新疆维吾尔自治区',
    json: xinJiangMap,
    key: 'xinJiangMap',
  },
  {
    name: '广西壮族自治区',
    json: guangXiMap,
    key: 'guangXiMap',
  },
  {
    name: '香港特别行政区',
    json: xiangGangMap,
    key: 'xiangGangMap',
  },
  {
    name: '澳门特别行政区',
    json: aoMenMap,
    key: 'aoMenMap',
  },
];

export {
  mapJson,
  chinaMap,
  taiWanMap,
  haiNanMap,
  anHuiMap,
  jiangXiMap,
  huNanMap,
  yunNanMap,
  guiZhouMap,
  guangDongMap,
  fuJianMap,
  zheJiangMap,
  jiangSuMap,
  siChuanMap,
  chongQingMap,
  huBeiMap,
  heNanMap,
  shanDongMap,
  jiLinMap,
  tianJinMap,
  beiJingMap,
  heBeiMap,
  shanXiMap,
  shanXi2Map,
  ningXiaMap,
  qingHaiMap,
  xiZangMap,
  heiLongJiangMap,
  ganSuMap,
  xinJiangMap,
  guangXiMap,
  neiMengGuMap,
  aoMenMap,
  xiangGangMap,
  liaoNingMap,
};
