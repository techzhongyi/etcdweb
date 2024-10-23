import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';
import './index.less'
import CodeMirrorEditorModal from '@/components/CodeMirror';

const Index: React.FC = () => {
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
      <Card title='ENV配置' style={{ marginBottom: '20px' }}>
        <CodeMirrorEditorModal
          value={code}
          language="javascript"
          onChange={handleCodeChange}
        />
      </Card>
    </PageContainer>
  );
};
export default Index;
