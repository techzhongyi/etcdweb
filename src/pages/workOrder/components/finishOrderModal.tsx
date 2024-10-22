import React, { useEffect, useState } from 'react';
import { Button, Modal, Skeleton, Space, message } from 'antd';
import ProForm, { ProFormTextArea } from '@ant-design/pro-form';
import { propertyModalType } from '../../data';
import AliyunOSSUpload from '@/components/AliYunOSSupload';
import { PlusOutlined } from '@ant-design/icons';
const FinishOrderModal: React.FC<propertyModalType> = (props: any) => {
  const [formObj] = ProForm.useForm();
  const [url, setUrl] = useState([]);
  const {
    visible,
    isShowModal,
    onFinish,
    record,
    editId,
    loading = false,
  } = props;
  const onModealCancel = () => {
    isShowModal(false);
  };
  const setResume = (file: any, status: any, files: any) => {
    if (status === 'uploading') {
      setUrl(files);
    } else if (status === 'done') {
      setUrl(files);
      formObj.setFieldsValue({ images: files.map((item: any) => item.url) });
      message.success('上传成功');
    } else if (status === 'removed') {
      setUrl(files);
      formObj.setFieldsValue({ images: files.map((item: any) => item.url) });
    }
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
    </div>
  );
  return (
    <Modal
      title={'结束工单'}
      maskClosable={false}
      width={800}
      footer={null}
      open={visible}
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
                  loading={loading}
                  key="submit"
                  onClick={() => props_.form?.submit?.()}
                >
                  结束
                </Button>
              </Space>
            </div>
          ),
        }}
        onFinish={onFinish}
        form={formObj}
      >
        <ProForm.Item
          name="images"
          label="图片"
          rules={[
            {
              required: true,
              message: '请上传图片!',
            },
          ]}
        >
          <AliyunOSSUpload
            accept="image/*"
            setSrc={setResume}
            fileList={url}
            maxCount={5}
            listType={'picture-card'}
          >
            {url?.length >= 5 ? null : uploadButton}
          </AliyunOSSUpload>
        </ProForm.Item>
        <ProFormTextArea
          label="描述"
          name="desc"
          fieldProps={{
            maxLength: 499,
          }}
          rules={[
            {
              required: true,
              message: '请输入描述！',
            },
          ]}
          width="md"
        />
      </ProForm>
    </Modal>
  );
};
export default FinishOrderModal;
