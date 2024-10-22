import React, { useEffect, useState } from 'react';
import { Button, Modal, Image, Space } from 'antd';
import ProForm from '@ant-design/pro-form';
import { ProFormTextArea } from '@ant-design/pro-components';
import './index.less';
import { propertyModalType } from '../data';
const DetailModal: React.FC<propertyModalType> = (props: any) => {
  const { visible, isShowModal, record, editId, loading = false } = props;
  const onModealCancel = () => {
    isShowModal(false);
  };
  return (
    <Modal
      title="详情"
      maskClosable={false}
      width={1024}
      footer={[
        <Button key="back" onClick={onModealCancel}>
          关闭
        </Button>,
      ]}
      open={visible}
      onCancel={onModealCancel}
      destroyOnClose={true}
    >
      <div className="image-container">
        <Image.PreviewGroup>
          {record.images.map((item) => {
            return (
              <div style={{ marginRight: '5px' }}>
                <Image width={120} src={item} />
              </div>
            );
          })}
        </Image.PreviewGroup>
      </div>
      <div>
        <ProFormTextArea
          label="描述"
          disabled={true}
          name="desc"
          fieldProps={{
            maxLength: 499,
          }}
          value={record.desc}
          width="md"
        />
      </div>
    </Modal>
  );
};
export default DetailModal;
