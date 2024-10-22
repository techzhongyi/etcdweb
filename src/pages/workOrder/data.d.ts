export interface workOrderItemType {
  id: string; // 资产id
  type: number; // 设备类型 0-有线 1-无线
  status: number; // 通信状态
  provider_id: string; // 供应商id
  provider_name: string; // 供应商name
  device_no: string; // 设备号
  asset_id: string; // 已绑定资产id
  bind_time: number; // 绑定时间
  creator_type: number; // 工单创建类型
  level: number; // 工单级别
  remark: string; // 备注
  uu_number: string; // 编号
  desc: string; // 描述
  create_time: number; // 资产创建时间
  update_time: number; // 资产更新时间
  owner_name: string[]; // 负责人
}
export interface propertyModalType {
  visible: boolean;
  record?: qrcodeItemType | undefined;
  editId?: string;
  loading?: boolean;
  type?: number;
  isShowModal: (show: boolean, _record?: qrcodeItemType, id?: string) => void;
  onFinish?: (value: FormValues) => void;
}
