import React, { useEffect, useState } from 'react';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Select } from 'antd';
import './index.less'
import CodeMirrorEditorModal from '@/components/CodeMirror';
import { ProForm } from '@ant-design/pro-components';

const Index: React.FC = () => {
  const [formObj] = ProForm.useForm();
  const [code, setCode] = useState(`
  import java.util.*;
  import com.alibaba.fastjson.JSON;
  import com.alibaba.fastjson.JSONArray;
  import com.alibaba.fastjson.JSONObject;
  import com.alibaba.fastjson.TypeReference;
  `);
  const handleCodeChange = (value: string) => {
    setCode(value);
    console.log(value);
  };
  const onFinish = () => {

  }
  const serviceChange = (e) => {

  }
  useEffect(() => {
  }, [])
  return (
    <PageContainer
      ghost
      header={{
        title: ' ',
        breadcrumb: {},
      }}
    >
      <ProForm
        submitter={{
          render: (props) => (
            <FooterToolbar>
              {/* <Button key="rest" onClick={() => history.push('/custom/lease')}>
                取消
              </Button> */}
              <Button
                type="primary"
                key="submit2"
                onClick={() => {
                  props.form?.submit?.();
                  // props.form?.validateFields().then(value=>{
                  //   props.form?.submit?.();
                  // }).catch()
                }}
              >
                保存
              </Button>
            </FooterToolbar>
          ),
        }}
        onFinish={onFinish}
        form={formObj}
      >
        <Card title='ENV配置' style={{ marginBottom: '20px' }}>
          <div className='env-content'>
            <div className='env-list-select'>
              <div>
                <Select
                  defaultValue=""
                  style={{ width: 200 }}
                  onChange={(e) => { serviceChange(e) }}
                  options={[
                    {
                      value: '',
                      label: '微服务',
                    },
                    {
                      value: '1',
                      label: '微服务1',
                    },
                    {
                      value: '2',
                      label: '微服务2',
                    },
                    {
                      value: '3',
                      label: '微服务3',
                    },
                  ]}
                />
              </div>
              <div className='env-item-list'>
                <div>hcore</div>
                <div>pcore</div>
                <div>user</div>
                <div>assets</div>
              </div>

            </div>
            <div className='envconfig-right-content'>
              <CodeMirrorEditorModal
                value={code}
                language="javascript"
                onChange={handleCodeChange}
              />
            </div>
          </div>
        </Card>
      </ProForm>
    </PageContainer>
  );
};
export default Index;
