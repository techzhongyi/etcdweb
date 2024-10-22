import React, { useEffect, useState } from 'react';
import { Button, Modal, Skeleton, Space } from 'antd';
import ProForm, {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { FormValues, configItemType } from '../../data';
import Appdiff from '@/components/appDiff';
interface accountModalType {
  visible: boolean;
  record?: configItemType | undefined;
  editId?: string;
  loading?: boolean;
  isShowModal: (show: boolean, _record?: configItemType, id?: string) => void;
  onFinish: (value: FormValues) => void;
}
const ComparesModal: React.FC<accountModalType> = (props: any) => {
  const [formObj] = ProForm.useForm();
  const {
    visible,
    isShowModal,
    onFinish,
    record,
    editId,
    loading = false,
  } = props;
  const title = editId === undefined ? '内容比较' : '内容比较';
  //     const [oldVal, setOldVal] = useState("");
  //   const [newVal, setNewVal] = useState("");
  useEffect(() => {}, []);
  const onModealCancel = () => {
    isShowModal(false);
  };
  const oldVal = `
    1111
    2222
    3333
    `;
  const newVal = `
    1111
    3333
    `;

  return (
    <Modal
      title={title}
      width={766}
      footer={null}
      open={visible}
      maskClosable={false}
      onCancel={onModealCancel}
      destroyOnClose={true}
    >
      <Appdiff oldVal={oldVal} newVal={newVal} />
    </Modal>
  );
};
export default ComparesModal;
