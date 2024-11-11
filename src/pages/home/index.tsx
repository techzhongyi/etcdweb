import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import './index.less';
import { history, useModel } from 'umi';
import { webSocket } from '@/utils/socket';
import { setStorage, getStorage } from '@/utils/storage';
import eventBus from '@/utils/eventBus';
import green_cloud from '../../../public/icons/ectd/green_cloud.png'
import red_cloud from '../../../public/icons/ectd/red_cloud.png'
import gray_cloud from '../../../public/icons/ectd/gray_cloud.png'
import EtdcHeader from '@/components/NewHeader';
let webShh: any = null,
  timeoutObj: any = undefined,
  serverTimeoutObj: any = undefined;
const Index: React.FC = () => {

  const { initialState } = useModel('@@initialState');
  const { extraArray, defaultEnv } = initialState?.currentUser
  const [initDefaultEnv, setInitDefaultEnv] = useState(getStorage('env') || defaultEnv)
  const [dataList, setDataList] = useState<any[]>([])

  useEffect(() => {
    if (!getStorage('env')) {
      setStorage('env', defaultEnv)
    }
    eventBus.emit('envChange', defaultEnv);
  }, [defaultEnv])
  // 环境切换
  const envChange = (e) => {
    setStorage('env', e)
    setInitDefaultEnv(e)
    // setEnvs(e)
    eventBus.emit('envChange', e);
  }
  // 保持心跳
  const longstart = () => {
    //1、通过关闭定时器和倒计时进行重置心跳
    clearInterval(timeoutObj);
    clearTimeout(serverTimeoutObj);
    // 2、每隔30s向后端发送一条商议好的数据
    timeoutObj = setInterval(() => {
      if (webShh?.readyState === 1) {
        webShh.send('ping');
      } else {
        // webShhRefresh?.readyState != 1 连接异常 重新建立连接
        setWebShh(getStorage('env'))
      }
    }, 3000);
  };
  // 发送请求
  const setWebShh = async (env?) => {
    const data = {
      env: env ? env : getStorage('env'),
      organize: getStorage('organize')
    }
    // 必须设置格式为arraybuffer，zmodem 才可以使用
    webShh = await webSocket('/devopsCore/home', data);
    webShh.onopen = (res: any) => {
      longstart();
    };
    // 回调
    webShh.onmessage = function (recv: any) {
      if (typeof (recv.data) === 'string') {
        if (recv.data == 'pong' || recv.data == 'null') {
          return
        }
        const data_ = JSON.parse(recv.data);
        console.log(data_)
        setDataList(data_)
      } else {
        // zsentry.consume(recv.data);
      }
    };
    // 报错
    webShh.onerror = function () {
      webShh?.close();
      webShh = null;
      // setWebShh()
    }
  };
  const handleEvent = (env) => {
    setWebShh(env)
  }
  useEffect(() => {
    setWebShh()
    eventBus.on('envChange', (env) => { handleEvent(env) });
    return () => {
      eventBus.off('envChange', handleEvent);
      clearInterval(timeoutObj);
      clearTimeout(serverTimeoutObj);
      if (webShh) {
        webShh.close();
      }
    };

  }, [])
  // toOpratipn
  const toOpratipn = (organize,branch) => {
    history.push({
      pathname: '/opration',
      query: {
        organize,
        branch
      },
    })
  }
  return (
    <div className='page-container'>
      <EtdcHeader />
      <div className='home-select-env'>
        <Select
          defaultValue={initDefaultEnv}
          style={{ width: 200 }}
          onChange={(e) => { envChange(e) }}
          options={extraArray}
        />
      </div>
      <div className='home-content'>
        {
          dataList.map(item => {
            return (
              <div className='home-content-list' onClick={() => { toOpratipn(item.organize,item.sourcebranch) }}>
                <div className='list-title'>
                  <div>{item.organize}:{item.name}({item.ip})</div>
                  <div>CPU:{item.health.cpuusage.toFixed(2)}%,MEM:{item.health.memusage.toFixed(2)}%,IO:{item.health.diskio.toFixed(2)}%</div>
                  <div>{item.sourcebranch}</div>
                </div>
                <div className={['list-content',
                  item.health.status == 3
                    ? 'list-content-gray'
                    : item.health.status == 2
                      ? 'list-content-red'
                      : 'list-content-green',
                ].join(' ')}>
                  {
                    item.services.map(item_ => {
                      return (
                        <div className='list-item'>
                          <div className='list-item-icon'><img src={item_.status == 1 ? green_cloud : item_.status == 2 ? gray_cloud : red_cloud} alt="" /></div>
                          <div className='list-item-text'>
                            <div className='text-title'>{item_.sname}</div>
                            <div className='text-status'>{item_.status == 1 ? '正常' : item.status == 2 ? '失联' : '故障'}</div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  );
};
export default Index;
