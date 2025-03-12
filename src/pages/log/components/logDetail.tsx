import React, { useEffect, useRef, useState, forwardRef,useImperativeHandle } from 'react';
import './index.less'
import { history } from 'umi';
import { detectOS } from '@/utils/common';
import { webSocket } from '@/utils/socket';
import moment from 'moment';
let webShh: any = null,
  timeoutObj: any = undefined,
  serverTimeoutObj: any = undefined;
const LogDetailModal: React.FC<any> = forwardRef((props: any,ref) => {
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);
  const containerRef = useRef(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true); // 是否启用自动滚动
  const { serviceName, isActive } = props;

  const search = (value) => {
    const arr = []
    if(value.key1){
      arr.push(value.key1)
    }
    if(value.key2){
      arr.push(value.key2)
    }
    if(value.key3){
      arr.push(value.key3)
    }

    ws.current.send('FILTER??'+ JSON.stringify(arr))
    console.log('Child method called',value);
  };

  // 使用 useImperativeHandle 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    search
  }));
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
        setWebShh()
      }
    }, 3000);
  };

  // 发送请求
  const setWebShh = async () => {
    const data = {
      env: history?.location?.query?.env,
      sname: serviceName,
      organize: history?.location?.query?.organize,
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
    }
  };

  useEffect(async () => {
    // 处理新增连接
    const data = {
      env: history?.location?.query?.env,
      sname: serviceName,
      organize: history?.location?.query?.organize,
    }
    // 创建新WebSocket
    ws.current = await webSocket('/devopsCore/logsreal', data);
    ws.current.onmessage = (recv) => {
      if (typeof (recv.data) === 'string') {
        if (recv.data == 'pong' || recv.data == 'null') {
          return
        }
        // data_ += (recv.data + '<br/>');
        setMessages((prevMessages) => [...prevMessages, recv.data]);

        // setCodeLog(data_)
      } else {
        // zsentry.consume(recv.data);
      }
      // 在此处理接收的消息，如更新状态
    };
    ws.current.onopen = () => console.log(`连接 ${serviceName} 已打开`);
    ws.current.onclose = () => console.log(`连接 ${serviceName} 已关闭`);
    ws.current.onerror = (error) => console.error(`连接 ${serviceName} 错误:`, error);
    // 清理函数
    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, [serviceName, isActive]);
  // 清屏
  const clearLog = () => {
    setMessages([])
  }
  // 检测用户是否手动滚动
  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      // 判断用户是否向上滚动
      const isScrolledUp = container.scrollTop + container.clientHeight < container.scrollHeight - 10;
      if (isScrolledUp) {
        setIsAutoScrollEnabled(false); // 用户向上滚动，禁用自动滚动
      } else {
        setIsAutoScrollEnabled(true); // 用户滚动到底部，启用自动滚动
      }
    }
  };

  // 自动滚动到底部
  const scrollToBottom = () => {
    if (isAutoScrollEnabled && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  // 当 messages 更新时，尝试自动滚动
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div style={{ display: isActive ? 'block' : 'none' }}>
        <div className='log-history' ref={containerRef} onScroll={handleScroll}>
          {
            messages.map(item => {
              return (
                <>
                  <div style={{ fontFamily: detectOS() == 'Mac' ? 'monospace' : 'cursive' }} dangerouslySetInnerHTML={{ __html: item }}></div>
                  <div className='log-clear' onClick={() => {
                    clearLog()
                  }}>
                    <div> clear </div>
                  </div>
                </>
              )
            })
          }
        </div>
      </div >
    </>
  );
});
export default LogDetailModal;
