import React, { useEffect, useState } from 'react';
import { Button, Modal, Skeleton, Space, message } from 'antd';
import ProForm, {
  ProFormText,
  ProFormList,
  ProFormTextArea,
} from '@ant-design/pro-form';
import {
  ProFormGroup,
  ProFormRadio,
  ProFormSelect,
} from '@ant-design/pro-components';
import { propertyModalType } from '../../data';
import AliyunOSSUpload from '@/components/AliYunOSSupload';
import { PlusOutlined } from '@ant-design/icons';
import Help from '@/utils/help';
const FollowUpAddOrEditModal: React.FC<propertyModalType> = (props: any) => {
  const [initialValues, setInitialValues] = useState({
    type: 1,
  });
  const [type, setType] = useState<number>(1);
  const [formObj] = ProForm.useForm();
  const [url, setUrl] = useState([]);
  const {
    visible,
    isShowModal,
    onFinish,
    record,
    editId,
    editType,
    loading = false,
  } = props;
  const followType = [
    {
      label: '一般跟进',
      value: 1,
    },
    {
      label: '定损定责',
      value: 2,
    },
  ];
  const dutyTypeList = [
    {
      label: '司机',
      value: 1,
    },
    {
      label: '其他',
      value: 2,
    },
  ];
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
      title="跟进"
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
                  提交
                </Button>
              </Space>
            </div>
          ),
        }}
        onFinish={onFinish}
        initialValues={initialValues}
        form={formObj}
      >
        <ProFormRadio.Group
          width="lg"
          name="type"
          label="跟进方式"
          options={followType}
          fieldProps={{
            onChange: (val) => {
              setType(val.target.value);
            },
          }}
        />
        {type === 2 && (
          <>
            <ProFormSelect
              width="md"
              options={dutyTypeList}
              name="duty_type"
              label="责任方"
              placeholder="请选择责任方"
              rules={[
                {
                  required: true,
                  message: '请选择责任方！',
                },
              ]}
            />
            <ProFormList
              name="pay_items"
              label="明细"
              rules={[
                {
                  required: true,
                  validator: async (_, value) => {
                    console.log(value);
                    if (value && value.length > 0) {
                      return;
                    }
                    throw new Error('至少要有一项！');
                  },
                },
              ]}
              creatorButtonProps={{
                creatorButtonText: '添加',
              }}
              initialValue={[
                {
                  pay_name: '',
                  pay_amount: '',
                },
              ]}
            >
              <ProFormGroup key="group">
                <ProFormText
                  name="pay_name"
                  label="收费项"
                  rules={[
                    {
                      required: true,
                      message: '请输入收费项！',
                    },
                  ]}
                />
                <ProFormText
                  name="pay_amount"
                  label="金额"
                  rules={[
                    {
                      required: true,
                      message: '请输入金额！',
                    },
                    {
                      pattern: Help.Regular.number.intege_lose,
                      message: '请输入正确的金额',
                    },
                  ]}
                />
              </ProFormGroup>
            </ProFormList>
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
          </>
        )}
        {type != 2 && (
          <>
            <ProForm.Item name="images" label="图片">
              <AliyunOSSUpload
                accept="image/*"
                setSrc={setResume}
                fileList={url}
                maxCount={6}
                listType={'picture-card'}
              >
                {url?.length >= 6 ? null : uploadButton}
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
                  message: '请填写描述!',
                },
              ]}
              width="md"
            />
          </>
        )}
      </ProForm>
    </Modal>
  );
};
export default FollowUpAddOrEditModal;
