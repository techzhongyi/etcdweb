import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card } from 'antd';
import './index.less';
import { detectOS } from '@/utils/common';
import { webSocket } from '@/utils/socket';
import { getStorage } from '@/utils/storage';
import eventBus from '@/utils/eventBus';
import ApplyModal from './components/applyModal';
let webShh: any = null,
  timeoutObj: any = undefined,
  serverTimeoutObj: any = undefined;
let webShhApply: any = null,
  timeoutObjApply: any = undefined,
  serverTimeoutObjApply: any = undefined;
let webShhRefresh: any = null,
  timeoutObjRefresh: any = undefined,
  serverTimeoutObjRefresh: any = undefined;

const Index: React.FC = () => {
  const [codeLog, setCodeLog] = useState<string>('');
  const [refreshData, setRefreshData] = useState<string>('');
  const [applyData, setApplyData] = useState<string>('');
  const [isScroll, setIsScroll] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [applyIsDone, setApplyIsDone] = useState(false)
  const [visible, setVisible] = useState<boolean>(false);

  // 新增 编辑 关闭Modal
  const isShowModal = (show: boolean) => {
    setVisible(show);
  };

  // 保持步骤心跳
  const longRefreshstart = () => {
    //1、通过关闭定时器和倒计时进行重置心跳
    clearInterval(timeoutObjRefresh);
    clearTimeout(serverTimeoutObjRefresh);
    // 2、每隔3s向后端发送一条商议好的数据
    timeoutObjRefresh = setInterval(() => {
      // webShhRefresh?.readyState == 1 正常连接
      if (webShhRefresh?.readyState === 1) {
        webShhRefresh.send('ping');
      } else {
        // webShhRefresh?.readyState != 1 连接异常 重新建立连接
        setWebShhRefresh(getStorage('env'))
      }
    }, 3000);
  };
  // 发送请求
  let refreshData_ = ''
  const setWebShhRefresh = async (env) => {
    const data = {
      env: env ? env : getStorage('env'),
      organize: getStorage('organize')
    }
    // 必须设置格式为arraybuffer，zmodem 才可以使用
    webShhRefresh = await webSocket('/devopsCore/refresh', data);
    webShhRefresh.onopen = (res: any) => {
      longRefreshstart()
    };
    // 回调
    webShhRefresh.onmessage = function (recv: any) {
      if (typeof (recv.data) === 'string') {
        if (recv.data == 'pong' || recv.data == 'null') {
          // setRefreshData('')
          return
        }
        const _data = JSON.parse(recv.data)
        setIsDone(!(_data.IsDone))
        if (_data.Msg == '') {
          return
        }
        refreshData_ += (_data.Msg) + '<br/>';
        setRefreshData(refreshData_)
      } else {
        // zsentry.consume(recv.data);
      }
    };
    // 报错
    webShhRefresh.onerror = function () {
      webShhRefresh?.close();
      webShhRefresh = null;
    }
  };
  // 保持步骤心跳
  const longApplystart = () => {
    //1、通过关闭定时器和倒计时进行重置心跳
    clearInterval(timeoutObjApply);
    clearTimeout(serverTimeoutObjApply);
    // 2、每隔30s向后端发送一条商议好的数据
    timeoutObjApply = setInterval(() => {
      if (webShhApply?.readyState === 1) {
        webShhApply.send('ping');
      } else {
        // webShhRefresh?.readyState != 1 连接异常 重新建立连接
        setWebShhApply(getStorage('env'))
      }
    }, 3000);
  };
  // 发送请求
  let applyData_ = ''
  const setWebShhApply = async (env) => {
    const data = {
      env: env ? env : getStorage('env'),
      organize: getStorage('organize')
    }
    // 必须设置格式为arraybuffer，zmodem 才可以使用
    webShhApply = await webSocket('/devopsCore/apply', data);
    webShhApply.onopen = (res: any) => {
      longApplystart();
    };
    // 回调
    webShhApply.onmessage = function (recv: any) {
      if (typeof (recv.data) === 'string') {
        if (recv.data == 'pong' || recv.data == 'null') {
          // setRefreshData('')
          return
        }
        const _data = JSON.parse(recv.data)
        setApplyIsDone(!(_data.IsDone))
        if (_data.Msg == '') {
          return
        }
        applyData_ += (_data.Msg) + '<br/>';
        setApplyData(applyData_)

      } else {
        // zsentry.consume(recv.data);
      }
    };
    // 报错
    webShhApply.onerror = function () {
      webShhApply?.close();
      webShhApply = null;
    }
  };
  // 保持日志心跳
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
  let data_ = '';
  // 发送请求
  const setWebShh = async (env) => {
    const data = {
      env: env ? env : getStorage('env'),
      sname: 'devopsCore'
    }
    // 必须设置格式为arraybuffer，zmodem 才可以使用
    webShh = await webSocket('/devopsCore/logsreal', data);
    webShh.onopen = (res: any) => {
      longstart();
    };
    // 回调
    webShh.onmessage = function (recv: any) {
      if (typeof (recv.data) === 'string') {
        if (recv.data == 'pong' || recv.data == 'null') {
          // setCodeLog('')
          return
        }
        data_ += (recv.data + '<br/>');
        setCodeLog(data_)
      } else {
        // zsentry.consume(recv.data);
      }
    };
    // 报错
    webShh.onerror = function () {
      webShh?.close();
      webShh = null;
      setWebShh(getStorage('env'))
    }
  };
  const handleEvent = (env) => {
    setWebShh(env)
    // setWebShhApply(env)
  }
  useEffect(() => {
    setWebShh(getStorage('env'))
    setWebShhApply(getStorage('env'))
    setWebShhRefresh(getStorage('env'))
    eventBus.on('envChange', (env) => { handleEvent(env) });
    return () => {
      eventBus.off('envChange', handleEvent);
      clearInterval(timeoutObj);
      clearTimeout(serverTimeoutObj);
      clearInterval(timeoutObjApply);
      clearTimeout(serverTimeoutObjApply);
      clearInterval(timeoutObjRefresh);
      clearTimeout(serverTimeoutObjRefresh);
      if (webShh) {
        webShh.close();
      }
      if (webShhApply) {
        webShhApply.close();
      }
      if (webShhRefresh) {
        webShhRefresh.close();
      }
    }
  }, [])
  let befortop = 0
  useEffect(() => {
    const div = document.getElementById('log-content')
    window.addEventListener('scroll', () => {
      const aftertop = div?.scrollTop;//兼容
      if (aftertop - befortop > 0) {
        console.log('向下');
        setIsScroll(false)
      } else {
        console.log('向上');
        setIsScroll(true)
      }
      befortop = aftertop;
    }, true)
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        setIsScroll(false)
      }
    })
    if (div && !isScroll) {
      div.scrollTop = div.scrollHeight
    }
  }, [codeLog])
  // 刷新
  const refresh = () => {
    setRefreshData('')
    setIsDone(true)
    webShhRefresh.send('refresh');
  }
  // 应用
  const onFinish = async (value) => {
    setApplyIsDone(true)
    setApplyData('')
    isShowModal(false)
    webShhApply.send('apply??' + value.desc)
  }

  return (
    <PageContainer
      ghost
      header={{
        title: ' ',
        breadcrumb: {},
      }}
    >
      <Card>
        <div className='upgrades-content'>
          <div className='upgrades-content-btns'>
            <Button type="primary" loading={isDone} onClick={() => {
              refresh()
            }}>{isDone ? '执行中' : '刷新'}</Button>
            <Button loading={applyIsDone} onClick={() => {
              isShowModal(true)
            }}>{applyIsDone ? '执行中' : '应用'}</Button>
          </div>
          <div className='upgrades-top-refresh'>
            <div>
              <div className='content-title'>刷新</div>
              <div className='refresh-content'>
                {
                  <div id='refresh-content' style={{ fontFamily: detectOS() == 'Mac' ? 'monospace' : 'cursive', height: '200px', overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: refreshData }}></div>
                }
              </div>
            </div>
            <div>
              <div className='content-title'>应用</div>
              <div className='procedure-content'>
                {
                  <div id='procedure-content' style={{ fontFamily: detectOS() == 'Mac' ? 'monospace' : 'cursive', height: '200px', overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: applyData }}></div>
                }
              </div>
            </div>
          </div>

          <div style={{ margin: '10px 0' }}></div>
          <div>
            <div className='content-title'>日志</div>
            <div className='log-content'>
              {
                <div id='log-content' style={{ fontFamily: detectOS() == 'Mac' ? 'monospace' : 'cursive', height: '700px', overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: codeLog }}></div>
              }
            </div>
          </div>
        </div>
      </Card>
      {!visible ? (
        ''
      ) : (
        <ApplyModal
          visible={visible}
          isShowModal={isShowModal}
          onFinish={onFinish}
        />
      )}
    </PageContainer>
  );
};
export default Index;
