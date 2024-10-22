export interface accidentItemType {
  id: string;
  uu_number: string; // 出险单号
  order_number: string; // 订单编号
  order_id: string; //  订单id
  assets_number: string; // 资产编号
  assets_info: string; // 资产信息
  responsible_party: string; // 责任方
  creator_name: string; // 经办人
  insurance_amount: number; // 保单费用
  reparation_amount: number; // 赔偿费用
  create_time: number; // 创建时间
  complete_time: number; // 出险完成时间
  pay_type: number; // 付款方式 1-直付 2-代付
  images: string[]; // 出险记录
  is_processing: number; // 状态
}
export interface assessmentItemType {
  id: string;
  order_id: string; // 订单id
  uu_number: string; // 出险单号
  order_uu_number: string; // 订单编号
  assets_number: string; // 资产编号
  assets_info: string; // 资产信息
  responsible_party: string; // 责任方
  creator_name: string; // 经办人
  insurance_amount: number; // 保单费用
  reparation_amount: number; // 赔偿费用
  create_time: number; // 创建时间
  complete_time: number; // 出险完成时间
  pay_type: number; // 付款方式 1-直付 2-代付
  images: any[]; // 出现记录
}
export interface collectionItemType {
  id: string;
  user_name: string;
  real_name: string;
  phone: string;
  role_name: string;
  enable: number;
  create_time: number;
  latest_login_time: number;
  assets: any;
  group_id: string;
  image: string;
}
export interface operateReturnSettlement {
  id: string; //违章记录ID
  assets_id: string; //资产ID
  assets_number: string; //资产编号
  assets_type: number; //资产类型
  assets_info: string; //资产品牌
  number: string; //违章编码
  uu_number: string; //违章单号
  desc: string; //违章行为
  amount: number; //违章金额
  time: number; //违章时间
  processing_period: number; //违章处理期限
  order_id: string; //订单id
  order_number: string; //订单编号
  images: string; //违章记录
  creator_id: string; //创建人ID
  creator_name: string; //创建人姓名
  create_time: number; //创建时间
}
export interface operateMaintenance {
  id: string; //维修记录id
  assets_id: string; //资产ID
  assets_number: string; //资产编号
  assets_type: number; //资产类型
  assets_info: string; //资产品牌
  unmber: string; //编号
  manufacturer_id: string; //维修厂商id
  manufacturer_name: string; //维修厂商名称
  in_manufacturer_time: number; //维修送厂时间
  reason: string; //维修原因
  out_time: number; //预计出厂时间
  done_time: number; //维修完成时间
  images: string; //维修记录
  order_id: string; //订单id
  order_number: string; //订单编号
  amount: number; //维修费用
  creator_id: string; //创建人ID
  creator_name: string; //创建人姓名
  create_time: number; //创建时间
  status: number; //状态
}
export interface operateRecovery {
  id: string; //回收记录ID
  assets_id: string; //资产ID
  assets_number: string; //资产编号
  assets_type: number; //资产类型
  assets_info: string; //资产品牌
  reason: string; //原因
  evaluate_amount: string; //评估价值
  real_amount: string; //实际价值
  creator_id: string; //创建人ID
  creator_name: string; //创建人姓名
  create_time: number; //创建时间
}
export interface departureItemType {
  id: string;
  assets_category_id: string; // 资产类别id
  order_id: string;
  order_uu_number: string;
  start_time: number;
  end_time: number;
  type: number; // 资产类型
  status: number;
  send_count: number;
  total_count: number;
  annual_inspection_time: number; // 年检日期
  insurance_time: number; // 保险日期
  deliver_time: number; // 厂家交付日期
  conf_status: number; // 配车状态
}
export interface returnSettlementItemType {
  id: string;
  assets_id: string; // 资产id
  assets_category_id: string; // 资产类别id
  order_id: string;
  order_uu_number: string;
  start_time: number;
  end_time: number;
  status: number;
  is_settle: number; // 是否结算 0-未结算 1-已结算
  is_damage: number; // 是否定损  0-未定损 1-已定损
  annual_inspection_time: number; // 年检日期
  insurance_time: number; // 保险日期
  deliver_time: number; // 厂家交付日期
  prepare_time: number; // 收车时间
  prepare_images: any; // 收车记录
}
export type FormValues = Record<string, any>;
export interface modalType<T> {
  visible: boolean;
  record?: T | undefined;
  editId?: string;
  loading?: boolean;
  isShowModal: (show: boolean, _record?: T, id?: string) => void;
  onFinish: (value: FormValues) => void;
}
export interface modal1Type<T> {
  visible: boolean;
  record?: T | undefined;
  editId?: string;
  loading?: boolean;
  isShowModal: (show: boolean, _record?: T, id?: string) => void;
}
