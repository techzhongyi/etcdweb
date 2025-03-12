import React, { useEffect, useRef, useState, forwardRef } from 'react';
import './index.less'
import { history } from 'umi';
import { Button, List, Space, Spin } from 'antd';
import { ProForm, ProFormDateTimeRangePicker, ProFormText } from '@ant-design/pro-components';
import { getLogsLokiListAPI } from '@/services/log';
import eventBus from '@/utils/eventBus';

const HistorySearchlModal: React.FC<any> = forwardRef((props: any, ref) => {
  // const [messages, setMessages] = useState([]);
  const [formObj1] = ProForm.useForm();
  const { serviceName, isActive } = props;
  const scrollableDivRef = useRef(null); // 引用可滚动的 div
  const [loadingUp, setLoadingUp] = useState(false); // 向上加载的状态
  const [loadingDown, setLoadingDown] = useState(false); // 向下加载的状态
  const isLoading = useRef(false); // 加载锁，防止同时触发向上和向下加载
  const [leftDataList, setLeftDataList] = useState([]);
  const [activityId, setActivityId] = useState('');

  // 历史日志查询
  const onFinishHistory = async (value) => {
    console.log(value)
    const arr = []
    if (value.key1) {
      arr.push(value.key1)
    }
    if (value.key2) {
      arr.push(value.key2)
    }
    if (value.key3) {
      arr.push(value.key3)
    }
    setLeftDataList([])
    getLeftList()
  }
  const getLeftList = async (id?, dirc?, direction?) => {
    const params = {
      env: history?.location?.query?.env,
      organize: history?.location?.query?.organize,
      sname: serviceName,
      start: '',
      end: '',
      filter: JSON.stringify([]),
      limit: '20',
    }
    if (id) {
      params.id = +id
      params.dirc = dirc
    }
    const { data: { data } } = await getLogsLokiListAPI(params)
    if (direction === "up") {
      setLeftDataList((prev) => [...data, ...prev]);
    } else {
      setLeftDataList((prev) => [...prev, ...data]);
    }
  }
  // 模拟加载更多数据
  const loadMoreData = async (direction) => {
    if (direction === "up") {
      setLoadingUp(true);
      console.log('----》向上')
      const id = leftDataList[0][0]
      await getLeftList(id, 'old', 'up')
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
      const id = leftDataList[leftDataList.length - 1][0]
      await getLeftList(id, 'new', 'down')
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
  }, [loadingUp, loadingDown, leftDataList]);
  // 详情
  const logDetail = (item) => {
    setActivityId(item[0])
    eventBus.emit('detail', item[0]);
  }
  return (
    <div style={{ display: isActive ? 'block' : 'none' }}>
      <ProForm
        submitter={{
          render: (props_) => (
            <div style={{ textAlign: 'right' }}>
              <Space>
                <Button
                  type="primary"
                  key="submit"
                  onClick={() => props_.form?.submit?.()}
                >
                  查询
                </Button>
              </Space>
            </div>
          ),
        }}
        onFinish={onFinishHistory}
        form={formObj1}
      >
        <ProFormDateTimeRangePicker
          name="dateRange"
          width="md"
          label="时间范围"
        />
        <ProFormText
          width="md"
          name="key1"
          label="关键词1"
          fieldProps={{
            maxLength: 29,
          }}
          placeholder="请输入关键词"
        />
        <ProFormText
          width="md"
          name="key2"
          label="关键词2"
          fieldProps={{
            maxLength: 29,
          }}
          placeholder="请输入关键词"
        />
        <ProFormText
          width="md"
          name="key3"
          label="关键词3"
          fieldProps={{
            maxLength: 29,
          }}
          placeholder="请输入关键词"
        />
      </ProForm>
      <div className="scrollable-container-left" ref={scrollableDivRef}>
        {loadingUp && (
          <div style={{ textAlign: "center", padding: "10px" }}>
            <Spin tip="Loading..." />
          </div>
        )}
        {
          leftDataList.map(item => {
            return (
              <div className={[
                'data-list-content',
                activityId == item[0]
                  ? 'activityBgColor'
                  : '',
              ].join(' ')}>
                <div className='left-data-list' onClick={() => {
                  logDetail(item)
                }}>{item[2]}{item[1]}</div>
              </div>
            )
          })
        }
        {loadingDown && (
          <div style={{ textAlign: "center", padding: "10px" }}>
            <Spin tip="Loading..." />
          </div>
        )}
      </div>
    </div>
  );
});
export default HistorySearchlModal;
