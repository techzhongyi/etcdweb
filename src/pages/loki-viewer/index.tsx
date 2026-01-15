import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Card,
  Input,
  Button,
  DatePicker,
  Select,
  Table,
  Space,
  Collapse,
  Row,
  Col,
  Typography,
  message,
  Spin,
  Checkbox,
} from 'antd';
import {
  PlayCircleOutlined,
  SaveOutlined,
  UploadOutlined,
  ReloadOutlined,
  PlusOutlined,
  DeleteOutlined,
  UpOutlined,
} from '@ant-design/icons';
import moment, { Moment } from 'moment';
import { queryRange, getLabels, getLabelValues, QueryRangeResult } from '@/services/loki';
import AlertMessage from '@/components/AlertMessage';
import {
  savePreset,
  getPreset,
} from '@/utils/lokiStorage';
import { nanoToDateString, nanoToFormattedDate, dateStringToNano, getDateRange } from '@/utils/lokiDate';
import { highlightKeyword } from '@/utils/lokiHighlight';
import styles from './index.less';
import { history, useModel } from 'umi';
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;
const { Title } = Typography;

interface LabelFilter {
  id: string;
  label: string;
  value: string;
  values: string[];
  loading: boolean;
  error?: string;
}

const DATE_RANGES = [
  { value: 'custom', label: '自定义' },
  { value: 'today', label: '今天' },
  { value: 'yesterday', label: '昨天' },
  { value: 'this_week', label: '本周（周日-今天）' },
  { value: 'last_7_days', label: '最近7天' },
  { value: 'this_month', label: '本月（1号-今天）' },
  { value: 'last_30_days', label: '最近30天' },
  { value: 'last_90_days', label: '最近90天' },
  { value: 'last_12_months', label: '最近12个月' },
  { value: 'this_year', label: '今年（1月-今天）' },
];

const LokiViewer: React.FC = () => {
  const [url, setUrl] = useState<string>('http://'+history?.location?.query?.env+':3102');
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [filterStart, setFilterStart] = useState<string>(
    moment().subtract(1, 'hour').format('YYYY-MM-DDTHH:mm:ss'),
  );
  const [filterEnd, setFilterEnd] = useState<string>(moment().format('YYYY-MM-DDTHH:mm:ss'));
  const [selectedDateRange, setSelectedDateRange] = useState<string>('custom');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState<string>(''); // 防抖后的关键词，用于高亮
  const [caseSensitive, setCaseSensitive] = useState<boolean>(true); // 是否区分大小写

  // Labels 相关状态
  const [labels, setLabels] = useState<string[]>([]);
  const [labelFilters, setLabelFilters] = useState<LabelFilter[]>([
    { id: Date.now().toString(), label: '', value: '', values: [], loading: false },
  ]);
  const [loadingLabels, setLoadingLabels] = useState<boolean>(false);
  const [labelsError, setLabelsError] = useState<string>('');

  // 日志相关状态
  const [logs, setLogs] = useState<Array<[string, string]>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [hasExecutedQuery, setHasExecutedQuery] = useState<boolean>(false);
  const [filtersCollapsed, setFiltersCollapsed] = useState<boolean>(false);

  // 实时日志相关状态
  const [isLiveMode, setIsLiveMode] = useState<boolean>(false);
  const [liveLogsCount, setLiveLogsCount] = useState<number>(0);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [connectionId, setConnectionId] = useState<string | null>(null);

  // 用于批量处理日志的缓冲区
  const logBufferRef = React.useRef<Array<[string, string]>>([]);
  const updateTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const logsLengthRef = React.useRef<number>(0);
  const isLiveModeRef = React.useRef<boolean>(false);
  const heartbeatTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // 滚动相关状态
  const userScrolledRef = React.useRef<boolean>(false); // 用户是否手动滚动
  const lastScrollTopRef = React.useRef<number>(0); // 上次滚动位置
  const isScrollingRef = React.useRef<boolean>(false); // 是否正在滚动


  // 滚动到顶部
  const [showScrollToTop, setShowScrollToTop] = useState<boolean>(false);

  // 从 URL 参数初始化
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('url')) setUrl(params.get('url') || '');
    if (params.get('query')) setFilterQuery(params.get('query') || '');
    if (params.get('start')) {
      setFilterStart(nanoToDateString(Number(params.get('start'))));
    }
    if (params.get('end')) {
      setFilterEnd(nanoToDateString(Number(params.get('end'))));
    }
  }, []);


  // 关键词防抖处理，减少高亮计算频率
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchKeyword(searchKeyword);
    }, 300); // 300ms 防抖延迟

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // 监听 URL 变化，自动获取 labels
  useEffect(() => {
    if (url && url.length > 0) {
      fetchLabels();
    }
  }, [url]);

  // 监听关键词变化，更新 LogQL 查询
  useEffect(() => {
    // 获取当前的 filterQuery
    setFilterQuery((currentQuery) => {
      // 只有当 filterQuery 是由标签构建的格式（以 { 开头）时，才自动更新
      if (!currentQuery || !currentQuery.startsWith('{')) {
        // 如果不是标签格式，可能是用户手动编辑的，不自动更新
        return currentQuery;
      }

      // 提取标签部分（花括号内的内容）
      const labelMatch = currentQuery.match(/^\{[^}]*\}/);
      const labelPart = labelMatch ? labelMatch[0] : '';

      // 构建新的查询
      const keyword = searchKeyword?.trim() || '';
      let newQuery = labelPart;

      if (keyword) {
        if (caseSensitive) {
          // 区分大小写：使用 |= 操作符
          newQuery = `${labelPart} |= "${keyword}"`;
        } else {
          // 不区分大小写：使用正则表达式 |~ "(?i)keyword"
          const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          newQuery = `${labelPart} |~ "(?i)${escapedKeyword}"`;
        }
      }

      // 只有当查询确实改变时才更新
      return newQuery !== currentQuery ? newQuery : currentQuery;
    });
  }, [searchKeyword, caseSensitive]);

  // 监听滚动
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);

      // 实时日志模式下，检测用户是否手动滚动
      if (isLiveMode) {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        // 判断是否滚动到底部（允许10px的误差）
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;

        // 判断是否是用户手动滚动（滚动位置变化且不是程序触发的）
        if (!isScrollingRef.current) {
          const scrollDelta = Math.abs(scrollTop - lastScrollTopRef.current);
          if (scrollDelta > 5) { // 滚动超过5px认为是用户手动滚动
            // 如果滚动到底部，自动开启自动滚动
            if (isAtBottom) {
              userScrolledRef.current = false;
              setAutoScroll(true);
            } else {
              // 如果向上滚动（不在底部），关闭自动滚动
              userScrolledRef.current = true;
              setAutoScroll(false);
            }
          }
        }

        lastScrollTopRef.current = scrollTop;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLiveMode]);

  // 清理实时日志连接和定时器
  useEffect(() => {
    return () => {
      if (eventSource) {
        // 检查连接状态，只有在打开或连接中时才关闭
        if (eventSource.readyState === EventSource.OPEN || eventSource.readyState === EventSource.CONNECTING) {
          try {
            // 移除事件监听器
            eventSource.onopen = null;
            eventSource.onmessage = null;
            eventSource.onerror = null;
            // 关闭连接
            eventSource.close();
          } catch (e) {
            console.error('[客户端] 清理 EventSource 时出错:', e);
          }
        }
      }
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
        updateTimerRef.current = null;
      }
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = null;
      }
    };
  }, [eventSource]);

  // 实时日志自动滚动到底部（显示最新日志）- 使用防抖减少滚动频率
  const scrollTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    // 只有在自动滚动开启且用户没有手动滚动时才自动滚动
    if (isLiveMode && autoScroll && logs.length > 0 && !userScrolledRef.current) {
      // 清除之前的定时器
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }

      // 延迟滚动，避免频繁滚动导致卡顿
      scrollTimerRef.current = setTimeout(() => {
        // 再次检查条件，防止在延迟期间状态改变
        if (!isLiveMode || !autoScroll || userScrolledRef.current) {
          return;
        }

        // 标记为程序滚动，避免触发用户滚动检测
        isScrollingRef.current = true;

        // 滚动到页面底部，确保最新的日志（在表格底部）可见
        const scrollHeight = document.documentElement.scrollHeight;
        window.scrollTo({
          top: scrollHeight,
          behavior: 'smooth',
        });

        // 滚动完成后重置标记
        setTimeout(() => {
          isScrollingRef.current = false;
          lastScrollTopRef.current = window.scrollY || document.documentElement.scrollTop;
        }, 300);
      }, 200); // 200ms 防抖，减少滚动频率，提高响应速度

      return () => {
        if (scrollTimerRef.current) {
          clearTimeout(scrollTimerRef.current);
        }
      };
    }
  }, [logs.length, isLiveMode, autoScroll]); // 只依赖 logs.length，而不是整个 logs 数组

  // 获取所有 labels
  const fetchLabels = async () => {
    if (!url || url.length < 1) return;

    setLoadingLabels(true);
    setLabelsError('');
    setLabels([]);
    setLabelFilters([{ id: Date.now().toString(), label: '', value: '', values: [], loading: false }]);

    try {
      const response = await getLabels(url);
      console.log('Loki labels 响应:', response);

      // 兼容不同的响应格式
      if (response && response.status === 'success' && response.data) {
        // 标准格式：{ status: 'success', data: [...] }
        setLabels(Array.isArray(response.data) ? response.data : []);
      } else if (response && Array.isArray(response.data)) {
        // 如果 data 是数组，直接使用
        setLabels(response.data);
      } else if (response && response.data && Array.isArray(response.data.data)) {
        // 嵌套格式：{ status: 'success', data: { data: [...] } }
        setLabels(response.data.data);
      } else {
        console.error('未知的响应格式:', response);
        setLabelsError(`获取 labels 失败：响应格式错误。响应内容: ${JSON.stringify(response)}`);
      }
    } catch (error: any) {
      console.error('获取 labels 异常:', error);
      setLabelsError(`获取 labels 失败：${error.message || '未知错误'}`);
    } finally {
      setLoadingLabels(false);
    }
  };

  // 获取特定 label 的值
  const fetchLabelValues = async (filterId: string, label: string) => {
    if (!url || !label || label.length < 1) return;

    // 先更新为加载状态
    setLabelFilters((prevFilters) =>
      prevFilters.map((f) =>
        f.id === filterId
          ? { ...f, loading: true, value: '', values: [], error: undefined }
          : f,
      ),
    );

    try {
      const response = await getLabelValues(url, label);
      console.log('Loki label values 响应:', response);

      // 兼容不同的响应格式
      let values: string[] = [];
      if (response && response.status === 'success' && response.data) {
        if (Array.isArray(response.data)) {
          values = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          values = response.data.data;
        }
      } else if (response && Array.isArray(response.data)) {
        values = response.data;
      }

      if (values.length > 0 || (response && response.status === 'success')) {
        setLabelFilters((prevFilters) =>
          prevFilters.map((f) =>
            f.id === filterId
              ? { ...f, values, loading: false }
              : f,
          ),
        );
      } else {
        console.error('未知的响应格式:', response);
        setLabelFilters((prevFilters) =>
          prevFilters.map((f) =>
            f.id === filterId
              ? { ...f, loading: false, error: `获取值失败：响应格式错误。响应内容: ${JSON.stringify(response)}` }
              : f,
          ),
        );
      }
    } catch (error: any) {
      console.error('获取 label values 异常:', error);
      setLabelFilters((prevFilters) =>
        prevFilters.map((f) =>
          f.id === filterId
            ? { ...f, loading: false, error: `获取值失败：${error.message || '未知错误'}` }
            : f,
        ),
      );
    }
  };

  // 添加 label 过滤器
  const addLabelFilter = () => {
    setLabelFilters([
      ...labelFilters,
      { id: Date.now().toString(), label: '', value: '', values: [], loading: false },
    ]);
  };

  // 删除 label 过滤器
  const removeLabelFilter = (id: string) => {
    if (labelFilters.length <= 1) return;
    setLabelFilters(labelFilters.filter((f) => f.id !== id));
    updateFilterQueryFromLabelFilters();
  };

  // 处理 label 变化
  const handleLabelChange = (filterId: string, label: string) => {
    // 先更新 label，清空 value 和 values
    setLabelFilters((prevFilters) => {
      const newFilters = prevFilters.map((f) =>
        f.id === filterId
          ? { ...f, label, value: '', values: [], error: undefined }
          : f,
      );

      // 如果清空了 label，立即更新查询
      if (!label || label.length === 0) {
        const parts = newFilters
          .filter((f) => f.label && f.value)
          .map((f) => `${f.label}="${f.value}"`);

        const newQuery = buildFilterQuery(parts, searchKeyword);
        setFilterQuery(newQuery);
      }

      return newFilters;
    });

    if (label && label.length > 0) {
      // 获取该 label 的所有值
      fetchLabelValues(filterId, label);
    }
  };

  // 处理 label 值变化
  const handleLabelValueChange = (filterId: string, value: string) => {
    setLabelFilters((prevFilters) => {
      const newFilters = prevFilters.map((f) => (f.id === filterId ? { ...f, value } : f));

      // 立即更新查询，使用新的 filters
      const parts = newFilters
        .filter((f) => f.label && f.value)
        .map((f) => `${f.label}="${f.value}"`);

      const newQuery = buildFilterQuery(parts, searchKeyword, caseSensitive);
      setFilterQuery(newQuery);

      return newFilters;
    });
  };

  // 构建完整的 LogQL 查询（包含标签和关键词）
  const buildFilterQuery = useCallback((labelParts: string[], keyword: string, caseSensitive: boolean = true) => {
    let baseQuery = '';
    if (labelParts.length > 0) {
      baseQuery = `{${labelParts.join(',')}}`;
    }

    // 如果有关键词，添加关键词过滤
    if (keyword && keyword.trim()) {
      const trimmedKeyword = keyword.trim();
      if (caseSensitive) {
        // 区分大小写：使用 |= 操作符
        return `${baseQuery} |= "${trimmedKeyword}"`;
      } else {
        // 不区分大小写：使用正则表达式 |~ "(?i)keyword"
        // 转义特殊字符
        const escapedKeyword = trimmedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return `${baseQuery} |~ "(?i)${escapedKeyword}"`;
      }
    }
    return baseQuery;
  }, []);

  // 从 label 过滤器更新查询
  const updateFilterQueryFromLabelFilters = useCallback(() => {
    setLabelFilters((prevFilters) => {
      const parts = prevFilters
        .filter((f) => f.label && f.value)
        .map((f) => `${f.label}="${f.value}"`);

      const newQuery = buildFilterQuery(parts, searchKeyword, caseSensitive);
      setFilterQuery(newQuery);

      return prevFilters;
    });
  }, [searchKeyword, caseSensitive, buildFilterQuery]);

  // 设置日期范围
  const handleDateRangeChange = (range: string) => {
    setSelectedDateRange(range);
    if (range === 'custom') return;

    const { start, end } = getDateRange(range);
    setFilterStart(moment(start).format('YYYY-MM-DDTHH:mm:ss'));
    setFilterEnd(moment(end).format('YYYY-MM-DDTHH:mm:ss'));
  };

  // 停止实时日志
  const stopLiveLogs = () => {
    console.log('[客户端] ========== 开始停止实时日志 ==========');

    // 先设置状态和 ref，防止继续处理消息
    setIsLiveMode(false);
    isLiveModeRef.current = false;

    // 关闭 EventSource 连接
    if (eventSource) {
      try {
        // 检查连接状态，只有在打开或连接中时才需要关闭
        if (eventSource.readyState === EventSource.OPEN || eventSource.readyState === EventSource.CONNECTING) {
          // 移除所有事件监听器（防止在关闭过程中触发事件）
          eventSource.onopen = null;
          eventSource.onmessage = null;
          eventSource.onerror = null;

          // 关闭连接
          eventSource.close();
          console.log('[客户端] EventSource 已关闭, readyState:', eventSource.readyState);
        } else {
          console.log('[客户端] EventSource 已处于关闭状态, readyState:', eventSource.readyState);
        }
      } catch (e) {
        console.error('[客户端] 关闭 EventSource 时出错:', e);
      }
      setEventSource(null);
    }

    // 停止心跳
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
    setConnectionId(null);

    // 清理状态
    setLiveLogsCount(0);
    logBufferRef.current = [];
    logsLengthRef.current = 0;
    if (updateTimerRef.current) {
      clearTimeout(updateTimerRef.current);
      updateTimerRef.current = null;
    }
    console.log('[客户端] ========== 停止实时日志完成 ==========');
  };

  // 发送心跳
  const sendHeartbeat = async (connId: string) => {
    try {
      const response = await fetch('/api/loki/heartbeat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ connectionId: connId }),
      });

      if (!response.ok) {
        console.warn(`[客户端] 心跳发送失败 [${connId}]:`, response.status, response.statusText);
      } else {
        const data = await response.json();
        if (data.status === 'ok') {
          console.log(`[客户端] 心跳已发送 [${connId}]`);
        }
      }
    } catch (error) {
      console.error(`[客户端] 发送心跳时出错 [${connId}]:`, error);
    }
  };

  // 启动实时日志
  const startLiveLogs = () => {
    console.log('[客户端] ========== 开始启动实时日志 ==========');
    if (!url || url.length < 1) {
      message.warning('请输入 Loki 服务器地址');
      return;
    }
    if (!filterQuery || filterQuery.length < 1) {
      message.warning('请输入 LogQL 查询');
      return;
    }

    // 停止之前的连接
    console.log('[客户端] startLiveLogs: 准备停止之前的连接');
    stopLiveLogs();
    console.log('[客户端] startLiveLogs: 停止之前的连接完成');

    // 先更新 ref，再更新 state（ref 是同步的）
    isLiveModeRef.current = true;
    setIsLiveMode(true);
    console.log('[客户端] startLiveLogs: 已设置 isLiveMode = true, ref =', isLiveModeRef.current);
    setErrorMessage('');
    setHasExecutedQuery(true);
    setLiveLogsCount(0);
    // 重置滚动状态
    userScrolledRef.current = false;
    lastScrollTopRef.current = 0;
    isScrollingRef.current = false;
    setAutoScroll(true); // 启动时默认开启自动滚动（用户滚动到底部时会自动恢复）

    // 启动时立即滚动到底部
    setTimeout(() => {
      isScrollingRef.current = true;
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
      setTimeout(() => {
        isScrollingRef.current = false;
        lastScrollTopRef.current = window.scrollY || document.documentElement.scrollTop;
      }, 500);
    }, 100);

    // 清空之前的日志和缓冲区，避免累积过多导致性能问题
    setLogs([]);
    logBufferRef.current = [];
    logsLengthRef.current = 0;
    if (updateTimerRef.current) {
      clearTimeout(updateTimerRef.current);
      updateTimerRef.current = null;
    }

    // 构建 SSE URL
    // 实时日志模式下不使用时间条件，始终从当前时间开始获取最新日志
    const searchParams = new URLSearchParams({
      url,
      query: filterQuery,
      limit: '50',
    });

    // 通过代理服务器建立 SSE 连接
    const sseUrl = `/api/loki/tail?${searchParams.toString()}`;
    const es = new EventSource(sseUrl);

    // 立即保存 EventSource 引用，以便在停止时能够关闭
    setEventSource(es);

    es.onopen = () => {
      console.log('实时日志连接已建立');
      // 再次检查状态，防止在连接建立前就停止了
      if (!isLiveModeRef.current) {
        console.log('实时模式已停止，关闭连接');
        es.close();
        return;
      }
    };

    es.onmessage = (event) => {
      // 如果已经停止实时模式，忽略所有消息
      if (!isLiveModeRef.current) {
        console.log('[客户端] EventSource 收到消息，但实时模式已停止，忽略消息');
        // 注意：不要在消息处理函数中调用 close()，这可能导致问题
        // 关闭操作应该在 stopLiveLogs() 中统一处理
        return;
      }

      try {
        // 处理心跳消息（以冒号开头的消息，SSE 注释格式）
        if (event.data.trim().startsWith(':')) {
          console.log('[客户端] 收到心跳消息（注释格式）:', event.data.trim());
          return;
        }

        const data = JSON.parse(event.data);

        // 处理连接ID消息，收到后开始发送心跳
        if (data.type === 'connectionId' && data.connectionId) {
          const connId = data.connectionId;
          console.log(`[客户端] 收到连接ID: ${connId}，开始发送心跳`);
          setConnectionId(connId);

          // 立即发送一次心跳
          sendHeartbeat(connId);

          // 设置定时发送心跳（每10秒）
          if (heartbeatTimerRef.current) {
            clearInterval(heartbeatTimerRef.current);
          }
          heartbeatTimerRef.current = setInterval(() => {
            if (isLiveModeRef.current && connId) {
              sendHeartbeat(connId);
            } else {
              // 如果已停止，清除定时器
              if (heartbeatTimerRef.current) {
                clearInterval(heartbeatTimerRef.current);
                heartbeatTimerRef.current = null;
              }
            }
          }, 10000); // 每10秒发送一次心跳
          return;
        }

        // 处理心跳消息（data 格式）
        if (data.type === 'heartbeat') {
          console.log('[客户端] 收到心跳消息:', new Date(data.timestamp).toLocaleTimeString());
          return;
        }

        // 处理连接确认消息
        if (data.type === 'connected') {
          console.log('实时日志连接已确认:', data.message);
          setErrorMessage('');
          return;
        }

        // 处理错误消息
        if (data.type === 'error' || data.error) {
          console.error('实时日志错误:', data.error || data.message);
          setErrorMessage(data.error || data.message || '实时日志连接错误，请检查服务器配置');
          return;
        }

        // 处理关闭消息
        if (data.type === 'closed') {
          console.log('实时日志连接已关闭:', data.message);
          stopLiveLogs();
          return;
        }

        // 处理日志流数据
        if (data.streams && Array.isArray(data.streams)) {
          // 再次检查状态，防止在处理过程中停止
          if (!isLiveModeRef.current) {
            console.log('[客户端] 收到日志流数据，但实时模式已停止，忽略数据');
            console.log('[客户端] isLiveModeRef.current =', isLiveModeRef.current);
            return;
          }

          const newLogs: Array<[string, string]> = [];

          data.streams.forEach((stream: any) => {
            if (stream.values && Array.isArray(stream.values)) {
              stream.values.forEach((value: [string, string]) => {
                // 尝试解析 JSON
                try {
                  const parsed = JSON.parse(value[1]);
                  newLogs.push([value[0], parsed.log || value[1]]);
                } catch {
                  newLogs.push(value);
                }
              });
            }
          });

          if (newLogs.length > 0) {
            // 将新日志添加到缓冲区
            logBufferRef.current.push(...newLogs);
            setLiveLogsCount((prev) => prev + newLogs.length);

            // 如果缓冲区积累的日志较多（超过20条），立即更新，否则使用防抖延迟更新
            // 或者如果当前没有日志（首次显示），立即更新
            const shouldFlushImmediately = logBufferRef.current.length > 20 || logsLengthRef.current === 0;

            // 使用防抖批量更新，避免频繁触发状态更新
            if (updateTimerRef.current) {
              clearTimeout(updateTimerRef.current);
              updateTimerRef.current = null;
            }

            const flushLogs = () => {
              const logsToAdd = logBufferRef.current;
              logBufferRef.current = [];

              if (logsToAdd.length === 0) return;

              setLogs((prevLogs) => {
                // 使用 Map 来快速去重和保持顺序（基于时间戳+消息内容）
                const logMap = new Map<string, [string, string]>();

                // 先添加现有日志（保持已有顺序）
                prevLogs.forEach((log) => {
                  const key = `${log[0]}|${log[1]}`;
                  if (!logMap.has(key)) {
                    logMap.set(key, log);
                  }
                });

                // 添加新日志（去重）
                logsToAdd.forEach((log) => {
                  const key = `${log[0]}|${log[1]}`;
                  if (!logMap.has(key)) {
                    logMap.set(key, log);
                  }
                });

                // 限制日志数量，最多保留 3000 条，防止内存泄漏和性能问题
                const maxLogs = 3000;

                // 如果日志数量超过限制，先删除最旧的
                if (logMap.size > maxLogs) {
                  // 转换为数组并排序
                  const allLogs = Array.from(logMap.values());
                  allLogs.sort((a, b) => {
                    const tsA = parseInt(a[0]) || 0;
                    const tsB = parseInt(b[0]) || 0;
                    return tsA - tsB;
                  });
                  // 保留最新的日志（删除最旧的）
                  const result = allLogs.slice(-maxLogs);
                  logsLengthRef.current = result.length;
                  return result;
                }

                // 转换为数组并排序
                const allLogs = Array.from(logMap.values());

                // 如果日志数量较少，直接排序
                if (allLogs.length <= 1000) {
                  allLogs.sort((a, b) => {
                    const tsA = parseInt(a[0]) || 0;
                    const tsB = parseInt(b[0]) || 0;
                    return tsA - tsB;
                  });
                  logsLengthRef.current = allLogs.length;
                  return allLogs;
                }

                // 如果日志数量较多，使用更高效的排序策略
                // 由于实时日志通常是按时间顺序到达的，大部分情况下只需要对新日志排序
                if (prevLogs.length > 0 && logsToAdd.length > 0) {
                  // 检查现有日志是否已经有序
                  const lastTimestamp = parseInt(prevLogs[prevLogs.length - 1][0]) || 0;
                  const firstNewTimestamp = logsToAdd.reduce((min, log) => {
                    const ts = parseInt(log[0]) || 0;
                    return ts < min ? ts : min;
                  }, Infinity);

                  if (firstNewTimestamp >= lastTimestamp) {
                    // 新日志都在现有日志之后，直接追加（不需要排序）
                    const newLogsSorted = logsToAdd
                      .filter(log => {
                        const key = `${log[0]}|${log[1]}`;
                        return !logMap.has(key) || logMap.get(key) === log;
                      })
                      .sort((a, b) => {
                        const tsA = parseInt(a[0]) || 0;
                        const tsB = parseInt(b[0]) || 0;
                        return tsA - tsB;
                      });
                    const result = [...prevLogs, ...newLogsSorted];
                    logsLengthRef.current = result.length;
                    return result;
                  }
                }

                // 需要完整排序
                allLogs.sort((a, b) => {
                  const tsA = parseInt(a[0]) || 0;
                  const tsB = parseInt(b[0]) || 0;
                  return tsA - tsB;
                });

                // 更新日志长度引用
                logsLengthRef.current = allLogs.length;
                return allLogs;
              });
            };

            // 如果是首次显示，立即更新
            if (shouldFlushImmediately || logsLengthRef.current === 0) {
              // 立即更新，使用 requestAnimationFrame 确保在下一帧渲染
              // 这样可以避免阻塞主线程，同时又能快速显示日志
              requestAnimationFrame(() => {
                flushLogs();
              });
            } else {
              // 延迟更新，减少更新频率
              updateTimerRef.current = setTimeout(() => {
                flushLogs();
                updateTimerRef.current = null;
              }, 50); // 50ms 批量更新一次，减少延迟
            }
          }
        }
      } catch (error) {
        console.error('解析实时日志数据失败:', error);
      }
    };

    es.onerror = (error) => {
      console.error('实时日志连接错误:', error);
      // 如果已经停止，忽略错误
      if (!isLiveModeRef.current) {
        return;
      }

      // 检查连接状态
      if (es.readyState === EventSource.CLOSED) {
        setErrorMessage('实时日志连接已断开，请检查：1. 代理服务器是否运行（npm run proxy）2. Loki服务器地址是否正确 3. 网络连接是否正常');
        stopLiveLogs();
      } else if (es.readyState === EventSource.CONNECTING) {
        setErrorMessage('正在连接实时日志服务...');
      } else {
        // 不要立即停止，等待服务器发送错误消息或连接超时
        console.warn('EventSource 连接状态异常，但继续等待...');
      }
    };
  };

  // 执行查询
  const runQuery = async () => {
    // 如果正在实时模式，先停止
    if (isLiveMode) {
      stopLiveLogs();
    }

    if (!url || url.length < 1) {
      message.warning('请输入 Loki 服务器地址');
      return;
    }
    if (!filterQuery || filterQuery.length < 1) {
      message.warning('请输入 LogQL 查询');
      return;
    }

    const startNano = dateStringToNano(filterStart);
    const endNano = dateStringToNano(filterEnd);

    const query = {
      url,
      query: filterQuery,
      start: startNano,
      end: endNano,
      limit: 5000,
    };

    // 更新 URL
    const searchParams = new URLSearchParams({
      url: query.url,
      query: query.query,
      start: query.start.toString(),
      end: query.end.toString(),
    }).toString();
    window.history.pushState({}, '', `?${searchParams}`);

    setLoading(true);
    setErrorMessage('');
    setHasExecutedQuery(true);
    setLogs([]);

    try {
      const response: QueryRangeResult = await queryRange(query);
      if (response.status === 'success' && response.data?.result) {
        const allLogs: Array<[string, string]> = [];
        response.data.result.forEach((res) => {
          res.values.forEach((value) => {
            // 尝试解析 JSON
            try {
              const parsed = JSON.parse(value[1]);
              allLogs.push([value[0], parsed.log || value[1]]);
            } catch {
              allLogs.push(value);
            }
          });
        });

        // 按时间戳升序排序（旧的在上，新的在下）
        allLogs.sort((a, b) => {
          const tsA = parseInt(a[0]) || 0;
          const tsB = parseInt(b[0]) || 0;
          return tsA - tsB; // 升序：时间戳小的在前，大的在后
        });

        setLogs(allLogs);
      } else {
        setErrorMessage('查询失败：响应格式错误');
      }
    } catch (error: any) {
      setErrorMessage(`查询失败：${error.message || '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  // 保存预设
  const handleSavePreset = () => {
    const preset = {
      url,
      query: filterQuery,
      start: dateStringToNano(filterStart),
      end: dateStringToNano(filterEnd),
      limit: 5000,
    };
    savePreset(preset);
    message.success('预设已保存');
  };

  // 加载预设
  const handleLoadPreset = () => {
    const preset = getPreset();
    if (!preset) {
      message.warning('没有保存的预设');
      return;
    }

    setUrl(preset.url);
    setFilterQuery(preset.query);
    setFilterStart(nanoToDateString(preset.start));
    setFilterEnd(nanoToDateString(preset.end));
    message.success('预设已加载');
  };


  // 日志列表（不过滤，只用于高亮显示）
  // 所有模式下都不过滤日志，只进行高亮显示
  const filteredLogs = useMemo(() => {
    return logs;
  }, [logs]);

  // 表格列定义 - 使用 useMemo 缓存
  const columns = useMemo(() => [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      width: 200,
      render: (time: string) => nanoToFormattedDate(time),
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
      render: (msg: string) => (
        <div dangerouslySetInnerHTML={{ __html: highlightKeyword(msg, debouncedSearchKeyword) }} />
      ),
    },
  ], [debouncedSearchKeyword]);

  // 表格数据 - 使用 useMemo 缓存，限制显示数量以提高性能
  const tableData = useMemo(() => {
    // 实时模式下，只显示最新的 2000 条日志以提高性能
    const displayLogs = isLiveMode && filteredLogs.length > 2000
      ? filteredLogs.slice(-2000)
      : filteredLogs;

    return displayLogs.map((log, index) => ({
      key: `${log[0]}-${index}`, // 使用时间戳+索引作为key，更稳定
      time: log[0],
      message: log[1],
    }));
  }, [filteredLogs, isLiveMode]);

  return (
    <div className={styles.container}>
      <Card
        title={
          <div className={styles.cardHeader}>
            <span>查询过滤器</span>
            <Button
              type="text"
              icon={filtersCollapsed ? <UpOutlined /> : <UpOutlined rotate={180} />}
              onClick={() => setFiltersCollapsed(!filtersCollapsed)}
            />
          </div>
        }
        className={styles.filterCard}
      >
        <Collapse activeKey={filtersCollapsed ? [] : ['1']} ghost>
          <Panel key="1" header={null} showArrow={false}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Server URL */}
              <div style={{ marginTop: '-8px' }}>
                <label className={styles.label}>服务器地址</label>
                <Space>
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://your-loki-server.com"
                    style={{ width: 400 }}
                  />
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={fetchLabels}
                    loading={loadingLabels}
                    disabled={!url || url.length < 1}
                  >
                    刷新 Labels
                  </Button>
                </Space>
              </div>

              {/* Labels */}
              {(labels.length > 0 || loadingLabels || labelsError) && (
                <div>
                  <div className={styles.labelHeader}>
                    <label className={styles.label}>Labels</label>
                  </div>
                  {labelsError && (
                    <AlertMessage message={labelsError} type="error" />
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', width: '100%', alignItems: 'center' }}>
                    {labelFilters.map((filter) => {
                      // 获取已经被其他 filter 使用的 labels
                      const usedLabels = labelFilters
                        .filter((f) => f.id !== filter.id && f.label)
                        .map((f) => f.label);

                      // 过滤掉已被使用的 labels，但保留当前 filter 自己选中的 label
                      const availableLabels = labels.filter(
                        (label) => !usedLabels.includes(label) || label === filter.label
                      );

                      return (
                      <div key={filter.id} className="label-filter-container" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '360px', flex: '0 0 auto' }}>
                        <Select
                          value={filter.label || undefined}
                          onChange={(value) => handleLabelChange(filter.id, value || '')}
                          placeholder="Label"
                          style={{ width: '160px' }}
                          size="small"
                          disabled={loadingLabels}
                          getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
                          allowClear
                        >
                          {availableLabels.map((label) => (
                            <Option key={label} value={label}>
                              {label}
                            </Option>
                          ))}
                        </Select>
                        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                          <Select
                            value={filter.value || undefined}
                            onChange={(value) => handleLabelValueChange(filter.id, value || '')}
                            placeholder={
                              filter.loading
                                ? '加载中...'
                                : !filter.label
                                ? '请先选择 Label'
                                : filter.values.length === 0
                                ? '无可用值'
                                : 'Value'
                            }
                            style={{ width: '160px' }}
                            size="small"
                            disabled={!filter.label || filter.loading || filter.values.length === 0}
                            loading={filter.loading}
                            getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
                            allowClear
                          >
                            {filter.values.map((val) => (
                              <Option key={val} value={val}>
                                {val}
                              </Option>
                            ))}
                          </Select>
                          {filter.error && (
                            <div className="error-text" style={{ position: 'absolute', top: '100%', left: 0, marginTop: '4px', zIndex: 10, whiteSpace: 'nowrap' }}>
                              {filter.error}
                            </div>
                          )}
                        </div>
                        {labelFilters.length > 1 && (
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => removeLabelFilter(filter.id)}
                            size="small"
                          />
                        )}
                      </div>
                      );
                    })}
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={addLabelFilter}
                      size="small"
                      shape="circle"
                    />
                  </div>
                </div>
              )}

              {/* Search Keyword */}
              <div>
                <label className={styles.label}>关键词搜索</label>
                <Space>
                  <Input
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="输入关键词过滤日志"
                    style={{ width: 400 }}
                  />
                  <Checkbox
                    checked={caseSensitive}
                    onChange={(e) => setCaseSensitive(e.target.checked)}
                    title={caseSensitive ? '当前：区分大小写（点击切换为不区分）' : '当前：不区分大小写（点击切换为区分）'}

                  >
                    <span style={{ color: '#d1d5db', fontSize: '14px' }}>区分大小写</span>
                  </Checkbox>
                </Space>
              </div>

              {/* LogQL Query */}
              <div>
                <label className={styles.label}>LogQL 查询</label>
                <TextArea
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder='{app="my-app"} |= "error"'
                  rows={2}
                />
              </div>

              {/* Date Range */}
              <div>
                <Row gutter={16} align="bottom">
                  <Col span={6}>
                    <label className={styles.label}>日期范围</label>
                    <Select
                      value={selectedDateRange}
                      onChange={handleDateRangeChange}
                      style={{ width: '100%' }}
                      className="date-range-select"
                      getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
                    >
                      {DATE_RANGES.map((range) => (
                        <Option key={range.value} value={range.value}>
                          {range.label}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={9}>
                    <label className={styles.label}>开始时间</label>
                    <Input
                      type="datetime-local"
                      value={filterStart}
                      onChange={(e) => {
                        setFilterStart(e.target.value);
                        setSelectedDateRange('custom');
                      }}
                      className="date-input"
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col span={9}>
                    <label className={styles.label}>结束时间</label>
                    <Input
                      type="datetime-local"
                      value={filterEnd}
                      onChange={(e) => {
                        setFilterEnd(e.target.value);
                        setSelectedDateRange('custom');
                      }}
                      className="date-input"
                      style={{ width: '100%' }}
                    />
                  </Col>
                </Row>
              </div>

            </Space>
          </Panel>
        </Collapse>

        {/* Actions */}
        <div className={styles.actions}>
          <Space>
            <div style={{ marginLeft: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: '#d1d5db', fontSize: 14 }}>实时日志</span>
              <Button
                type={isLiveMode ? 'primary' : 'default'}
                danger={isLiveMode}
                onClick={(e) => {
                  console.log('[客户端] ===== 按钮点击事件开始 =====');
                  console.log('[客户端] 按钮被点击, isLiveMode (state) =', isLiveMode);
                  console.log('[客户端] 按钮被点击, isLiveModeRef.current =', isLiveModeRef.current);
                  console.log('[客户端] event:', e);

                  // 使用 ref 来判断，因为 ref 是同步的，不会有时序问题
                  const currentLiveMode = isLiveModeRef.current;
                  console.log('[客户端] 使用 ref 判断, currentLiveMode =', currentLiveMode);

                  if (currentLiveMode) {
                    console.log('[客户端] 准备调用 stopLiveLogs()');
                    try {
                      stopLiveLogs();
                      console.log('[客户端] stopLiveLogs() 调用完成');
                    } catch (error) {
                      console.error('[客户端] stopLiveLogs() 调用出错:', error);
                      console.error('[客户端] 错误堆栈:', error.stack);
                    }
                  } else {
                    console.log('[客户端] 准备调用 startLiveLogs()');
                    try {
                      startLiveLogs();
                      console.log('[客户端] startLiveLogs() 调用完成');
                    } catch (error) {
                      console.error('[客户端] startLiveLogs() 调用出错:', error);
                      console.error('[客户端] 错误堆栈:', error.stack);
                    }
                  }
                  console.log('[客户端] ===== 按钮点击事件结束 =====');
                }}
                size="small"
              >
                {isLiveMode ? '停止' : '开始'}
              </Button>
              {isLiveMode && (
                <span style={{ color: '#9ca3af', fontSize: 12 }}>
                  已接收 {liveLogsCount} 条新日志
                </span>
              )}
            </div>
          </Space>
          {!isLiveMode && (
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={runQuery}
              loading={loading}
              size="large"
            >
              执行查询
            </Button>
          )}
        </div>
      </Card>

      {/* Error Message */}
      {errorMessage && <AlertMessage message={errorMessage} type="error" />}

      {/* Real-time mode waiting message */}
      {isLiveMode && logs.length === 0 && !errorMessage && (
        <AlertMessage message="实时日志连接已建立，正在等待新日志..." type="info" />
      )}

      {/* No Results */}
      {hasExecutedQuery && logs.length === 0 && !errorMessage && !isLiveMode && (
        <AlertMessage message="未找到指定查询和时间范围内的日志。" type="info" />
      )}

      {/* Logs Table */}
      {logs.length > 0 && (
        <Card
          title={
            <div className={styles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span>
                  查询结果
                  {isLiveMode && (
                    <span style={{ marginLeft: 8, color: '#fbbf24', fontSize: 12 }}>
                      ● 实时模式
                    </span>
                  )}
                </span>
                {isLiveMode && (
                  <Button
                    size="small"
                    onClick={() => {
                      setLogs([]);
                      setLiveLogsCount(0);
                    }}
                  >
                    清空
                  </Button>
                )}
              </div>

            </div>
          }
          className={styles.logsCard}
        >
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={
              isLiveMode
                ? false
                : {
                    pageSize: 50,
                    showSizeChanger: true,
                    showTotal: (total) => `共 ${total} 条`,
                  }
            }
            scroll={{
              x: 'max-content',
              y: isLiveMode ? 600 : undefined,
              scrollToFirstRowOnChange: false // 避免自动滚动导致的性能问题
            }}
            loading={loading && !isLiveMode}
            size="middle"
            rowKey="key"
          />
        </Card>
      )}

      {/* Scroll to Top */}
      {showScrollToTop && (
        <Button
          type="primary"
          shape="circle"
          icon={<UpOutlined />}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={styles.scrollToTop}
        />
      )}
    </div>
  );
};

export default LokiViewer;
