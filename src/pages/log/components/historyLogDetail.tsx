import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import './index.less'
import { history } from 'umi';
import { detectOS } from '@/utils/common';
import moment from 'moment';
import { Spin } from 'antd';
import { getLogsContextListAPI } from '@/services/log';
import eventBus from '@/utils/eventBus';

const HistoryLogDetailModal: React.FC<any> = forwardRef((props: any, ref) => {
  // const [messages, setMessages] = useState([]);
  const { serviceName, isActive } = props;
  const [sname, setSname] = useState(serviceName)
  const scrollableDivRef = useRef(null); // 引用可滚动的 div
  const [loadingUp, setLoadingUp] = useState(false); // 向上加载的状态
  const [loadingDown, setLoadingDown] = useState(false); // 向下加载的状态
  const isLoading = useRef(false); // 加载锁，防止同时触发向上和向下加载
  const [dataList, setDataList] = useState([]);
  const [key,setKey] = useState('')
  // 使用 useImperativeHandle 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    getRightList
  }));
  // 清屏
  const clearLog = () => {
    setDataList([])
  }
  // 获取数据
  const getRightList = async (id, key, dirc, direction?) => {
    const params = {
      env: history?.location?.query?.env,
      organize: history?.location?.query?.organize,
      sname,
      id: +id,
      dirc,
      key
    }
    const { data: { data } } = await getLogsContextListAPI(params)
    if (direction === "up") {
      setDataList((prev) => [...data, ...prev]);
    } else {
      setDataList((prev) => [...prev, ...data]);
    }
  }
  // 模拟加载更多数据
  const loadMoreData = async (direction) => {
    if (direction === "up") {
      setLoadingUp(true);
      console.log('----》向上')
      const id = dataList[0][0]
      await getRightList(id, key, 'old', 'up')
      setLoadingUp(false);
      isLoading.current = false; // 解锁
      // 保持滚动位置
      const scrollableDiv = scrollableDivRef.current;
      if (scrollableDiv) {
        const previousScrollHeight = scrollableDiv.scrollHeight;
        setTimeout(() => {
          scrollableDiv.scrollTop = scrollableDiv.scrollHeight - previousScrollHeight;
        }, 0); // 延迟调整滚动位置
      }
    } else if (direction === "down") {
      setLoadingDown(true);
      console.log('----》向下')
      const id = dataList[dataList.length - 1][0]
      await getRightList(id, key, 'new', 'down')
      setLoadingDown(false);
      isLoading.current = false; // 解锁
    }
  };// 防抖函数
  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };
  // 监听滚动事件
  useEffect(() => {
    const handleScroll = debounce(() => {
      const scrollableDiv = scrollableDivRef.current;
      if (!scrollableDiv) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollableDiv;
      // 向下滚动加载更多
      if (scrollTop + clientHeight >= scrollHeight - 10 && !loadingDown) {
        loadMoreData("down");
      }

      // 向上滚动加载更多
      if (scrollTop <= 10 && !loadingUp) {
        loadMoreData("up");
      }
    }, 100);

    const scrollableDiv = scrollableDivRef.current;
    if (scrollableDiv) {
      scrollableDiv.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollableDiv) {
        scrollableDiv.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loadingUp, loadingDown, dataList]);
  const handleEvent = ({id,key}) => {
    getRightList(id, key, 'new')
  }
  useEffect(() => {
    eventBus.on('detail', (env) => { handleEvent(env) });
    return () => {
      eventBus.off('detail', handleEvent);
    }
  }, [])
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 判断是否是 Command + K (Mac) 或 Ctrl + K (Windows/Linux)
      const isCommandOrCtrl = e.metaKey || e.ctrlKey;
      const isKKey = e.key.toLowerCase() === 'k';

      if (isCommandOrCtrl && isKKey) {
        e.preventDefault(); // 阻止默认行为（如浏览器搜索）
        e.stopPropagation(); // 阻止事件冒泡
        console.log('command+k')
        clearLog()
      }
    };

    // 绑定事件监听
    document.addEventListener('keydown', handleKeyDown);

    // 组件卸载时移除监听
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div >
      <div style={{ display: isActive ? 'block' : 'none' }}>
        <div className="scrollable-container" ref={scrollableDivRef}>
          {loadingUp && (
            <div style={{ textAlign: "center", padding: "10px" }}>
              <Spin tip="Loading..." />
            </div>
          )}
          {
            dataList.map(item => {
              return (
                <div dangerouslySetInnerHTML={{ __html: item[2]+item[1] }}></div>
              )
            })
          }
          {loadingDown && (
            <div style={{ textAlign: "center", padding: "10px" }}>
              <Spin tip="Loading..." />
            </div>
          )}
        </div>
        {/* <div className='log-history-clear' onClick={() => {
          clearLog()
        }}>
          <div> clear </div>
        </div> */}
      </div >
    </div>
  );
});
export default HistoryLogDetailModal;
