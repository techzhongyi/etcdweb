import request from '@/utils/request';

/** 首页看板统计-总揽*/
export async function getStatistics(options?: Record<string, any>) {
  return request('/statistics/statistics', {
    method: 'GET',
    params: options,
  });
}

/** 首页看板统计-总揽*/
export async function getFunnel(options?: Record<string, any>) {
  return request('/common/gate_statistics', {
    method: 'GET',
    params: options,
    b: 'total',
  });
}
/** 首页看板统计-出入库*/
export async function getCablaneInfo(options?: Record<string, any>) {
  return request('/common/gate_statistics', {
    method: 'GET',
    params: options,
    b: 'cablane_info',
  });
}
/** 首页看板统计-销量*/
export async function getRankInfo(options?: Record<string, any>) {
  return request('/common/gate_statistics', {
    method: 'GET',
    params: options,
    b: 'rank',
  });
}

/** 首页看板统计-订单*/
export async function getOrderStatus(options?: Record<string, any>) {
  return request('/order/admin_order', {
    method: 'GET',
    params: options,
    b: 'order_statistics',
  });
}

/** 首页看板统计-订单折线图*/
export async function getOrderLineData(options?: Record<string, any>) {
  return request('/common/gate_statistics', {
    method: 'GET',
    params: options,
    b: 'polyline_price',
  });
}

/** 首页看板统计-销量折线图*/
export async function getSaleLineData(options?: Record<string, any>) {
  return request('/common/gate_statistics', {
    method: 'GET',
    params: options,
    b: 'polyline_amount',
  });
}

/** 首页看板统计-监控数量统计*/
export async function getMonitor(options?: Record<string, any>) {
  return request('/common/monitor_overview', {
    method: 'GET',
    params: options,
    b: 'alert_statistics',
  });
}
/** 首页看板统计-告警趋势折线图*/
export async function getMonitorRecord(options?: Record<string, any>) {
  return request('/common/monitor_overview', {
    method: 'GET',
    params: options,
    b: 'record',
  });
}
/** 首页看板统计-告警排行列表*/
export async function getMonitorAssets(options?: Record<string, any>) {
  return request('/common/monitor_overview', {
    method: 'GET',
    params: options,
    b: 'assets_statistic',
  });
}
/** 首页看板统计-告警排行柱状图*/
export async function getMonitorAssetsColumn(options?: Record<string, any>) {
  return request('/common/monitor_overview', {
    method: 'GET',
    params: options,
    b: 'assets_info',
  });
}

/** 首页看板统计*/
export async function getMonitorStatistics(options?: Record<string, any>) {
  return request('/common/monitor_overview', {
    method: 'GET',
    params: options,
    b: 'statistics',
  });
}
/** 首页看板统计-告警处理情况列表*/
export async function getAssetsAlertRecord(options?: Record<string, any>) {
  return request('/common/monitor_overview', {
    method: 'GET',
    params: options,
    b: 'alert_record',
  });
}

/** 首页看板统计-资产分布*/
export async function getAssetsDist(options?: Record<string, any>) {
  return request('/common/monitor_overview', {
    method: 'GET',
    params: options,
    b: 'assets_dist',
  });
}

/** 首页看板统计-告警趋势*/
export async function getAlertTrend(options?: Record<string, any>) {
  return request('/common/monitor_overview', {
    method: 'GET',
    params: options,
    b: 'alert_trend',
  });
}
/** 首页看板统计-告警趋势折线图*/
export async function getAlertTrendRecord(options?: Record<string, any>) {
  return request('/common/monitor_overview', {
    method: 'GET',
    params: options,
    b: 'trend_record',
  });
}

/** 首页看板统计-总揽*/
export async function getAssetMileage(options?: Record<string, any>) {
  return request('/statistics/asset_mileage', {
    method: 'GET',
    params: options,
    b: 'list',
  });
}
