// 使用统一的 request 工具，与其他业务保持一致
import request from '@/utils/request';

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
 * 使用统一的 request 工具，通过 globalConstant 构建 URL
 */
export async function queryRange(params: QueryRangeParams): Promise<QueryRangeResult> {
  const { url, query, start, end, limit = 5000 } = params;
  
  return request<QueryRangeResult>('/devopsCore/loki/query_range', {
    method: 'GET',
    params: {
      url,
      query,
      start: start.toString(),
      end: end.toString(),
      limit: limit.toString(),
    },
    b: 'query_range'
  });
}

/**
 * 获取所有 labels
 * 使用统一的 request 工具，通过 globalConstant 构建 URL
 * @param lokiUrl Loki 服务器地址
 * @param start 开始时间（纳秒时间戳，可选）
 * @param end 结束时间（纳秒时间戳，可选）
 */
export async function getLabels(
  lokiUrl: string,
  start?: number,
  end?: number,
): Promise<LabelsResponse> {
  const params: any = {
    url: lokiUrl,
  };
  
  // 添加时间范围参数（如果提供）
  if (start !== undefined) {
    params.start = start.toString();
  }
  if (end !== undefined) {
    params.end = end.toString();
  }
  
  return request<LabelsResponse>('/devopsCore/loki/labels', {
    method: 'GET',
    params,
    b: 'labels',
  });
}

/**
 * 获取特定 label 的所有值
 * 使用统一的 request 工具，通过 globalConstant 构建 URL
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
  const params: any = {
    url: lokiUrl,
    name: labelName,
  };
  
  // 添加时间范围参数（如果提供）
  if (start !== undefined) {
    params.start = start.toString();
  }
  if (end !== undefined) {
    params.end = end.toString();
  }
  
  return request<LabelValuesResponse>('/devopsCore/loki/label/values', {
    method: 'GET',
    params,
    b: 'label_values'
  });
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
