import { Modal } from 'antd';
import { useEffect, useState } from 'react';
import { accidentItemType, modalType } from '../../data';

const Index: React.FC<modalType<accidentItemType>> = (props: any) => {
  const {
    visible,
    isShowModal,
    onFinish,
    record,
    editId,
    loading = false,
  } = props;
  const [initialValues, setInitialValues] = useState(undefined);
  useEffect(() => {
    if (record) {
      setInitialValues({
        ...record,
      });
    }
  }, [record]);
  const onModealCancel = () => {
    isShowModal(false);
  };
  return (
    <>
      <Modal
        title="出险记录"
        open={visible}
        onCancel={onModealCancel}
        footer={null}
        maskClosable={false}
        destroyOnClose={true}
        width={980}
      ></Modal>
    </>
  );
};
export default Index;
