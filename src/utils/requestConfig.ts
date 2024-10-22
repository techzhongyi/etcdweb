import { getStorage } from './storage';
import { Md5 } from 'ts-md5';
// import { Base64 } from 'js-base64'

export class requestConfig {
  // 获取token
  static getToken() {
    const token = getStorage('token');
    return token;
  }
  static getNonce() {
    return Md5.hashStr(
      Math.floor(new Date().getTime() / 1000).toString() + this.randomString(8),
    );
  }
  static randomString(_num: number) {
    const num = _num || 32;
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 默认去掉容易混淆的字符
    const maxPos = chars.length;
    let pwd = '';
    for (let i = 0; i < num; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }
  // header里data序列化
  static getOwnPropertyNames(data: any) {
    const list = [];
    for (const item in data) {
      list.push(JSON.stringify(data[item]).split('').sort().join(''));
    }
    list.sort();
    return list.join('');
  }
  // static emoji2Str(str: string) {
  //     return unescape(escape(str).replace(/\%uD.{3}/g, ''))
  // }
  static md5_response(data: any, noce: any, behavior: any) {
    if (behavior) {
      return Md5.hashStr(
        getStorage('p_secret') +
          ':' +
          this.getOwnPropertyNames(data) +
          ':' +
          noce +
          ':' +
          behavior,
      );
    }
    return Md5.hashStr(
      getStorage('p_secret') +
        ':' +
        this.getOwnPropertyNames(data) +
        ':' +
        noce,
    );
  }
}
