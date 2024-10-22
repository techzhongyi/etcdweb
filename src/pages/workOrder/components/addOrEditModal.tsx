import React, { useEffect, useState } from 'react';
import { Button, Modal, Skeleton, Space, message } from 'antd';
import ProForm, { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { ProFormRadio, ProFormSelect } from '@ant-design/pro-components';
import { getCategoryType } from '@/services/interfaceType';
import { propertyModalType } from '../../data';
import Help from '@/utils/help';
import AliyunOSSUpload from '@/components/AliYunOSSupload';
import { PlusOutlined } from '@ant-design/icons';
import { getProblemTypeListAPI } from '@/services/permissions/question';
const WorkOrderAddOrEditModal: React.FC<propertyModalType> = (props: any) => {
  const [initialValues, setInitialValues] = useState(undefined);
  const [initialValues1, setInitialValues1] = useState({
    type: 1,
  });
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
  useEffect(() => {
    if (record) {
      setInitialValues({
        ...record,
      });
      setInitialValues1({
        ...record,
      });
    }
  }, [record]);
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
  // 获取问题列表
  const questionList = async () => {
    const array: { label: any; value: any }[] = [];
    const param = {
      $tableLimit: {
        page: 1,
        count: 1000,
      },
      $tableSearch: [],
      $tableSort: [],
    };
    const {
      data: { list },
      status,
    } = await getProblemTypeListAPI(param);
    if (status === 0) {
      list?.map((item: any) => {
        array.push({ label: item.name, value: item.id });
      });
      return array;
    } else {
      return [];
    }
  };
  return (
    <Modal
      title={editId ? '编辑工单' : '创建工单'}
      maskClosable={false}
      width={1024}
      footer={null}
      open={visible}
      onCancel={onModealCancel}
      destroyOnClose={true}
    >
      {initialValues === undefined && editId !== undefined ? (
        <Skeleton active={true} paragraph={{ rows: 3 }} />
      ) : (
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
                    创建
                  </Button>
                </Space>
              </div>
            ),
          }}
          onFinish={onFinish}
          initialValues={initialValues1}
          form={formObj}
        >
          <ProFormRadio.Group
            width="lg"
            name="type"
            label="工单类型"
            options={getCategoryType()}
          />
          <ProFormText
            name="license"
            label="车牌号"
            placeholder="请输入车牌号"
            width="lg"
            fieldProps={{
              maxLength: 100,
            }}
            rules={[
              {
                required: true,
                message: '请输入车牌号!',
              },
              {
                pattern: Help.Regular.license,
                message: '请输入正确的车牌号！',
              },
            ]}
          />
          <ProFormSelect
            width="lg"
            request={() => questionList()}
            name="problem_id"
            label="问题类型"
            placeholder="请选择问题类型"
            rules={[
              {
                required: true,
                message: '请选择问题类型！',
              },
            ]}
          />
          <ProFormText
            name="contact_name"
            label="申请人"
            placeholder="请输入申请人姓名"
            width="lg"
            fieldProps={{
              maxLength: 100,
            }}
          />
          <ProFormText
            name="contact_phone"
            label="联系方式"
            placeholder="请输入联系方式"
            width="lg"
            fieldProps={{
              maxLength: 11,
            }}
            rules={[
              {
                pattern: Help.Regular.mobilePhone,
                message: '请输入正确的手机号码！',
              },
            ]}
          />
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
              isShowUploadList={{
                showRemoveIcon: true,
              }}
              listType={'picture-card'}
            >
              {url?.length >= 5 ? null : uploadButton}
            </AliyunOSSUpload>
          </ProForm.Item>
          <ProFormTextArea
            label="备注"
            name="desc"
            fieldProps={{
              maxLength: 499,
            }}
            width="md"
          />
        </ProForm>
      )}
    </Modal>
  );
};
export default WorkOrderAddOrEditModal;
