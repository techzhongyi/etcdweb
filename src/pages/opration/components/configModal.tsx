import React, { useEffect,useState } from 'react';
import { Button, Modal } from 'antd';
import { detectOS } from '@/utils/common';
import './index.less';
const ConfigModal: React.FC<any> = (props: any) => {
  const { visible, isShowModal,record } = props;
  const [isScroll, setIsScroll] = useState(false)
  const onModealCancel = () => {
    isShowModal(false);
  };
  useEffect(() => {
    const div = document.getElementById('log-box')
    window.addEventListener('scroll', () => {
      const aftertop = div?.scrollTop;//兼容
      if (aftertop - befortop > 0) {
        console.log('向下');
        setIsScroll(false)
      } else {
        console.log('向上');
        setIsScroll(true)
      }
      befortop = aftertop;
    }, true)
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        setIsScroll(false)
      }
    })
    if (div && !isScroll) {
      div.scrollTop = div.scrollHeight
    }
  }, [record])
  return (
    <Modal
      title='日志'
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
      <div className='log-box'>
        {
          <div id='log-box' style={{ fontFamily: detectOS() == 'Mac' ? 'monospace' : 'cursive', height: '400px', overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: 12313312 }}></div>
        }
      </div>
    </Modal>
  );
};
export default ConfigModal;
