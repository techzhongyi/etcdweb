import * as echarts from 'echarts'; //全局引入 ，可按需引入
import { useEffect, useRef, useState } from 'react';
import * as MapData from './json/mapDataJson.js';
import icon_back from '../../../../../../public/icons/dataImage/icon_back@2x.png';
const ChinaMap = (props: any) => {
  const chartRef = useRef(null);
  const { addressListPrv } = props;
  const [mapName, setMapName] = useState('chinaMap');
  let option = {};
  //返回上级
  const backTopLevel = () => {
    setMapName('chinaMap');
    mapOption(mapName, MapData.chinaMap, addressListPrv);
  };
  const echartsMapClick = (params: any) => {
    console.log(params);
    if (!params.data) {
      return;
    }
    //点击地图模块逻辑事件
    MapData.mapJson.map((item: any) => {
      if (params.name === item.name) {
        if (chartRef.current) {
          const renderedMapInstance = echarts.getInstanceByDom(
            chartRef.current,
          );
          // 销毁实例，销毁后实例无法再被使用。
          renderedMapInstance && renderedMapInstance.dispose();
          //  市级数据
          let data = params.data.cities;
          setMapName('provinceMap');
          mapOption(item.key, MapData?.[item.key], data); //初始化-创建中国地图
        }
      }
    });
  };
  // 遍历数据，生成列表
  const tableList = (addressList: any, myChart: any) => {
    let appendHTML = '';
    let dom = document.getElementById('table-items');
    if (!dom) {
      return;
    }
    // 清除数据
    if (dom?.childNodes) {
      dom.innerHTML = '';
    }

    for (var i = 0; i < addressList.length; i++) {
      appendHTML +=
        '<div class="table-content-item"><div>' +
        addressList[i].name +
        '</div><div>' +
        addressList[i].value +
        '/' +
        addressList[i].total_value +
        '</div></div>';
    }
    dom.innerHTML = appendHTML;
    // 绑定事件

    let items = document.getElementsByClassName('table-content-item');
    if (!items) {
      return;
    }
    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener('mouseenter', function () {
        // 鼠标移入时的处理逻辑
        console.log('Mouse entered: ', this.children[0].textContent);
        // 表格高亮
        this.classList.add('highTr');
        // 地图
        myChart.dispatchAction({
          type: 'highlight',
          name: this.children[0].textContent,
        }); //选中高亮
      });
      items[i].addEventListener('mouseleave', function () {
        // 鼠标移出时的处理逻辑
        console.log('Mouse left: ', this.children[0].textContent);
        // 高亮
        this.classList.remove('highTr');
        myChart.dispatchAction({
          type: 'downplay',
          name: this.children[0].textContent,
        }); //取消高亮
      });
    }
  };
  // 地图配置
  const mapOption = (mapName: any, mapData: any, addressList: any) => {
    const myChart = echarts.init(chartRef.current);
    echarts.registerMap(mapName, mapData);
    option = {
      select: {
        itemStyle: {
          color: '#fff',
          areaColor: 'rgba(23,95,230,1)',
          // borderColor: '#000',
          // borderWidth: 20
        },
      },
      // 背景颜色
      // backgroundColor: '#404a59',
      tooltip: false,
      visualMap: {
        type: 'piecewise',
        pieces: [
          { gte: 100, color: '#AE1D25' },
          { gte: 50, lte: 99, color: '#FF7800' },
          { gte: 10, lte: 49, color: '#E3C000' },
          { gte: 1, lte: 9, color: '#175FE6' },
        ],
        realtime: false,
        calculable: true,
        textStyle: {
          color: '#fff',
        },
        left: 'left',
        show: true, //图注
      },
      geo: {
        map: mapName,
        roam: true, //不开启缩放和平移
        // center: [105.97, 34.71],
        zoom: mapName == mapName ? 1.1 : mapName == 'haiNanMap' ? 7 : 0.8, //视角缩放比例
        scaleLimit: {
          //滚轮缩放的极限控制
          min: 0.5, //缩放最小大小
          max: 3, //缩放最大大小
        },
        aspectScale: 0.75,
        layoutCenter:
          mapName == mapName
            ? ['50%', '70%']
            : mapName == 'haiNanMap'
            ? ['80%', '215%']
            : ['50%', '50%'], //地图位置
        layoutSize: '125%',
        label: {
          // 通常状态下的样式 (字体)
          normal: {
            show: true,
            formatter: function (params) {
              // 在省份名称后面添加数字
              const obj = addressList.filter(
                (item) =>
                  item.name == params.name && item.value && item.value != 0,
              );
              return params.name + '\n' + (obj.length > 0 ? obj[0].value : ''); // 假设 value 是一个包含数字的数组
            },
            textStyle: {
              color: '#fff',
            },
          },
          // 鼠标放上去的样式
          emphasis: {
            textStyle: {
              color: '#fff',
            },
          },
        },
        // 地图区域的样式设置
        itemStyle: {
          normal: {
            borderColor: 'rgba(1,123,201,1)',
            borderWidth: 2,
            // areaColor: "#00b6fe",
            areaColor: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.8,
              colorStops: [
                {
                  offset: 0,
                  color: '#00b6fe', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#00b6fe', // 100% 处的颜色
                },
              ],
              globalCoord: false, // 缺省为 false
            },
            // shadowColor: "rgba(1,123,201,0.2)",
            // shadowOffsetX: -5,
            // shadowOffsetY: 5,
            // shadowBlur: 1,
          },
          // 鼠标放上去高亮的样式
          emphasis: {
            areaColor: 'rgba(23,95,230)',
            borderWidth: 0,
          },
        },
      },
      series: [
        {
          name: '车辆',
          type: 'map',
          map: mapName,
          selectedMode: 'single',
          geoIndex: 0,
          roam: false,
          label: {
            show: true,
          },
          data: addressList?.filter((item) => item.value && item.value != 0),
        },
      ],
    };
    //绘图
    myChart.setOption(option);
    // 初始化列表数据
    tableList(addressList, myChart);
    //点击画布内还是画布外
    myChart.getZr().on('click', (params) => {
      if (params.target) {
        // 解綁事件
        myChart.off('click');
        if (mapName === mapName) {
          // 全国时，添加click 进入省级
          myChart.on('click', echartsMapClick); //增加点击事件
        } else {
          // 省份，添加双击 回退到全国
          myChart.on('dblclick', function () {
            backTopLevel();
          });
        }
      }
    });
    //  移入该区域时，高亮
    myChart.on('mouseOver', function (params: any) {
      for (var i = 0; i < addressList.length; i++) {
        if (params.name == addressList[i].name) {
          // 选中高亮
          myChart.dispatchAction({ type: 'highlight', name: params.name });
          // 获取操作dom 元素
          let dom = document.getElementsByClassName('table-content-item')[i];
          // 列表高亮
          dom.classList.add('highTr');
          // 列表滚动到视野
          // dom.scrollIntoView()
        }
      }
    });
    //  移出该区域时，取消高亮
    myChart.on('mouseOut', function (params: any) {
      for (var i = 0; i < addressList.length; i++) {
        if (params.name == addressList[i].name) {
          // 获取操作dom 元素
          let dom = document.getElementsByClassName('table-content-item')[i];
          //取消高亮
          myChart.dispatchAction({ type: 'downplay', name: params.name });
          // 取消高亮
          dom.classList.remove('highTr');
        }
      }
    });
  };

  useEffect(() => {
    mapOption(mapName, MapData.chinaMap, addressListPrv);
    return () => {
      // if(echartsResize){
      //   window.removeEventListener("resize", echartsResize);
      // }
    };
  }, []);
  //创建一个resize事件
  // const echartsResize = () => {
  //   console.log(echarts)
  //   echarts.init(chartRef?.current).resize();
  // };

  //监听echartsResize函数，实现图表自适应
  //window.addEventListener("resize", echartsResize);

  return (
    <>
      <div
        id="map"
        style={{ width: '100%', minHeight: '99%' }}
        ref={chartRef}
      />
      <div className="map-table">
        <div className="table-title">
          <div className="table-text">车辆数据图统计</div>
          {mapName == 'provinceMap' && (
            <div
              onClick={() => {
                backTopLevel();
              }}
            >
              {' '}
              <img src={icon_back} alt="" />
            </div>
          )}
        </div>
        <div className="table-content">
          <div>地区</div>
          <div>在线/总数</div>
        </div>
        <div className="table-border"></div>
        <div id="table-items" className="table-items"></div>
      </div>
    </>
  );
};
export default ChinaMap;
