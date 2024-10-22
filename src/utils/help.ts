export class Help {
  /**
   * 正则列表
   * vscode https://marketplace.visualstudio.com/items?itemName=russell.any-rule
   */
  static Regular = {
    /** 手机号只有第一位为1 */
    mobilePhone: /^1(3|4|5|6|7|8|9)\d{9}$/,
    /** 车牌号正则表达式 油车和新能源车 */
    license:
      /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/,
    /* IP网段 */
    ipRule:
      /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(0)$/,
    /** 手机号 */
    mobilePhoneSimple: /^(?:(?:\+|00)86)?1\d{10}$/,

    /** 邮箱 */
    email: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,}/,

    /** 身份证 */
    cardID:
      /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,

    /** 银行卡 */
    bankCard: /^\d{15,19}$/,

    /** 网址 url */
    url: /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-\(\)]*[\w@?^=%&/~+#-\(\)])?$/,

    /** 英文 */
    english: /^[A-Za-z]+$/,

    /** 英文和数字 */
    englishFigures: /^[A-Za-z0-9]+$/,

    /** 纳税人识别号 */
    tax_no: /[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}/,

    /** 复杂密码 */
    password:
      /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$)^.{8,20}$/,

    /** 中文字符 */
    chinese: /[\u4e00-\u9fa5]/,

    /** 中文、英文、数字但不包括下划线等符号 */
    character: /^[\u4E00-\u9FA5A-Za-z0-9\-[（]|[）][(]|[)]+$/,

    /** 数字 */
    number: {
      /** 数字  */
      ordinary: /^[0-9]*$/,
      /** 只能输入数字和小数点 */
      number: /([1-9]\d*((.\d+)*))|(0.\d+)/,
      /** 只能输入数字整数保留两位小数点，不能输入负数  */
      intege_lose: /^([1-9]\d*|0)(\.\d{1,2})?$/,
      /** 正数 */
      just: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
      /** 负数 */
      negative: /^[-]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
      /**正数、负数、小数、百分数*/
      percent: /-?\d+[.]?\d*%?/g,
      /**正整数*/
      Pinteger: /^\+?[1-9]\d*$/,
      /**金额*/
      price:
        /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
    },
  };
}
export default Help;