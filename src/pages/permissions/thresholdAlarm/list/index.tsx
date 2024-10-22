import type { ProFormInstance } from '@ant-design/pro-components';
import {
  PageContainer,
  ProForm,
  ProFormDateRangePicker,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
} from '@ant-design/pro-components';
import { message } from 'antd';
import React, { useRef, useState } from 'react';

const Index: React.FC = () => {
  const [initialValues, setInitialValues] = useState({
    radio: 'a',
    name: '10',
    company: '10',
    contract: '10',
  });
  const formRef = useRef<
    ProFormInstance<{
      name: string;
      company?: string;
      useMode?: string;
    }>
  >();
  return (
    <PageContainer
      ghost
      header={{
        title: ' ',
        breadcrumb: {},
      }}
    >
      <ProForm<{
        name: string;
        company?: string;
        useMode?: string;
      }>
        onFinish={async (values) => {
          message.success('提交成功');
        }}
        formRef={formRef}
        params={{ id: '100' }}
        //   formKey="base-form-use-demo"
        //   dateFormatter={(value, valueType) => {
        //     console.log('---->', value, valueType);
        //     return value.format('YYYY/MM/DD HH:mm:ss');
        //   }}

        autoFocusFirstInput
        initialValues={initialValues}
      >
        <ProForm.Group>
          <ProFormRadio.Group
            name="radio"
            label="运营范围"
            options={[
              {
                label: '山东',
                value: 'a',
              },
              {
                label: '河南',
                value: 'b',
              },
              {
                label: '山西',
                value: 'c',
              },
            ]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width="md"
            name="name"
            label="最大停留时长>=(天)"
            placeholder="请输入"
            rules={[{ required: true, message: '这是必填项' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width="md"
            name="name"
            label="失联时长>=(天)"
            placeholder="请输入"
            rules={[{ required: true, message: '这是必填项' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            width="md"
            name="company"
            label="剩余年检时间>=(天)"
            placeholder="请输入"
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormText
            name="contract"
            width="md"
            label="租金已逾期>=(天)"
            placeholder="请输入"
          />
        </ProForm.Group>
        <ProForm.Group>
          {/* <ProFormDateRangePicker
          width="md"
          name={['contract', 'createTime']}
          label="合同生效时间"
        /> */}
        </ProForm.Group>
      </ProForm>
    </PageContainer>
  );
};

export default Index;
