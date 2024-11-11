import {
  ProForm,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, List, Modal, Space } from 'antd';
import { useEffect, useState } from 'react';

const VersionDetailModal: React.FC<any> = (
  props: any,
) => {
  const [formObj] = ProForm.useForm();
  const { visible, isShowModal, onFinish, record, editId } = props;
  const [initialValues, setInitialValues] = useState(undefined);
  const title = '详情'
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
    <Modal
      title={title}
      open={visible}
      onCancel={onModealCancel}
      footer={[
        <Button key="back" onClick={onModealCancel}>
          关闭
        </Button>,
      ]}
      maskClosable={false}
      destroyOnClose={true}
      width={1280}
    >
      <div className='detail-content'>
        <div className='detail-left'>
          <div className='revise-info'>
            <div className='info-title'>修订信息</div>
            <div className='info-content'>
              <div className='info-content-list'>
                <div className='list-title'>张三 2024-05-09</div>
                <div>修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息</div>
              </div>
              <div className='info-content-list'>
                <div className='list-title'>张三 2024-05-09</div>
                <div>修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息</div>
              </div>
              <div className='info-content-list'>
                <div className='list-title'>张三 2024-05-09</div>
                <div>修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息</div>
              </div>
              <div className='info-content-list'>
                <div className='list-title'>张三 2024-05-09</div>
                <div>修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息</div>
              </div>
              <div className='info-content-list'>
                <div className='list-title'>张三 2024-05-09</div>
                <div>修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息</div>
              </div>
            </div>
          </div>
          <div className='Upgrades-info'>
            <div className='info-title'>升级信息</div>
            <div className='info-content'>
            <div className='info-content-list'>
                <div className='list-title'>张三 2024-05-09</div>
                <div>修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息</div>
              </div>
              <div className='info-content-list'>
                <div className='list-title'>张三 2024-05-09</div>
                <div>修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息</div>
              </div>
              <div className='info-content-list'>
                <div className='list-title'>张三 2024-05-09</div>
                <div>修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息</div>
              </div>
              <div className='info-content-list'>
                <div className='list-title'>张三 2024-05-09</div>
                <div>修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息</div>
              </div>
              <div className='info-content-list'>
                <div className='list-title'>张三 2024-05-09</div>
                <div>修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息</div>
              </div>
            </div>
          </div>
        </div>
        <div className='detail-right'>
          <div className='info-title'>评论信息</div>
          <div className='info-content'>
          <div className='info-content-list'>
                <div className='list-title'>张三 2024-05-09</div>
                <div>修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息</div>
              </div>
              <div className='info-content-list'>
                <div className='list-title'>张三 2024-05-09</div>
                <div>修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息</div>
              </div>
              <div className='info-content-list'>
                <div className='list-title'>张三 2024-05-09</div>
                <div>修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息</div>
              </div>
              <div className='info-content-list'>
                <div className='list-title'>张三 2024-05-09</div>
                <div>修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息</div>
              </div>
              <div className='info-content-list'>
                <div className='list-title'>张三 2024-05-09</div>
                <div>修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息</div>
              </div>
              <div className='info-content-list'>
                <div className='list-title'>张三 2024-05-09</div>
                <div>修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息</div>
              </div>
              <div className='info-content-list'>
                <div className='list-title'>张三 2024-05-09</div>
                <div>修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息</div>
              </div>
              <div className='info-content-list'>
                <div className='list-title'>张三 2024-05-09</div>
                <div>修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息</div>
              </div>
              <div className='info-content-list'>
                <div className='list-title'>张三 2024-05-09</div>
                <div>修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息</div>
              </div>
              <div className='info-content-list'>
                <div className='list-title'>张三 2024-05-09</div>
                <div>修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息修订信息</div>
              </div>
          </div>
        </div>
      </div>

    </Modal>
  );
};
export default VersionDetailModal;
