import * as echarts from 'echarts'; //全局引入 ，可按需引入
import { useEffect, useRef, useState } from 'react';
import * as MapData from '../../../../../dataScreen/components/json/mapDataJson.js';
import './map.less';
const UserMap = (props: any) => {
  const chartRef = useRef(null);
  let intervalId = useRef();
  const { addressListPrv } = props;
  const [mapName, setMapName] = useState('chinaMap');
  let option = {};
  // 遍历数据，生成列表
  const tableList = (addressList: any, myChart: any) => {
    let appendHTML = '';
    let dom = document.getElementById('map-div');
    if (!dom) {
      return;
    }
    // 清除数据
    if (dom?.childNodes) {
      dom.innerHTML = '';
    }

    for (var i = 0; i < addressList.length; i++) {
      appendHTML +=
        '<div class="contents"><div class="map-num">' +
        addressList[i].value +
        '</div><div class="map-add">' +
        addressList[i].name +
        '</div></div>';
    }
    dom.innerHTML = appendHTML;
    // 绑定事件

    let items = document.getElementsByClassName('contents');
    if (!items) {
      return;
    }
    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener('mouseenter', function () {
        // 鼠标移入时的处理逻辑
        // 表格高亮
        this.classList.add('high-Tr');
        // 地图
        myChart.dispatchAction({
          type: 'highlight',
          name: this.children[1].textContent,
        }); //选中高亮
      });
      items[i].addEventListener('mouseleave', function () {
        // 鼠标移出时的处理逻辑
        // 高亮
        this.classList.remove('high-Tr');
        myChart.dispatchAction({
          type: 'downplay',
          name: this.children[1].textContent,
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
          //areaColor: "none",
          areaColor: 'rgba(23,95,230,0.5)',
          // borderColor: '#000',
          borderWidth: 1,
        },
      },
      // 背景颜色
      // backgroundColor: '#404a59',
      tooltip: false,

      geo: {
        map: mapName,
        roam: true, //不开启缩放和平移
        // center: [105.97, 34.71],
        zoom: mapName == mapName ? 0.8 : mapName == 'haiNanMap' ? 7 : 0.8, //视角缩放比例
        scaleLimit: {
          //滚轮缩放的极限控制
          min: 0.5, //缩放最小大小
          max: 3, //缩放最大大小
        },
        aspectScale: 0.75,
        layoutCenter:
          mapName == mapName
            ? ['50%', '60%']
            : mapName == 'haiNanMap'
            ? ['80%', '215%']
            : ['50%', '50%'], //地图位置
        layoutSize: '125%',
        label: {
          // 通常状态下的样式 (字体)
          normal: {
            textStyle: {
              color: 'rgba(0,95,240,1)',
              fontSize: 0,
            },
          },
          // 鼠标放上去的样式
          emphasis: {
            textStyle: {
              color: 'rgba(0,95,240,1)',
              fontSize: 8,
            },
          },
        },
        // 地图区域的样式设置
        itemStyle: {
          normal: {
            borderColor: 'rgba(0,95,240,1)',
            borderWidth: 1,
            areaColor: 'rgba(0,95,240,0.5)',
          },
          // 鼠标放上去高亮的样式
          emphasis: {
            areaColor: 'rgba(207,255,0,1)',
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

    //  移入该区域时，高亮
    myChart.on('mouseOver', function (params: any) {
      for (var i = 0; i < addressList.length; i++) {
        if (params.name == addressList[i].name) {
          // 选中高亮
          myChart.dispatchAction({ type: 'highlight', name: params.name });
        }
      }
    });
    //  移出该区域时，取消高亮
    myChart.on('mouseOut', function (params: any) {
      for (var i = 0; i < addressList.length; i++) {
        if (params.name == addressList[i].name) {
          // 获取操作dom 元素
          //取消高亮
          myChart.dispatchAction({ type: 'downplay', name: params.name });
        }
      }
    });
    if (addressList.length > 0) {
      var currentIndex = 0; // 当前高亮省份的索引
      const startInterval = () => {
        intervalId.current = setInterval(() => {
          // 清除之前的高亮
          //取消高亮
          myChart.dispatchAction({ type: 'downplay' });

          // 高亮当前省份
          // 选中高亮
          let add = addressList[currentIndex];
          if (addressListPrv.other_list.length > 0 && add.name === '其他') {
            addressListPrv.other_list.map((item: any) => {
              myChart.dispatchAction({ type: 'highlight', name: item.name });
            });
          } else {
            myChart.dispatchAction({ type: 'highlight', name: add.name });
          }

          // 绑定事件

          let items = document.getElementsByClassName('contents');
          if (!items) {
            return;
          }
          for (var i = 0; i < items.length; i++) {
            if (items[i].children[1].textContent === add.name) {
              items[i].classList.add('high-Tr');
            } else {
              items[i].classList.remove('high-Tr');
            }
          }
          // 更新索引，实现轮播效果
          currentIndex = (currentIndex + 1) % addressList.length;
        }, 3000);
      };
      startInterval();
    }
  };
  const stopInterval = () => {
    clearInterval(intervalId.current);
  };
  useEffect(() => {
    mapOption(mapName, MapData.chinaMap, addressListPrv.front_list);
    return () => {
      stopInterval();
      if (echartsResize) {
        window.removeEventListener('resize', echartsResize);
      }
    };
  }, [addressListPrv]);
  //创建一个resize事件
  const echartsResize = () => {
    if (echarts) {
      echarts.init(chartRef?.current).resize();
    }
  };

  //监听echartsResize函数，实现图表自适应
  window.addEventListener('resize', echartsResize);
  return (
    <>
      <div
        id="map"
        style={{ width: '100%', minHeight: '99%' }}
        ref={chartRef}
      />
      <div className="map-div" id="map-div"></div>
    </>
  );
};
export default UserMap;
