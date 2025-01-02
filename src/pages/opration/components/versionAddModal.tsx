import { ProForm, ProFormRadio, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Modal, Skeleton, Space, message } from 'antd';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import { ProDescriptions } from '@ant-design/pro-components';
import { getVersionListAPI } from '@/services/version';

const VersionAddOrEditModal: React.FC<any> = (
  props: any,
) => {
  const [formObj] = ProForm.useForm();

  const { visible, isShowModal, onFinish, record } = props;
  const [initialValues, setInitialValues] = useState({
    vclosed: 0
  });
  const [initialDefaultValues, setInitialDefaultValues] = useState(undefined);
  const title = '版本修订'
  useEffect(() => {
    if (record) {
      setInitialValues({
        organize: record.organize,
        vclosed: 0
      });
      setInitialDefaultValues({
        organize: record.organize,
        vclosed: 0
      });
    }
  }, [record]);
  //获取版本列表
  const getVersionSelectList = async () => {
    const array: { label: any; value: any }[] = [];
    const params = {
      env: history?.location?.query?.env,
      organize: record.organize,
      // organize: 'gkzyrent',
    }
    const {
      data: { items },
      status,
    } = await getVersionListAPI(params);
    if (status === 0) {
      if (items.length > 0) {
        formObj.setFieldsValue({
          version: items[0]
        })
      }
      items?.map((item: any) => {
        array.push({ label: item, value: item });
      });
      return array;
    } else {
      return [];
    }
  };
  const onModealCancel = () => {
    isShowModal(false);
  };


  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onModealCancel}
      footer={null}
      maskClosable={false}
      destroyOnClose={true}
      width={780}
    >
      {
        initialDefaultValues === undefined ? (
          <Skeleton active={true} paragraph={{ rows: 3 }} />
        ) : <ProForm
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
          initialValues={initialValues}
          form={formObj}
        >
          <ProDescriptions column={4}>
            <ProDescriptions.Item valueType="text" label="项目名称">
              {record.organize}
            </ProDescriptions.Item>
            {/* <ProDescriptions.Item valueType="text" label="版本号">
            {record.branch}
          </ProDescriptions.Item> */}
            <ProDescriptions.Item valueType="text" label="环境">
              {history?.location?.query?.env}
            </ProDescriptions.Item>
          </ProDescriptions>
          <ProFormSelect
            allowClear={false}
            label="版本号"
            name="branch"
            width="sm"
            request={() => getVersionSelectList()}
            placeholder="请选择版本号"
            fieldProps={{
              labelInValue: true
            }}
            rules={[
              {
                required: true,
                message: '请选择版本号！',
              },
            ]}
          />
          <ProFormRadio.Group
            name="vclosed"
            label="版本完结"
            options={[
              {
                label: '是',
                value: 1,
              },
              {
                label: '否',
                value: 0,
              }
            ]}
          />
          <ProFormTextArea
            label="修订"
            name="revision"
            fieldProps={{
              maxLength: 499,
              style: {
                height: '300px'
              }
            }}
            width={500}
            rules={[
              {
                required: true,
                message: '请填写修订信息！',
              }
            ]}
          />
        </ProForm>
      }

    </Modal>
  );
};
export default VersionAddOrEditModal;
