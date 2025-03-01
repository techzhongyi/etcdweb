import React, { useEffect } from 'react';
import { Button, Modal } from 'antd';
import '../index.less';
const DetailModal: React.FC = (props: any) => {
  const { visible, isShowModal, record } = props;
  const title = record.organize+':'+record.name+ "(" + record.ip + ")"+'详情'
  useEffect(() => {
  }, [record]);

  const onModealCancel = () => {
    isShowModal(false);
  };
  return (
    <Modal
      title={title}
      width={766}
      footer={[
        <Button key="back" onClick={onModealCancel}>
          关闭
        </Button>,
      ]}
      open={visible}
      maskClosable={false}
      onCancel={onModealCancel}
      destroyOnClose={true}
    >

      <div className='bottom-info'>
        <div>hosti: {record.hosti ? record.hosti : '-'}</div>
        <div>os: {record.os ? record.os : '-'}  portpeer: {record.portpeer ? record.portpeer : '-'}  desc: {record.desc ? record.desc : '-'} </div>
      </div>
    </Modal>
  );
};
export default DetailModal;
