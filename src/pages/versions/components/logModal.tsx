import {
  ProForm,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, Modal, Skeleton, Space } from 'antd';
import { useEffect, useState } from 'react';
import { versionsItemType, modalType } from '../data';

const LogModal: React.FC<modalType<versionsItemType>> = (
  props: any,
) => {
  const { visible, isShowModal } = props;

  const onModealCancel = () => {
    isShowModal(false);
  };
  return (
    <Modal
      title='日志'
      open={visible}
      onCancel={onModealCancel}
      footer={null}
      maskClosable={false}
      destroyOnClose={true}
      width={980}
    >
    </Modal>
  );
};
export default LogModal;
