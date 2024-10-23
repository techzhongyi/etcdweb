export interface versionsItemType {
  id: string;
  order_id: string;
  order_number: string; // 订单编号
  uu_number: string; // 租金单据编号
  proof:string[];//凭证
  invoice_url:string//开票凭证
  user_id:string//用户id
  receipt_count:number//用户id
  create_time:number// 创建时间
  end_time:number// 创建时间
  user_name:string// 客户名称
}
export type FormValues = Record<string, any>;
export interface modalType<T> {
  visible: boolean;
  record?: T | undefined;
  editId?: string;
  userIds?: any[];
  loading?: boolean;
  isShowModal: (show: boolean, record?: T, id?: string) => void;
  onFinish?: (value: FormValues) => void;
}
