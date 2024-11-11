import { getOpVersionDetailAPI } from '@/services/version';
import { getStorage } from '@/utils/storage';
import {
  ProForm
} from '@ant-design/pro-components';
import { Button, List, Modal, Space } from 'antd';
import { useEffect, useState } from 'react';

const VersionDetailModal: React.FC<any> = (
  props: any,
) => {
  const [formObj] = ProForm.useForm();
  const { visible, isShowModal, onFinish, record, editId } = props;
  const [applylogs, setApplylogs] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [revisions, setRevisions] = useState<any[]>([]);
  const title = '详情'
  const getDetail = async () => {
    const params = {
      organize: record.organize,
      env: getStorage('env'),
      branch: record.branch
    }
    const { data: { applylogs, revisions, comments } } = await getOpVersionDetailAPI(params)
    setApplylogs(applylogs)
    setComments(comments)
    setRevisions(revisions)
  }
  useEffect(() => {
    if (record) {
      getDetail()
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
              {
                revisions.map(item => {
                  return (
                    <div className='info-content-list'>
                      <div className='list-title'>{item.auth} {item.ts}</div>
                      <div>{item.revision}</div>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className='Upgrades-info'>
            <div className='info-title'>升级信息</div>
            <div className='info-content'>
              {
                applylogs.map(item => {
                  return (
                    <div className='info-content-list'>
                      <div className='list-title'>{item.auth} {item.ts}</div>
                      <div>{item.info}</div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
        <div className='detail-right'>
          <div className='info-title'>评论信息</div>
          <div className='info-content'>
            {
              comments.map(item => {
                return (
                  <div className='info-content-list'>
                    <div className='list-title'>{item.auth} {item.ts}</div>
                    <div>{item.content}</div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>

    </Modal>
  );
};
export default VersionDetailModal;
