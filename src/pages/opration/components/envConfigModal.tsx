import React, { useEffect, useState } from 'react';
import { Button, Modal, Space } from 'antd';
import './index.less'
import CodeMirrorEditorModal from '@/components/CodeMirror';
import { ProForm } from '@ant-design/pro-components';
import { getEnvConfigListAPI } from '@/services/envConfig';
let newCode = ''
const EnvConfigModal: React.FC<any> = (props: any) => {
  const { visible, isShowModal, onFinish,record } = props;
  const onModealCancel = () => {
    isShowModal(false);
  };
  const [formObj] = ProForm.useForm();
  const [code, setCode] = useState('');
  const [count, setCount] = useState(1);
  const handleCodeChange = (value: string) => {
    setCount(2)
    newCode = value
  };

  const onFinish1 = async () => {
    if(count == 1){
      onModealCancel()
      return
    }else{
      onFinish(newCode)
    }
  }
  // 获取envConfig
  const getEnvConfig = async () => {
    const param = {
      env: record.env,
      sname: record.sname,
      organize: record.organize
    }
    const { data: { envs } } = await getEnvConfigListAPI(param)
    setTimeout(() => {
      setCode(envs)
    },500)
  }

  useEffect(() => {
    if(record){
      getEnvConfig()
    }

  }, [record])
  return (
    <Modal
      title='ENV配置'
      width={1280}
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
        onFinish={onFinish1}
        form={formObj}
      >
      <div className='env-content'>
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
