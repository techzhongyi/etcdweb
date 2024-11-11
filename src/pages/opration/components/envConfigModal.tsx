import React, { useEffect, useState } from 'react';
import { Button, Card, message, Modal, Space } from 'antd';
import './index.less'
import CodeMirrorEditorModal from '@/components/CodeMirror';
import { ProForm } from '@ant-design/pro-components';
import { getServiceListAPI } from '@/services/comservice';
import { getStorage } from '@/utils/storage';
import eventBus from '@/utils/eventBus';
import { editEnvConfigAPI, getEnvConfigListAPI } from '@/services/envConfig';
let newCode = ''
const EnvConfigModal: React.FC<any> = (props: any) => {
  const { visible, isShowModal, record, onFinish } = props;
  const onModealCancel = () => {
    isShowModal(false);
  };
  const [formObj] = ProForm.useForm();
  const [servicesList, setServicesList] = useState([])
  const [activeIndex, setActiveIndex] = useState('')
  const [sname, setSname] = useState('');
  const [code, setCode] = useState('');
  const [count, setCount] = useState(1);
  const handleCodeChange = (value: string) => {
    setCount(2)
    newCode = value
  };

  // const onFinish = async () => {
  //   if(count == 1){
  //     return
  //   }
  //   const param = {
  //     env: getStorage('env'),
  //     sname,
  //     envs: newCode,
  //     organize: getStorage('organize')
  //   }
  //   console.log(param)
  //   const {status, msg } = await editEnvConfigAPI(param)
  //   if (status === 0) {
  //     message.success('修改成功')
  //   } else {
  //     message.warning(msg)
  //   }
  // }
  // 获取envConfig
  const getEnvConfig = async (name: string) => {
    const param = {
      env: getStorage('env'),
      sname: name,
      organize: getStorage('organize')
    }
    const { data: { envs } } = await getEnvConfigListAPI(param)
    setCode(envs)
  }
  // 获取微服务列表
  const getServiceList = async (env) => {
    const param = {
      env: env ? env : getStorage('env'),
      organize: getStorage('organize')
    }
    console.log(env)
    const { data: { items } } = await getServiceListAPI(param)
    setServicesList(items)
  }
  const handleEvent = (env) => {
    setActiveIndex('')
    getServiceList(env)
  }
  useEffect(() => {
    getServiceList(getStorage('env'))
    eventBus.on('envChange', (env) => { handleEvent(env) });
    return () => {
      eventBus.off('envChange', handleEvent);
    }
  }, [])
  const selectSevices = (e) => {
    setActiveIndex(e)
    setSname(e)
    getEnvConfig(e)
  }
  return (
    <Modal
      title='ENV配置'
      width={1400}
      footer={null}
      open={visible}
      maskClosable={false}
      onCancel={onModealCancel}
      destroyOnClose={true}
    >

      <ProForm
        submitter={{
          render: (props_) => (
            <div style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={onModealCancel}>取消</Button>
                <Button
                  type="primary"
                  key="submit"
                  onClick={() => props_.form?.submit?.()}
                >
                  保存
                </Button>
              </Space>
            </div>
          ),
        }}
        onFinish={onFinish}
        form={formObj}
      >
      <div className='env-content'>
        <div className='env-list-select'>
          <div className='env-content-title'>微服务列表</div>
          <div className='env-item-list'>
            {
              servicesList.map(item => {
                return (
                  <div className={activeIndex === item ? 'item-active' : ''} onClick={() => {
                    selectSevices(item)
                  }}>{item}</div>
                )
              })
            }
          </div>

        </div>
        <div className='envconfig-right-content'>
          <CodeMirrorEditorModal
            value={code}
            language="javascript"
            onChange={handleCodeChange}
            height={500}
          />
        </div>
      </div>
    </ProForm>
    </Modal >
  );
};
export default EnvConfigModal;
