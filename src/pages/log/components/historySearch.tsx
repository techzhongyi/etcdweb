import React, { useEffect, useRef, useState, forwardRef } from 'react';
import './index.less'
import { history } from 'umi';
import { Button, List, Space, Spin } from 'antd';
import { ProForm, ProFormDateTimeRangePicker, ProFormText } from '@ant-design/pro-components';
import { getLogsLokiListAPI } from '@/services/log';
import eventBus from '@/utils/eventBus';

const HistorySearchlModal: React.FC<any> = forwardRef((props: any, ref) => {
  const [logParams, setLogParams] = useState([]);
  const [logTimeParams, setLogTimeParams] = useState([]);
  const [formObj1] = ProForm.useForm();
  const { serviceName, isActive } = props;
  const scrollableDivRef = useRef(null); // 引用可滚动的 div
  const [loadingUp, setLoadingUp] = useState(false); // 向上加载的状态
  const [loadingDown, setLoadingDown] = useState(false); // 向下加载的状态
  const isLoading = useRef(false); // 加载锁，防止同时触发向上和向下加载
  const [leftDataList, setLeftDataList] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [activityId, setActivityId] = useState('');
  const [key,setKey] = useState('')

  // 历史日志查询
  const onFinishHistory = async () => {
    const arr = []
    let time_ = []
    console.log(formObj1.getFieldValue('key1'))
    console.log(dateRange)
    if (formObj1.getFieldValue('key1')) {
      arr.push(formObj1.getFieldValue('key1'))
      setKey(formObj1.getFieldValue('key1'))
    }
    if (dateRange&&dateRange.length>1) {
      time_ = dateRange
      setLogTimeParams(dateRange)
    }
    setLogParams(arr)
    setLeftDataList([])
    getLeftList(arr,time_)
  }
  const getLeftList = async (arr,timeLog,id?, dirc?, direction?) => {
    const params = {
      env: history?.location?.query?.env,
      organize: history?.location?.query?.organize,
      sname: serviceName,
      start: timeLog.length >0?timeLog[0]:'',
      end: timeLog.length >0?timeLog[1]:'',
      filter: JSON.stringify(arr),
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
      await getLeftList(logParams,logTimeParams,id, 'old', 'up')
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
      await getLeftList(logParams,logTimeParams,id, 'new', 'down')
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
    console.log(item)
    setActivityId(item[0])
    const params = {
      id:item[0],
      key:key
    }
    eventBus.emit('detail', params);
  }
  // 让查询按钮支持回车触发（通过获取焦点）
  useEffect(() => {
    // 表单加载完成后让查询按钮获取焦点（可选）
    // searchButtonRef.current?.focus();

    // 监听全局回车事件，触发查询
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        // 阻止默认行为避免表单自动提交
        e.preventDefault();
        onFinishHistory();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  return (
    <div style={{ display: isActive ? 'block' : 'none' }}>
      <ProForm
        submitter={{
          render: (props_) => [],
        }}
        onFinish={onFinishHistory}
        form={formObj1}
      >
        <ProFormDateTimeRangePicker
          name="dateRange"
          width="md"
          label="时间范围"
          fieldProps={{
            format: 'YYYY-MM-DD HH:mm:ss',
            onChange: (date,dateString) => {
              console.log(dateString)
              if(dateString && dateString[0] != ''){
                setDateRange(dateString)
              }else{
                setDateRange([])
              }
            }
          }}
        />
        <ProFormText
          width="md"
          name="key1"
          label="关键词"
          fieldProps={{
            maxLength: 100,
          }}
          placeholder="请输入关键词,多个关键词用,隔开"
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
                <div className='left-data-list' dangerouslySetInnerHTML={{ __html: item[2]+item[1] }} onClick={() => {
                  logDetail(item)
                }}></div>
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
