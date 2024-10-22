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
    '/api/': {
      // target:globalConstant.webSiteDev,
      changeOrigin: true, //是否跨域
      pathRewrite: { '^/api/': '' },
      // secure: true
    },
  },
  test: {
    '/api/': {
      // target: globalConstant.webSiteTest,
      changeOrigin: true,
      pathRewrite: { '^/api/': '' },
    },
  },
  pre: {
    '/api/': {
      // target: globalConstant.webSite,
      changeOrigin: true,
      pathRewrite: { '^/api/': '' },
    },
  },
};
