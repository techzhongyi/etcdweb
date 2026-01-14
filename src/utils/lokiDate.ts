import moment from 'moment';

/**
 * 纳秒时间戳转换为日期字符串（用于 datetime-local input）
 */
export function nanoToDateString(nano: number): string {
  const date = new Date(nano / 1000000);
  return moment(date).format('YYYY-MM-DDTHH:mm:ss');
}

/**
 * 纳秒时间戳转换为格式化日期字符串
 */
export function nanoToFormattedDate(nano: number): string {
  const date = new Date(nano / 1000000);
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

/**
 * 日期字符串转换为纳秒时间戳
 */
export function dateStringToNano(dateString: string): number {
  return moment(dateString).valueOf() * 1000000;
}

/**
 * 获取日期范围
 */
export function getDateRange(range: string): { start: Date; end: Date } {
  const now = new Date();
  let start: Date;
  let end: Date = now;

  switch (range) {
    case 'today':
      start = moment(now).startOf('day').toDate();
      break;
    case 'yesterday':
      const yesterday = moment(now).subtract(1, 'day');
      start = yesterday.startOf('day').toDate();
      end = yesterday.endOf('day').toDate();
      break;
    case 'this_week':
      start = moment(now).startOf('week').toDate();
      break;
    case 'last_7_days':
      start = moment(now).subtract(7, 'days').toDate();
      break;
    case 'this_month':
      start = moment(now).startOf('month').toDate();
      break;
    case 'last_30_days':
      start = moment(now).subtract(30, 'days').toDate();
      break;
    case 'last_90_days':
      start = moment(now).subtract(90, 'days').toDate();
      break;
    case 'last_12_months':
      start = moment(now).subtract(12, 'months').toDate();
      break;
    case 'this_year':
      start = moment(now).startOf('year').toDate();
      break;
    default:
      start = moment(now).subtract(1, 'hour').toDate();
  }

  return { start, end };
}
