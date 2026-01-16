/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * 
 * 注意：Loki 接口已统一使用 /devopsCore/loki/* 路径，通过统一的 request 和 webSocket 工具调用
 * 不再需要代理配置，所有接口都通过 env.json 中的 devopsCore 地址直接访问
 */

// import globalConstant from "../public/env";

export default {
  dev: {
    // 注意：更具体的路径要放在前面，避免被通用路径覆盖
    // Loki 接口已统一为 /devopsCore/loki/*，通过统一的 request 和 webSocket 工具调用
    // 不再需要代理配置，所有接口都通过 env.json 中的 devopsCore 地址直接访问
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
