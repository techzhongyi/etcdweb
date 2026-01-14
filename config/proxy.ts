/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 */

// import globalConstant from "../public/env";

export default {
  dev: {
    // 注意：更具体的路径要放在前面，避免被通用路径覆盖
    '/api/loki': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      pathRewrite: { '^/api/loki': '/api/loki' },
    },
    '/api/': {
      // target:globalConstant.webSiteDev,
      changeOrigin: true, //是否跨域
      pathRewrite: { '^/api/': '' },
      // secure: true
    },
  },
  test: {
    '/api/loki': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      pathRewrite: { '^/api/loki': '/api/loki' },
    },
    '/api/': {
      // target: globalConstant.webSiteTest,
      changeOrigin: true,
      pathRewrite: { '^/api/': '' },
    },
  },
  pre: {
    '/api/loki': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      pathRewrite: { '^/api/loki': '/api/loki' },
    },
    '/api/': {
      // target: globalConstant.webSite,
      changeOrigin: true,
      pathRewrite: { '^/api/': '' },
    },
  },
};
