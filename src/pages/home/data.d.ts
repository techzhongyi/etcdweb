export interface homeItemType {
  id: string; // 账号id
  type: string; // 账号类型
  uu_number: string; // 编号
  name: string; // 登录名
  phone: string; // 手机号
  desc: string; // 描述
  create_time: number; // 创建时间
  update_time: number; // 更新时间
}
export type FormValues = Record<string, any>;
