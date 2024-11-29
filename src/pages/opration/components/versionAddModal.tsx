import { ProForm, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Modal, Space } from 'antd';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import { ProDescriptions } from '@ant-design/pro-components';

const VersionAddOrEditModal: React.FC<any> = (
  props: any,
) => {
  const [formObj] = ProForm.useForm();
  const { visible, isShowModal, onFinish, record, editId } = props;
  const [initialValues, setInitialValues] = useState(undefined);
  const title = '版本修订'
  useEffect(() => {
    if (record) {
      setInitialValues({
        ...record,
      });
    }
  }, [record]);

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
        initialValues={initialValues}
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
            {history?.location?.query?.env}
          </ProDescriptions.Item>
        </ProDescriptions>
        <ProFormTextArea
          label="修订"
          name="revision"
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
                message: '请填写修订信息！',
            }
        ]}
        />
      </ProForm>
    </Modal>
  );
};
export default VersionAddOrEditModal;
