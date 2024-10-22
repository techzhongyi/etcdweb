import React, { useRef, useState } from 'react';
import ProForm, { ModalForm, ProFormSelect } from '@ant-design/pro-form';
import { Button, message, Modal, Space } from 'antd';
import { getInternList } from '@/services/intern/intern';
interface modalType {
  visible: boolean;
  close: any;
  onFinish: any;
}

const ShareModal: React.FC<modalType> = (prop) => {
  const { visible, close, onFinish } = prop;

  //获取实习生列表
  const internList = async () => {
    const array: { label: any; value: any }[] = [];
    const {
      data: { items },
      status,
    } = await getInternList({ page: 1, count: 1000 });
    if (status === 0) {
      items.map((item: any, index: Number) => {
        array.push({ label: item.name, value: item.id });
      });

      return array;
    } else {
      return [];
    }
  };

  return (
    <ModalForm
      width="332px"
      visible={visible}
      modalProps={{
        onCancel: close,
        centered: true,
      }}
      onFinish={onFinish}
      title="供应商"
    ></ModalForm>
  );
};

export default ShareModal;
