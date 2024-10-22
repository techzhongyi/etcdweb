export interface accountItemType {
  id: string; // 账号id
  type: string; // 账号类型
  uu_number: string; // 编号
  name: string; // 登录名
  phone: string; // 手机号
  role_id: string; // 所属角色id
  role_name: string; // 所属角色
  user_id: string; // 所属用户id
  user_name: string; // 所属用户
  enable: number; // 是否禁用 0-禁用 1-启用
  desc: string; // 描述
  create_time: number; // 创建时间
  update_time: number; // 更新时间
}
export interface tagItemType {
  id: string; // 账号id
  name: string; // 标签名
  create_name: string; // 所属角色
  enable: number; // 状态 0-禁用 1-启用
  create_time: number; // 创建时间
}
export type FormValues = Record<string, any>;
export interface categoryItemType {
  id: string; // 资产id
  uu_number: string; // 编号
  type: string; // 类型 0-重卡 1-轻卡 2-van车 3-车厢 4-挂车
  brand: string; // 品牌
  model: string; // 车型
  size: string; // 尺寸
  battery_type: string; // 电池品牌
  cube: string; // 载货立方
  back_turn_redius: string; // 回转半径
  seat_high: string; // 鞍座高度
  pull_pin: string; // 牵引销
  create_time: number; // 创建时间
  update_time: number; // 更新时间
}
export interface orgItemType {
  id: string; // 组织id
  name: string; // 组织名
  enable: number; // 可用状态
  user_count: number; // 组织下用户数量
  desc: string; // 组织描述
  create_time: number; // 创建时间
  update_time: number; // 更新时间
}
export interface accountItemType {
  id: string; // 账号id
  type: number; // 账号类型 0-客户端小程序账号 1-运维端小程序账号 2-后台管理系统账号
  uu_number: string; // 编号
  name: string; // 登录名
  phone: string; // 手机号
  role_id: number; // 角色id
  user_id: string; // 所属用户id
  enable: number; // 是否禁用 0-禁用 1-启用
  desc: string; // 账号描述
  create_time: number; // 创建时间
  update_time: number; // 更新时间
}
export interface userItemType {
  id: string; // 用户id
  name: string; // 用户名
  uu_number: string; // 编号
  phone: string; // 手机号
  is_root: number; // 是否为root用户
  enable: number; // 是否禁用 0-禁用 1-启用
  depart_id: string; // 组织id
  depart_name: string; // 组织名称
  account_count: number; // 账号数量
  desc: string; // 描述
  create_time: number; // 创建时间
  update_time: number; // 更新时间
}
export interface roleItemType {
  id: string; // 角色id
  name: string; // 角色名称
  desc: string; // 角色描述
  create_time: number; // 创建时间
  creator_name: string; // 创建人
}
