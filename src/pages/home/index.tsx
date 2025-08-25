import React, { useEffect, useState } from 'react';
import { Select, Tooltip } from 'antd';
import './index.less';
import { history } from 'umi';
import { webSocket } from '@/utils/socket';
import { setStorage, getStorage } from '@/utils/storage';
import green_cloud from '../../../public/icons/ectd/green_cloud.png'
import red_cloud from '../../../public/icons/ectd/red_cloud.png'
import gray_cloud from '../../../public/icons/ectd/gray_cloud.png'
import yellow_cloud from '../../../public/icons/ectd/yellow_cloud.png'
import EtdcHeader from '@/components/NewHeader';
import DetailModal from './components/detailModal';
let webShh: any = null,
  timeoutObj: any = undefined,
  serverTimeoutObj: any = undefined;
const Index: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [record, setRecord] = useState<any | undefined>(undefined);
  const [env, setEnv] = useState(getStorage('env') || 'Dev')
  // 详情Modal
  const isShowModal = (event, show: boolean, row?: any) => {
    if (show) {
      event.stopPropagation();
    }
    setVisible(show);
    setRecord(row);
  };
  const envArray = [
    {
      label: 'Dev',
      value: 'Dev'
    },
    {
      label: 'Test',
      value: 'Test'
    },
    {
      label: 'Prod',
      value: 'Prod'
    },
  ]
  const [dataList, setDataList] = useState<any[]>([])
  const [isToolOpen, setIsToolOpen] = useState<boolean>(false)

  // 环境切换
  const envChange = (e) => {
    setStorage('env', e)
    setEnv(e)
    clearInterval(timeoutObj);
    clearTimeout(serverTimeoutObj);
    if (webShh) {
      webShh.close();
    }
    // setWebShh(e)
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
        setWebShh(env)
      }
    }, 3000);
  };
  // 发送请求
  const setWebShh = async (env) => {
    const data = {
      env,
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
  useEffect(() => {
    if (!getStorage('env')) {
      setStorage('env', 'Dev')
    }
    setWebShh(env)
    return () => {
      clearInterval(timeoutObj);
      clearTimeout(serverTimeoutObj);
      if (webShh) {
        webShh.close();
      }
    };

  }, [env])
  // toOpratipn
  const toOpratipn = (organize, branch) => {
    if (isToolOpen) {
      return
    }
    history.push({
      pathname: '/opration',
      query: {
        organize,
        branch,
        env
      },
    })
  }
  const getTitle = (item) => {
    return (
      <div>
        <div>持续运行时间:{item.bootupts}</div>
        <div>心跳响应时间(ms):{item.resptime}</div>
        {
          item.status != 'good' && <div>错误信息:{item.msg}</div>
        }
      </div>
    )
  }
  const tollTipOpen = (e) => {
    setIsToolOpen(e)
  }
  // 日志详情
  const toLogDetail = ( event,organize) => {
    event.stopPropagation();
    history.push({
      pathname: '/log',
      query: {
        branch: '',
        env,
        organize,
        sname: 'etcd-kingqi'
      },
    })
  }
  // 日志详情
  const toLog = () => {
    history.push({
      pathname: '/log',
      query: {
        branch: '',
        env,
        organize: 'kingyu',
        sname: 'kingyu'
      },
    })
  }
  return (
    <div className='page-container'>
      <EtdcHeader />
      <div className='home-select-env'>
        <Select
          defaultValue={env}
          style={{ width: 200 }}
          onChange={(e) => { envChange(e) }}
          options={envArray}
        />
        {
          env == 'Dev' && <a style={{ marginLeft: '10px',fontSize: '18px' }} className='content-detail' onClick={() => {
            toLog()
          }}>kingyu log</a>
        }
      </div>
      <div>{dataList.length}</div>
      {
        dataList.length > 0 ? <div className='home-content'>
          {
            dataList.map(item => {
              return (
                <div className='home-content-list' onClick={() => { toOpratipn(item.organize, item.sourcebranch) }}>
                  <div className='list-title'>
                    <div>{item.organize}:{item.name}({item.ip})</div>
                    <div>CPU:{item.health.cpuusage.toFixed(2)}%,MEM:{item.health.memusage.toFixed(2)}%,IO:{item.health.diskio.toFixed(2)}%</div>
                    <div>
                      {
                        env != 'Dev' && <a style={{ marginRight: '10px' }} className='content-detail' onClick={(e) => {
                          toLogDetail(e,item.organize)
                        }}>kingqi log</a>
                      }

                      <a className='content-detail' onClick={(e) => {
                        isShowModal(e, true, item)
                      }}>详情</a>
                    </div>
                  </div>
                  <div className={['list-content',
                    item.health.status == 'lost'
                      ? 'list-content-gray'
                      : item.health.status == 'fault'
                        ? 'list-content-red'
                        : item.health.status == 'good'
                          ? 'list-content-green' : 'list-content-yellow',
                  ].join(' ')}>
                    <div className='list-item-wrap'>
                      {
                        item.services.map(item_ => {
                          return (
                            <div className='list-item'>
                              <Tooltip onOpenChange={(e) => { tollTipOpen(e) }} overlayInnerStyle={{ width: '600px' }} placement="top" title={getTitle(item_)}>
                                <div className='list-item-icon'><img src={item_.status == 'good' ? green_cloud : item_.status == 'lost' ? gray_cloud : item_.status == 'init' ? yellow_cloud : red_cloud} alt="" /></div>
                              </Tooltip>
                              <div className='list-item-text'>
                                <div className='text-title'>{item_.sname}</div>
                                <div className='text-status'>{item_.status == 'good' ? '正常' : item.status == 'lost' ? '失联' : '故障'}</div>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>

                </div>
              )
            })
          }
        </div> : <></>
      }
      {!visible ? (
        ''
      ) : (
        <DetailModal
          visible={visible}
          isShowModal={isShowModal}
          record={record}
        />
      )}
    </div>
  );
};
export default Index;
