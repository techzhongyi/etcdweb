import React from 'react';
import { Button, Modal, Space } from 'antd';
import ProForm, { ProFormTextArea } from '@ant-design/pro-form';
import './index.less';
import { getStorage } from '@/utils/storage';
import { ProDescriptions } from '@ant-design/pro-components';
const CommentModal: React.FC<any> = (props: any) => {
  const [formObj] = ProForm.useForm();
  const { visible, isShowModal, onFinish, record } = props;
  const onModealCancel = () => {
    isShowModal(false);
  };
  return (
    <Modal
      title='评论'
      width={766}
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
                  提交
                </Button>
              </Space>
            </div>
          ),
        }}
        onFinish={onFinish}
        form={formObj}
      >
        <ProDescriptions column={4}>
          <ProDescriptions.Item valueType="text" label="项目名称">
            {record.organize}
          </ProDescriptions.Item>
          <ProDescriptions.Item valueType="text" label="版本号">
            {record.branch}
          </ProDescriptions.Item>
          <ProDescriptions.Item valueType="text" label="环境">
            {getStorage('env')}
          </ProDescriptions.Item>
        </ProDescriptions>
        <ProFormTextArea
          name="content"
          label="评论信息"
          placeholder="请输入评论信息"
          fieldProps={{
            maxLength: 499,
            style:{
              height: '300px'
            }
          }}
          width={500}
          rules={[
            {
              required: true,
              message: '请输入评论信息！',
            },
          ]}
        />
      </ProForm>
    </Modal>
  );
};
export default CommentModal;
