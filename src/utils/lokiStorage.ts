/**
 * LocalStorage 工具函数 - Loki Viewer 专用
 */

const STORAGE_KEYS = {
  PRESET: 'grafana-loki-viewer-preset',
  RECENTS: 'grafana-loki-viewer-recents',
  THEME: 'grafana-loki-viewer-theme',
};

export interface QueryPreset {
  url: string;
  query: string;
  start: number;
  end: number;
  limit: number;
}

export interface RecentQuery {
  query: QueryPreset;
  searchParams: string;
  createdAt: number;
}

/**
 * 保存预设查询
 */
export function savePreset(preset: QueryPreset): void {
  localStorage.setItem(STORAGE_KEYS.PRESET, JSON.stringify(preset));
}

/**
 * 获取预设查询
 */
export function getPreset(): QueryPreset | null {
  const preset = localStorage.getItem(STORAGE_KEYS.PRESET);
  if (!preset) return null;
  try {
    return JSON.parse(preset);
  } catch {
    return null;
  }
}

/**
 * 添加最近查询
 */
export function addRecentQuery(recent: RecentQuery): void {
  let recents: RecentQuery[] = [];
  const stored = localStorage.getItem(STORAGE_KEYS.RECENTS);
  if (stored) {
    try {
      recents = JSON.parse(stored);
    } catch {
      recents = [];
    }
  }
  recents.push(recent);
  // 只保留最近 10 条
  if (recents.length > 10) {
    recents.shift();
  }
  localStorage.setItem(STORAGE_KEYS.RECENTS, JSON.stringify(recents));
}

/**
 * 获取最近查询列表
 */
export function getRecentQueries(): RecentQuery[] {
  const stored = localStorage.getItem(STORAGE_KEYS.RECENTS);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * 保存主题设置
 */
export function saveTheme(theme: 'dark' | 'light'): void {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

/**
 * 获取主题设置
 */
export function getTheme(): 'dark' | 'light' {
  const theme = localStorage.getItem(STORAGE_KEYS.THEME);
  if (theme === 'dark' || theme === 'light') {
    return theme;
  }
  // 默认跟随系统
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}
