// 获取电池类型
export const getBatteryType = (value?: number) => {
  const batteryTypeList = [
    {
      value: 1,
      label: '宁德时代',
    },
    {
      value: 2,
      label: '国轩动力电池41.93度',
    },
    {
      value: 3,
      label: '宁德时代100.41度',
    },
    {
      value: 4,
      label: '亿纬锂能',
    },
  ];
  // if (value) {
  //     const list = batteryTypeList.filter(item => item.value === value).map((items) => items.label)
  //     if (list.length > 0) {
  //         return list[0]
  //     }
  //     return ''
  // }
  return batteryTypeList;
};
// 获取工单级别
export const getLevelType = (value?: number) => {
  const levelTypeList = [
    {
      value: 1,
      label: '一般',
    },
    {
      value: 2,
      label: '严重',
    },
    {
      value: 3,
      label: '紧急',
    },
  ];
  // if (value) {
  //     const list = categoryTypeList.filter(item => item.value === value).map((items) => items.label)
  //     if (list.length > 0) {
  //         return list[0]
  //     }
  //     return ''
  // }
  return levelTypeList;
};
// 获取类别类型
export const getCategoryType = (value?: number) => {
  const categoryTypeList = [
    {
      value: 1,
      label: '重卡',
    },
    {
      value: 2,
      label: '轻卡',
    },
    {
      value: 3,
      label: 'VAN车',
    },
    {
      value: 4,
      label: '车厢',
    },
    {
      value: 5,
      label: '挂车',
    },
  ];
  // if (value) {
  //     const list = categoryTypeList.filter(item => item.value === value).map((items) => items.label)
  //     if (list.length > 0) {
  //         return list[0]
  //     }
  //     return ''
  // }
  return categoryTypeList;
};
// 获取后回转半径
export const getBackType = (value?: number) => {
  const backTypeList = [
    {
      value: '2350',
      label: '2350',
    },
  ];
  // if (value) {
  //     const list = backTypeList.filter(item => item.value === value).map((items) => items.label)
  //     if (list.length > 0) {
  //         return list[0]
  //     }
  //     return ''
  // }
  return backTypeList;
};
// 获取鞍座高度
export const getSeatHighType = (value?: number) => {
  const seatHighTypeList = [
    {
      value: '1250CM',
      label: '1250CM',
    },
  ];
  // if (value) {
  //     const list = seatHighTypeList.filter(item => item.value === value).map((items) => items.label)
  //     if (list.length > 0) {
  //         return list[0]
  //     }
  //     return ''
  // }
  return seatHighTypeList;
};
// 获取牵引销
export const getPullPinType = (value?: number) => {
  const pullPinTypeList = [
    {
      value: '50#',
      label: '50#',
    },
  ];
  // if (value) {
  //     const list = pullPinTypeList.filter(item => item.value === value).map((items) => items.label)
  //     if (list.length > 0) {
  //         return list[0]
  //     }
  //     return ''
  // }
  return pullPinTypeList;
};
