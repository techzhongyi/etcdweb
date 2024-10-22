import { getStorage } from '@/utils/storage';
// An highlighted block
/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { Modal, notification } from 'antd';
import { requestConfig } from './requestConfig';
import { clearAllStorage } from './storage';
import { history } from 'umi';
import { debounce } from 'lodash';
import { trimObj } from './common';
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
const globalConstant = await fetch('/env.json', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
  .then((response) => response.json()) //解析为Promise
  .then((data) => {
    return data;
  });

/**
 * 异常处理程序
 */
const errorHandler = (error: any) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.destroy();
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }
  return response;
};
const request = extend({
  errorHandler,
  timeout: 5000,
  // 默认错误处理
  //  credentials: 'include', // 默认请求是否带上cookie
});

// request拦截器, 改变url 或 options.
request.interceptors.request.use((url: string, options: any) => {
  console.log('前端请求参数', options);
  options.params = trimObj(options.params); //去空格
  const nonce = requestConfig.getNonce().toString();
  const response = requestConfig
    .md5_response(options.params, nonce, options.b)
    .toString();
  const webSiteUrl = globalConstant.webSite[url.split('/')[1]] + url;
  const webExport = globalConstant.webExport + url;
  let headers = {};
  let queryObj = {};
  if (options.method === 'put' || options.method === 'post') {
    headers = {
      'WWW-Authenticate': 'JCUST cting.com user_name=',
      opaque: requestConfig.getToken(),
      response: requestConfig
        .md5_response(options.data, nonce, options.b)
        .toString(),
      nonce,
      uri: url,
    };
    if (options?.b === '') {
      queryObj = {
        p: JSON.stringify(options.data),
        u: JSON.stringify(getStorage('user_info')),
      };
    } else {
      queryObj = {
        p: JSON.stringify(options.data),
        u: JSON.stringify(getStorage('user_info')),
        b: options.b,
      };
    }
  } else {
    headers = {
      'Content-type': 'application/x-www-form-urlencoded',
      'WWW-Authenticate': 'JCUST cting.com user_name=',
      opaque: requestConfig.getToken(),
      response,
      nonce,
      uri: url,
    };
    if (options?.b === '') {
      queryObj = {
        p: JSON.stringify(options.params),
        u: JSON.stringify(getStorage('user_info')),
      };
    } else {
      queryObj = {
        p: JSON.stringify(options.params),
        u: JSON.stringify(getStorage('user_info')),
        b: options.b,
      };
    }
  }
  if (options.method === 'get') {
    if (url.includes('/export/')) {
      return {
        url: webExport,
        options: { params: queryObj, headers, responseType: 'arrayBuffer' },
      };
    } else if (url === '/common/admin/oss') {
      return {
        url: webSiteUrl,
        options: { params: queryObj, headers },
      };
      // if (options.b === 'token') {
      //   return {
      //     url: webSiteUrl,
      //     options: { params: queryObj, headers },
      //   };
      // } else {
      //   return {
      //     url: webExport,
      //     options: { params: queryObj, headers, responseType: 'arrayBuffer' },
      //   };
      // }
    } else {
      return {
        url: webSiteUrl,
        options: { params: queryObj, headers },
      };
    }
  } else if (options.method === 'post' && !url.endsWith('/login')) {
    return {
      url: webSiteUrl,
      options: { ...options, data: queryObj, headers, requestType: 'form' },
    };
  } else if (options.method === 'put') {
    return {
      url: webSiteUrl,
      options: { ...options, data: queryObj, headers, requestType: 'form' },
    };
  } else if (options.method === 'delete') {
    return {
      url: webSiteUrl,
      options: { ...options, params: queryObj, headers },
    };
  } else {
    if (url.endsWith('/sms')) {
      return {
        url: webSiteUrl,
        options: { ...options, params: queryObj },
      };
    } else {
      return {
        url: webSiteUrl,
        options: { ...options },
      };
    }
  }
});
const modalError = debounce(() => {
  Modal.error({
    title: '提示',
    content: '登录已失效 请重新登陆',
    okText: '重新登陆',
    onOk: () => {
      clearAllStorage();
      history.replace({
        pathname: '/user/login',
      });
    },
  });
}, 800);
// response拦截器, 处理response
request.interceptors.response.use(async (response) => {
  if (
    response.clone().url.includes('/export/') ||
    response.clone().url.includes('/pub/eoss') ||
    response.clone().url.includes('/pub/oss')
  ) {
  } else {
    const { status } = await response.clone().json();
    if (+status === -3) {
      modalError();
    }
  }
  return response;
});

export default request;
