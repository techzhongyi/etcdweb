import { defineConfig } from 'umi';
// import { join } from 'path';

import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

// const { REACT_APP_ENV } = process.env;

export default defineConfig({
  // 文件名带内容哈希，避免 npm run build 发布后浏览器/CDN 仍缓存旧的 umi.js 片段（曾导致线上仍为「非实时只显示 400 条」的旧逻辑）
  hash: true,
  outputPath: 'dist',
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  routes,
  proxy: proxy.dev,
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  manifest: {
    basePath: './',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  nodeModulesTransform: { type: 'none' },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
});
