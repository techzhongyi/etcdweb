import React, { useRef, useState } from 'react';
import ProForm, { ModalForm, ProFormSelect } from '@ant-design/pro-form';
import { Button, message, Modal, Space } from 'antd';
import { getInternList } from '@/services/intern/intern';
interface modalType {
  visible: boolean;
  close: any;
  onFinish: any;
}

const ShareModal: React.FC<modalType> = (prop) => {
  const { visible, close, onFinish } = prop;

  //获取实习生列表
  const internList = async () => {
    const array: { label: any; value: any; disabled: any }[] = [];
    const {
      data: { items },
      status,
    } = await getInternList({ page: 1, count: 1000 });
    if (status === 0) {
      items.map((item: any, index: Number) => {
        array.push({
          label: item.name,
          value: item.id,
          disabled: item.enable === 1 ? false : true,
        });
      });

      return array;
    } else {
      return [];
    }
  };

  return (
    <ModalForm
      width="332px"
      visible={visible}
      modalProps={{
        onCancel: close,
        centered: true,
      }}
      onFinish={onFinish}
      title="转发"
      submitter={{
        render: (props, dom) => (
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={close}>取消</Button>
              <Button
                type="primary"
                key="submit"
                onClick={() => props.form?.submit?.()}
              >
                提交
              </Button>
            </Space>
          </div>
        ),
      }}
    >
      <ProFormSelect
        label="实习生姓名"
        mode="multiple"
        name="intern_user_ids"
        width="sm"
        placeholder="请选择"
        request={internList}
        rules={[
          {
            required: true,
            message: '请选择实习生！',
          },
        ]}
        fieldProps={{
          maxLength: 30,
          optionItemRender(item) {
            return item.label;
          },
        }}
      />
    </ModalForm>
  );
};

export default ShareModal;
