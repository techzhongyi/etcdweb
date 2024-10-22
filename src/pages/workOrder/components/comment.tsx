import React, { useEffect, useState } from 'react';
import { Button, Modal, Image, Rate } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import './index.less';
import { propertyModalType } from '../data';
import { getWorkOrderDetailAPI } from '@/services/workOrder';
const CommentModal: React.FC<propertyModalType> = (props: any) => {
  const { visible, isShowModal, record, editId, loading = false } = props;
  const [comment, setComment] = useState({
    desc: '',
    score: null,
    images: [],
  });
  const onModealCancel = () => {
    isShowModal(false);
  };
  // 获取详情
  const getDetail = async (id: string | string[]) => {
    const { data } = await getWorkOrderDetailAPI({ id });
    if (Object.keys(data.comment).length != 0) {
      setComment(data.comment);
    }
  };
  useEffect(() => {
    getDetail(editId);
  }, [editId]);
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
      {comment.score != null && (
        <ProCard title="司机评价">
          <div className="timeline-rate">
            <div className="marginR10">评价:</div>
            <div>
              <Rate disabled defaultValue={comment.score} />
            </div>
          </div>
          <div className="timeline-img">
            <div className="marginR10">图片:</div>
            <Image.PreviewGroup>
              {comment.images.map((item) => {
                return (
                  <Image
                    rootClassName="imgBox"
                    width={60}
                    height={60}
                    src={item}
                  />
                );
              })}
            </Image.PreviewGroup>
          </div>
          <div className="timeline-desc">
            <div className="marginR10">描述: </div>
            <div>{comment.desc}</div>
          </div>
        </ProCard>
      )}
    </Modal>
  );
};
export default CommentModal;
