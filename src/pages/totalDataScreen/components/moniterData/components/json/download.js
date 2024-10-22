var http = require('https');
var fs = require('fs');
var path = require('path');

const baseUrl = 'https://geo.datav.aliyun.com/areas_v3/bound/';
const levels = ['province', 'city']; //district区县级不带full
const loseList = [];
let loseTotal = 0;

function RequestInfo(_url) {
  return new Promise((resolve, reject) => {
    http
      .get(_url, (res) => {
        const { statusCode } = res;
        let error;
        if (statusCode !== 200) {
          error = new Error('请求失败. \n 状态码：' + statusCode);
        }
        if (error) {
          res.resume();
          res.on('end', () => {
            reject(error);
          });
        } else {
          res.setEncoding('utf8');
          let rawData = '';
          res.on('data', (chunk) => {
            rawData += chunk;
          });
          res.on('end', () => {
            resolve(rawData);
          });
        }
      })
      .on('error', (e) => {
        reject(e);
      });
  });
}

function downloadJson(_url, _code, _name) {
  RequestInfo(_url)
    .then((res) => {
      //console.log(_name, _code, _url);
      try {
        let writeInfo = `//${_name} \r\n import * as echarts from 'echarts' \r\nlet map_data = ${res}; \r\n echarts.registerMap("${_code}", map_data);`;
        fs.writeFile('./data/' + _code + '.js', writeInfo, function (e) {});

        let _data = JSON.parse(res),
          _features = _data['features'],
          _tmp = '';

        if (Array.isArray(_features)) {
          if (_features.length > 1) {
            _features.forEach((item, i) => {
              if (item.properties.name) {
                _tmp =
                  levels.indexOf(item.properties.level) != -1 ? '_full' : '';
                setTimeout(
                  downloadJson,
                  50 * i,
                  `${baseUrl}${item.properties.adcode}${_tmp}.json`,
                  item.properties.adcode,
                  item.properties.name,
                );
              }
            });
          }
        }
      } catch (e) {
        console.log('catch url:', _name, _code, _url);
      }
    })
    .catch((e) => {
      loseTotal++;
      let _data = { name: _name, code: _code, url: _url.replace('_full', '') };
      console.log(JSON.stringify(_data) + ',');
    });
}

//开始下载澳门特别行政区，以及下级区域地图数据
downloadJson(baseUrl + '230000_full.json', 230000, '黑龙江省');
