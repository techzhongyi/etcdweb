import React, { useEffect, useState } from 'react';
import { Button, Modal, Image } from 'antd';
import './index.less';
const ImageModal: React.FC<any> = (props: any) => {
  const { visible, isShowModal, title, list } = props;
  const [images, setImages] = useState<string[]>([]);
  useEffect(() => {
    if (Array.isArray(list)) {
      setImages(list);
    } else {
      setImages([list]);
    }
  }, [list]);
  const onModealCancel = () => {
    isShowModal(false);
  };
  return (
    <Modal
      title={title}
      width={800}
      open={visible}
      maskClosable={false}
      footer={[
        <Button key="back" onClick={onModealCancel}>
          关闭
        </Button>,
      ]}
      onCancel={onModealCancel}
      destroyOnClose={true}
    >
      <div className="image-container">
        <Image.PreviewGroup>
          {images.map((item) => {
            return (
              <div style={{ marginRight: '5px' }}>
                <Image width={120} src={item} />
              </div>
            );
          })}
        </Image.PreviewGroup>
      </div>
    </Modal>
  );
};
export default ImageModal;
