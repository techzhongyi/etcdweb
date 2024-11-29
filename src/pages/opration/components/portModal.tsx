import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import './index.less';
import { getApiAPI } from '@/services/version';
import DisCodeMirrorEditorModal from '@/components/DisableCodeMirror';
const PortModal: React.FC<any> = (props: any) => {
  const { visible, isShowModal, record, branch } = props;
  const [isScroll, setIsScroll] = useState(false)
  const [port, setPort] = useState('')
  const onModealCancel = () => {
    isShowModal(false);
  };
  const getDetail = async () => {
    const params = {
      env: record.env,
      organize: record.organize,
      branch,
      sname: record.sname
    }
    const { data: { api } } = await getApiAPI(params)
    setPort(api)
  }
  useEffect(() => {
    if (record) {
      getDetail()
    }
  }, [record])
  let befortop = 0
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
      title='接口'
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
        <DisCodeMirrorEditorModal
          value={port}
          language="javascript"
          height={500}
        />
        {/* {
          <div id='log-box' style={{ fontFamily: detectOS() == 'Mac' ? 'monospace' : 'cursive', height: '400px', overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: port }}></div>
        } */}
      </div>
    </Modal>
  );
};
export default PortModal;
