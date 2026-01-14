/**
 * 简单的 Loki API 代理服务器
 * 用于解决 CORS 问题
 * 
 * 使用方法：
 * 1. npm install express cors node-fetch ws uuid
 * 2. node server/proxy-server.js
 * 3. 确保 config/config.ts 中已启用 proxy 配置
 * 
 * 注意：此服务器必须运行，否则前端无法获取 labels
 */

const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

// 连接管理：存储每个实时日志连接的信息
const activeConnections = new Map(); // key: connectionId, value: { isClosed, streamReader, res, cleanup, heartbeatTimer, lastHeartbeat }

// 心跳配置
const HEARTBEAT_INTERVAL = 10000; // 客户端心跳间隔（毫秒），建议10秒
const HEARTBEAT_TIMEOUT = 30000; // 心跳超时时间（毫秒），30秒未收到心跳则认为断开

// 尝试加载 WebSocket 库
let WebSocket;
try {
  WebSocket = require('ws');
} catch (e) {
  console.error('需要安装 ws 包: npm install ws');
  process.exit(1);
}

// 使用 node-fetch（Node.js < 18）或原生 fetch（Node.js 18+）
let fetch;
try {
  fetch = require('node-fetch');
} catch (e) {
  if (typeof global.fetch === 'function') {
    fetch = global.fetch;
  } else {
    console.error('需要安装 node-fetch 或使用 Node.js 18+');
    process.exit(1);
  }
}

// ==================== 常量定义 ====================
const WS_CLOSE_CODE = {
  NORMAL: 1000,
  GOING_AWAY: 1001,
  PROTOCOL_ERROR: 1002,
  UNSUPPORTED_DATA: 1003,
  ABNORMAL_CLOSURE: 1006,
  INVALID_DATA: 1007,
  POLICY_VIOLATION: 1008,
  MESSAGE_TOO_BIG: 1009,
  MANDATORY_EXTENSION: 1010,
  INTERNAL_ERROR: 1011,
};

const WS_CLOSE_REASON = 'Normal closure';

// ==================== 工具函数 ====================

/**
 * 检查连接是否已关闭
 */
function isConnectionClosed(connectionInfo) {
  if (!connectionInfo) return true;
  // 简化状态判断，只依赖 connectionInfo 中的统一状态
  return connectionInfo.isClosed || 
         connectionInfo.res?.destroyed || 
         connectionInfo.res?.writableEnded || 
         !connectionInfo.res?.writable;
}

/**
 * 安全写入 SSE 消息
 */
function writeSSE(connectionInfo, data) {
  const { isClosed, res, connectionId } = connectionInfo;
  try {
    if (isConnectionClosed(connectionInfo)) {
      return false;
    }
    const message = typeof data === 'string' ? data : `data: ${JSON.stringify(data)}\n\n`;
    res.write(message);
    return true;
  } catch (error) {
    if (connectionId) {
      console.log(`[服务器] 写入 SSE 消息失败 [${connectionId}]:`, error.message);
      // 写入失败时主动触发清理
      connectionInfo.cleanup?.();
    }
    return false;
  }
}

/**
 * 关闭 WebSocket 连接
 */
function closeWebSocket(ws, connectionId = null, context = '') {
  if (!ws) return false;
  
  try {
    const state = ws.readyState;
    if (state === WebSocket.OPEN || state === WebSocket.CONNECTING) {
      // 移除所有事件监听器
      ws.removeAllListeners('message');
      ws.removeAllListeners('error');
      ws.removeAllListeners('close');
      ws.removeAllListeners('open');
      
      // 优雅关闭
      ws.close(WS_CLOSE_CODE.NORMAL, WS_CLOSE_REASON);
      
      if (connectionId && context) {
        console.log(`[服务器] ${context} [${connectionId}]: WebSocket 已关闭 (状态码: ${WS_CLOSE_CODE.NORMAL})`);
      }
      return true;
    } else {
      if (connectionId && context) {
        console.log(`[服务器] ${context} [${connectionId}]: WebSocket 状态 = ${state}，无需关闭`);
      }
      return false;
    }
  } catch (error) {
    if (connectionId && context) {
      console.error(`[服务器] ${context} [${connectionId}]: 关闭 WebSocket 时出错:`, error);
    }
    return false;
  }
}

/**
 * 记录 WebSocket 关闭信息
 */
function logWebSocketClose(code, reason, connectionId) {
  console.log('[服务器] ========== Loki WebSocket 连接已关闭 ==========');
  console.log(`[服务器] 连接 ID: ${connectionId}`);
  console.log(`[服务器] 关闭状态码: ${code}`);
  console.log(`[服务器] 关闭原因: ${reason?.toString() || '(无)'}`);
  
  // 状态码说明
  const codeDescriptions = {
    [WS_CLOSE_CODE.NORMAL]: 'Normal Closure (正常关闭)',
    [WS_CLOSE_CODE.GOING_AWAY]: 'Going Away (端点离开)',
    [WS_CLOSE_CODE.PROTOCOL_ERROR]: 'Protocol Error (协议错误)',
    [WS_CLOSE_CODE.UNSUPPORTED_DATA]: 'Unsupported Data (不支持的数据类型)',
    [WS_CLOSE_CODE.ABNORMAL_CLOSURE]: 'Abnormal Closure (异常关闭)',
    [WS_CLOSE_CODE.INVALID_DATA]: 'Invalid frame payload data (无效的帧数据)',
    [WS_CLOSE_CODE.POLICY_VIOLATION]: 'Policy Violation (策略违反)',
    [WS_CLOSE_CODE.MESSAGE_TOO_BIG]: 'Message Too Big (消息太大)',
    [WS_CLOSE_CODE.MANDATORY_EXTENSION]: 'Mandatory Extension (必需的扩展)',
    [WS_CLOSE_CODE.INTERNAL_ERROR]: 'Internal Server Error (内部服务器错误)',
  };
  
  const description = codeDescriptions[code] || 'Unknown';
  console.log(`[服务器] 状态码说明: ${code} = ${description}`);
  console.log('[服务器] ============================================');
}

/**
 * 将 HTTP URL 转换为 WebSocket URL
 */
function convertToWebSocketUrl(url) {
  if (url.startsWith('https://')) {
    return url.replace(/^https:/, 'wss:');
  } else if (url.startsWith('http://')) {
    return url.replace(/^http:/, 'ws:');
  } else {
    return `ws://${url}`;
  }
}

/**
 * 通用的 Loki API 请求处理函数
 */
async function handleLokiApiRequest(req, res, endpoint, errorMessage) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      status: 'error',
      message: 'Loki URL is required',
    });
  }

  try {
    const response = await fetch(`${url}${endpoint}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        status: 'error',
        message: errorText || response.statusText,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || errorMessage,
    });
  }
}

// ==================== Express 应用 ====================
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// 获取所有 labels
app.get('/api/loki/labels', async (req, res) => {
  await handleLokiApiRequest(req, res, '/loki/api/v1/labels', 'Failed to fetch labels from Loki server');
});

// 获取特定 label 的所有值
app.get('/api/loki/label/:name/values', async (req, res) => {
  const { name } = req.params;

  if (!name) {
    return res.status(400).json({
      status: 'error',
      message: 'Label name is required',
    });
  }

  const safeLabelName = encodeURIComponent(name);
  await handleLokiApiRequest(req, res, `/loki/api/v1/label/${safeLabelName}/values`, `Failed to fetch values for label ${name}`);
});

// 查询日志范围
app.get('/api/loki/query_range', async (req, res) => {
  const { url, query, start, end, limit } = req.query;

  if (!url) {
    return res.status(400).json({
      status: 'error',
      message: 'Loki URL is required',
    });
  }

  if (!query) {
    return res.status(400).json({
      status: 'error',
      message: 'Query is required',
    });
  }

  if (!start || !end) {
    return res.status(400).json({
      status: 'error',
      message: 'Start and end time are required',
    });
  }

  try {
    const searchParams = new URLSearchParams({
      query,
      start: start.toString(),
      end: end.toString(),
      limit: (limit || 5000).toString(),
    });

    const response = await fetch(`${url}/loki/api/v1/query_range?${searchParams.toString()}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        status: 'error',
        message: errorText || response.statusText,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch query range from Loki server',
    });
  }
});

// 接收客户端心跳
app.post('/api/loki/heartbeat', (req, res) => {
  const { connectionId } = req.body;

  if (!connectionId) {
    return res.status(400).json({
      status: 'error',
      message: 'Connection ID is required',
    });
  }

  const connectionInfo = activeConnections.get(connectionId);
  
  if (!connectionInfo) {
    return res.status(404).json({
      status: 'error',
      message: 'Connection not found',
    });
  }

  if (connectionInfo.isClosed) {
    return res.status(410).json({
      status: 'error',
      message: 'Connection already closed',
    });
  }

  // 更新最后心跳时间
  const now = Date.now();
  const previousHeartbeat = connectionInfo.lastHeartbeat;
  const timeSinceLastHeartbeat = previousHeartbeat ? now - previousHeartbeat : 0;
  connectionInfo.lastHeartbeat = now;
  
  // 打印心跳日志
  console.log(`[服务器] ========== 收到客户端心跳 [${connectionId}] ==========`);
  console.log(`[服务器] 心跳时间: ${new Date(now).toISOString()}`);
  if (previousHeartbeat) {
    console.log(`[服务器] 上次心跳时间: ${new Date(previousHeartbeat).toISOString()}`);
    console.log(`[服务器] 心跳间隔: ${timeSinceLastHeartbeat}ms`);
  }
  console.log(`[服务器] ===========================================`);
  
  // 返回成功响应
  res.json({
    status: 'ok',
    message: 'Heartbeat received',
    connectionId,
  });
});

// 实时日志流（Server-Sent Events）
// 注意：这个路由不使用 express.json() 中间件，避免影响 SSE 连接
app.get('/api/loki/tail', (req, res) => {
  const { url, query, start, limit, delayFor } = req.query;

  if (!url) {
    res.status(400).json({
      status: 'error',
      message: 'Loki URL is required',
    });
    return;
  }

  if (!query) {
    res.status(400).json({
      status: 'error',
      message: 'Query is required',
    });
    return;
  }

  // 验证查询参数是否看起来像有效的 LogQL 查询
  // LogQL 查询通常包含花括号 {} 或管道符 |，或者至少包含一些标签
  const decodedQuery = decodeURIComponent(query);
  const looksLikeUrl = decodedQuery.startsWith('http://') || decodedQuery.startsWith('https://');
  
  if (looksLikeUrl) {
    console.error(`[服务器] ========== 查询参数错误 [${connectionId || 'unknown'}] ==========`);
    console.error(`[服务器] 查询参数看起来像 URL 而不是 LogQL: ${decodedQuery}`);
    console.error(`[服务器] 请检查前端是否正确传递了查询参数`);
    console.error(`[服务器] ===========================================`);
    
    res.status(400).json({
      status: 'error',
      message: 'Invalid query parameter: query appears to be a URL instead of a LogQL query',
      details: {
        received: decodedQuery,
        hint: 'LogQL queries should look like: {app="my-app"} |= "error"'
      }
    });
    return;
  }

  // 禁用超时，保持连接打开
  req.setTimeout(0);
  res.setTimeout(0);

  // 生成唯一的连接 ID
  const connectionId = uuidv4();
  
  console.log('[服务器] ========== 新的实时日志请求 ==========');
  console.log(`[服务器] 连接 ID: ${connectionId}`);
  console.log(`[服务器] 请求 URL: ${req.url}`);
  console.log(`[服务器] 请求 IP: ${req.ip || req.connection.remoteAddress}`);

  // ========== 核心修改 1：统一连接状态管理 ==========
  // 只维护一个连接信息对象，包含所有状态和清理方法
  const connectionInfo = {
    isClosed: false,
    streamReader: null,
    res: res,
    connectionId: connectionId,
    cleanup: null // 后续赋值清理函数
  };

  // ========== 核心修改 2：先设置 SSE 响应头 ==========
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no', // 禁用 nginx 缓冲，关键！
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
  });
  
  // 立即刷新响应头，确保 SSE 连接正确建立
  if (res.flushHeaders) {
    res.flushHeaders();
  }

  // ========== 核心修改 3：定义统一的清理函数 ==========
  // 所有断开事件都调用这个函数，避免重复逻辑
  const cleanup = () => {
    if (connectionInfo.isClosed) return;
    
    console.log(`[服务器] ========== 开始清理连接资源 [${connectionId}] ==========`);
    connectionInfo.isClosed = true;

    // 清除心跳计时器
    if (connectionInfo.heartbeatTimer) {
      clearTimeout(connectionInfo.heartbeatTimer);
      connectionInfo.heartbeatTimer = null;
    }

    // 关闭 Loki WebSocket 连接
    if (connectionInfo.streamReader) {
      closeWebSocket(connectionInfo.streamReader, connectionId, '客户端断开连接');
      connectionInfo.streamReader = null;
    }

    // 关闭 SSE 响应
    try {
      if (!res.destroyed && !res.writableEnded) {
        res.end(); // 优雅结束，而非 destroy
      }
    } catch (e) { /* 忽略 */ }

    // 从连接管理中移除
    activeConnections.delete(connectionId);

    console.log(`[服务器] ========== 连接资源清理完成 [${connectionId}] ==========`);
  };
  connectionInfo.cleanup = cleanup;

  // ========== 心跳检测机制 ==========
  // 初始化心跳时间戳
  connectionInfo.lastHeartbeat = Date.now();
  
  // 设置心跳超时检测
  const checkHeartbeat = () => {
    if (connectionInfo.isClosed) return;
    
    const now = Date.now();
    const timeSinceLastHeartbeat = now - connectionInfo.lastHeartbeat;
    
    if (timeSinceLastHeartbeat > HEARTBEAT_TIMEOUT) {
      console.log(`[服务器] ========== 心跳超时，断开连接 [${connectionId}] ==========`);
      console.log(`[服务器] 最后心跳时间: ${new Date(connectionInfo.lastHeartbeat).toISOString()}`);
      console.log(`[服务器] 当前时间: ${new Date(now).toISOString()}`);
      console.log(`[服务器] 超时时间: ${timeSinceLastHeartbeat}ms (阈值: ${HEARTBEAT_TIMEOUT}ms)`);
      cleanup();
      return;
    }
    
    // 继续检查
    connectionInfo.heartbeatTimer = setTimeout(checkHeartbeat, HEARTBEAT_INTERVAL);
  };
  
  // 启动心跳检测
  connectionInfo.heartbeatTimer = setTimeout(checkHeartbeat, HEARTBEAT_TIMEOUT);

  // 将连接信息存储到连接管理中
  activeConnections.set(connectionId, connectionInfo);

  // ========== 核心修改 4：添加所有断开监听事件（关键！） ==========
  // 1. 响应关闭事件（SSE 断开最核心的事件）
  res.on('close', () => {
    console.log(`[服务器] ========== res.on('close') 触发 [${connectionId}] ==========`);
    cleanup();
  });

  // 2. 请求中止事件（客户端主动取消请求）
  req.on('aborted', () => {
    console.log(`[服务器] ========== req.on('aborted') 触发 [${connectionId}] ==========`);
    cleanup();
  });

  // 3. 响应错误事件
  res.on('error', (error) => {
    console.log(`[服务器] ========== res.on('error') 触发 [${connectionId}]: ${error.message} ==========`);
    cleanup();
  });

  // 4. Socket 关闭事件（兜底）
  const socket = req.socket;
  if (socket) {
    socket.on('close', (hadError) => {
      if (hadError) {
        console.log(`[服务器] ========== socket.on('close') 触发（有错误） [${connectionId}] ==========`);
      } else {
        console.log(`[服务器] ========== socket.on('close') 触发 [${connectionId}] ==========`);
      }
      cleanup();
    });
  }

  // ========== 发送初始化消息 ==========
  writeSSE(connectionInfo, { type: 'connectionId', connectionId });
  writeSSE(connectionInfo, { type: 'connected', message: '实时日志连接已建立' });

  // ========== 创建 Loki WebSocket 连接 ==========
  try {
    const wsUrl = convertToWebSocketUrl(url);
    const tailParams = new URLSearchParams({
      query,
      limit: (limit || 100).toString(),
    });

    if (start) {
      tailParams.append('start', start.toString());
    }

    if (delayFor) {
      tailParams.append('delay_for', delayFor.toString());
    }

    const wsFullUrl = `${wsUrl}/loki/api/v1/tail?${tailParams.toString()}`;
    console.log(`[服务器] 连接 Loki WebSocket [${connectionId}]: ${wsFullUrl}`);
    console.log(`[服务器] 查询参数详情 [${connectionId}]:`);
    console.log(`[服务器]   - url: ${url}`);
    console.log(`[服务器]   - query: ${query}`);
    console.log(`[服务器]   - limit: ${limit || 100}`);
    if (start) console.log(`[服务器]   - start: ${start}`);
    if (delayFor) console.log(`[服务器]   - delayFor: ${delayFor}`);

    const ws = new WebSocket(wsFullUrl);
    connectionInfo.streamReader = ws;

    ws.on('open', () => {
      console.log(`[服务器] Loki WebSocket 连接已建立 [${connectionId}]`);
      writeSSE(connectionInfo, {
        type: 'connected',
        message: 'Loki tail WebSocket 连接已建立'
      });
    });

    ws.on('message', (data) => {
      // 检查连接是否已关闭
      if (isConnectionClosed(connectionInfo)) {
        closeWebSocket(ws, connectionId, '消息处理时连接已关');
        return;
      }

      try {
        const messageStr = typeof data === 'string' ? data : data.toString('utf8');
        const tailData = JSON.parse(messageStr);

        // 处理日志流数据
        if (tailData.streams && Array.isArray(tailData.streams)) {
          writeSSE(connectionInfo, { streams: tailData.streams });
        } else if (tailData.error) {
          // 处理错误
          console.error(`[服务器] Loki tail API 返回错误 [${connectionId}]:`, tailData.error);
          writeSSE(connectionInfo, {
            error: tailData.error,
            type: 'error'
          });
        } else {
          // 未知格式，尝试直接转发
          console.warn(`[服务器] 未知的 tail 数据格式 [${connectionId}]:`, tailData);
          writeSSE(connectionInfo, tailData);
        }
      } catch (parseError) {
        if (!isConnectionClosed(connectionInfo)) {
          console.error(`[服务器] 解析 WebSocket 消息失败 [${connectionId}]:`, parseError);
          console.error(`[服务器] 消息内容:`, data.toString().substring(0, 200));
          writeSSE(connectionInfo, {
            error: `解析消息失败: ${parseError.message}`,
            type: 'error'
          });
        }
      }
    });

    ws.on('error', (error) => {
      if (!connectionInfo.isClosed) {
        console.error(`[服务器] ========== Loki WebSocket 错误 [${connectionId}] ==========`);
        console.error(`[服务器] 错误信息:`, error.message || error);
        console.error(`[服务器] 错误堆栈:`, error.stack);
        console.error(`[服务器] 查询参数: ${query}`);
        console.error(`[服务器] 完整 URL: ${wsFullUrl}`);
        console.error(`[服务器] ===========================================`);
        writeSSE(connectionInfo, {
          error: `WebSocket 错误: ${error.message || '未知错误'}`,
          type: 'error',
          details: {
            query: query,
            url: wsFullUrl
          }
        });
      }
    });

    ws.on('close', (code, reason) => {
      logWebSocketClose(code, reason, connectionId);
      connectionInfo.streamReader = null;

      if (!connectionInfo.isClosed) {
        writeSSE(connectionInfo, {
          type: 'closed',
          message: `WebSocket 连接已关闭: ${code} ${reason?.toString() || ''}`
        });
        // Loki WS 关闭后，主动清理 SSE 连接
        cleanup();
      }
    });

  } catch (error) {
    if (!connectionInfo.isClosed) {
      console.error(`[服务器] 创建 Loki WebSocket 连接时发生错误 [${connectionId}]:`, error);
      writeSSE(connectionInfo, {
        error: `连接错误: ${error.message || '未知错误'}`,
        type: 'error'
      });
      // 创建失败时清理连接
      cleanup();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Loki API proxy server running on http://localhost:${PORT}`);
  console.log(`Make sure to enable proxy in config/config.ts`);
});
