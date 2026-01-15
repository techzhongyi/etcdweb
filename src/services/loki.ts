// 使用 umi-request 的原始 request，避免被 etcdweb 的自定义拦截器修改
import { extend } from 'umi-request';

// 创建一个独立的 request 实例，专门用于 Loki API，不经过 etcdweb 的自定义拦截器
const lokiRequest = extend({
  timeout: 30000,
  errorHandler: (error: any) => {
    console.error('Loki API 请求错误:', error);
    throw error;
  },
});

export interface QueryRangeParams {
  url: string;
  query: string;
  start: number;
  end: number;
  limit?: number;
}

export interface QueryRangeResult {
  status: string;
  data: {
    resultType: string;
    result: Array<{
      stream: Record<string, string>;
      values: Array<[string, string]>;
    }>;
  };
}

export interface LabelsResponse {
  status: string;
  data: string[];
}

export interface LabelValuesResponse {
  status: string;
  data: string[];
}

/**
 * 查询日志范围
 * 通过后端代理 API 调用，避免 CORS 问题
 */
export async function queryRange(params: QueryRangeParams): Promise<QueryRangeResult> {
  const { url, query, start, end, limit = 5000 } = params;
  
  const searchParams = new URLSearchParams({
    url,
    query,
    start: start.toString(),
    end: end.toString(),
    limit: limit.toString(),
  });
  
  return lokiRequest(`/api/loki/query_range?${searchParams.toString()}`);
}

/**
 * 获取所有 labels
 * 通过后端代理 API 调用，避免 CORS 问题
 * @param lokiUrl Loki 服务器地址
 * @param start 开始时间（纳秒时间戳，可选）
 * @param end 结束时间（纳秒时间戳，可选）
 */
export async function getLabels(
  lokiUrl: string,
  start?: number,
  end?: number,
): Promise<LabelsResponse> {
  const searchParams = new URLSearchParams({
    url: lokiUrl,
  });
  
  // 添加时间范围参数（如果提供）
  if (start !== undefined) {
    searchParams.append('start', start.toString());
  }
  if (end !== undefined) {
    searchParams.append('end', end.toString());
  }
  
  return lokiRequest(`/api/loki/labels?${searchParams.toString()}`);
}

/**
 * 获取特定 label 的所有值
 * 通过后端代理 API 调用，避免 CORS 问题
 * @param lokiUrl Loki 服务器地址
 * @param labelName 标签名称
 * @param start 开始时间（纳秒时间戳，可选）
 * @param end 结束时间（纳秒时间戳，可选）
 */
export async function getLabelValues(
  lokiUrl: string,
  labelName: string,
  start?: number,
  end?: number,
): Promise<LabelValuesResponse> {
  const searchParams = new URLSearchParams({
    url: lokiUrl,
  });
  
  // 添加时间范围参数（如果提供）
  if (start !== undefined) {
    searchParams.append('start', start.toString());
  }
  if (end !== undefined) {
    searchParams.append('end', end.toString());
  }
  
  return lokiRequest(`/api/loki/label/${encodeURIComponent(labelName)}/values?${searchParams.toString()}`);
}

/**
 * 实时日志流查询参数
 */
export interface QueryTailParams {
  url: string;
  query: string;
  delayFor?: number;
  limit?: number;
  start?: number;
}

/**
 * 实时日志流响应数据
 */
export interface TailStream {
  stream: Record<string, string>;
  values: Array<[string, string]>;
}
