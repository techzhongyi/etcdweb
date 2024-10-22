import React, { useEffect, useState } from 'react';
import { Button, Modal, Skeleton, Space } from 'antd';
import ProForm, { ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { categoryItemType, FormValues } from '../../data';
import {
  getBackType,
  getBatteryType,
  getCategoryType,
  getPullPinType,
  getSeatHighType,
} from '@/services/interfaceType';
import Help from '@/utils/help';
interface categoryModalType {
  visible: boolean;
  record?: categoryItemType | undefined;
  editId?: string;
  loading?: boolean;
  isShowModal: (show: boolean, _record?: categoryItemType, id?: string) => void;
  onFinish: (value: FormValues) => void;
}
const CategoryAddOrEditModal: React.FC<categoryModalType> = (props: any) => {
  const [formObj] = ProForm.useForm();
  const {
    visible,
    isShowModal,
    onFinish,
    record,
    editId,
    loading = false,
  } = props;
  const [initialValues, setInitialValues] = useState(undefined);
  const [category, setCategory] = useState(null);
  const title = editId === undefined ? '新增类别' : '编辑类别';
  const categoryTypeChange = (value: any) => {
    setCategory(value);
  };
  useEffect(() => {
    if (record) {
      setInitialValues({
        ...record,
      });
      setCategory(record.type);
    }
  }, [record]);

  const onModealCancel = () => {
    isShowModal(false);
  };
  return (
    <Modal
      title={title}
      width={766}
      footer={null}
      open={visible}
      maskClosable={false}
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
          <ProFormSelect
            width="md"
            options={getCategoryType()}
            name="type"
            label="类别"
            placeholder="请选择类别"
            fieldProps={{
              onChange: (val) => categoryTypeChange(val),
            }}
            rules={[
              {
                required: true,
                message: '请选择类别！',
              },
            ]}
          />
          {category === 1 && (
            <>
              <ProFormText
                width="md"
                name="brand"
                label="品牌"
                fieldProps={{
                  maxLength: 29,
                }}
                placeholder="请输入品牌"
                rules={[
                  {
                    required: true,
                    message: '请输入品牌!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="model"
                label="车型"
                fieldProps={{
                  maxLength: 29,
                }}
                placeholder="请输入车型"
                rules={[
                  {
                    required: true,
                    message: '请输入车型!',
                  },
                ]}
              />
              <ProFormSelect
                width="md"
                options={getBatteryType()}
                name="battery_type"
                label="电池品牌"
                placeholder="请选择电池品牌"
                rules={[
                  {
                    required: true,
                    message: '请选择电池品牌！',
                  },
                ]}
              />
              <ProFormSelect
                width="md"
                options={getBackType()}
                name="back_turn_redius"
                label="后回转半径"
                placeholder="请选择后回转半径"
                rules={[
                  {
                    required: true,
                    message: '请选择后回转半径！',
                  },
                ]}
              />
              <ProFormSelect
                width="md"
                options={getSeatHighType()}
                name="seat_high"
                label="鞍座高度"
                placeholder="请选择鞍座高度"
                rules={[
                  {
                    required: true,
                    message: '请选择鞍座高度！',
                  },
                ]}
              />
              <ProFormSelect
                width="md"
                options={getPullPinType()}
                name="pull_pin"
                label="牵引销"
                placeholder="请选择牵引销"
                rules={[
                  {
                    required: true,
                    message: '请选择牵引销！',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="battery_life"
                label="厂标续航(KM)"
                fieldProps={{
                  maxLength: 29,
                }}
                placeholder="请输入厂标续航"
                rules={[
                  {
                    required: true,
                    message: '请输入厂标续航!',
                  },
                  {
                    pattern: Help.Regular.number.just,
                    message: '请输入正确的厂标续航！',
                  },
                ]}
              />
            </>
          )}
          {(category === 2 || category === 3) && (
            <>
              <ProFormText
                width="md"
                name="brand"
                label="品牌"
                fieldProps={{
                  maxLength: 29,
                }}
                placeholder="请输入品牌"
                rules={[
                  {
                    required: true,
                    message: '请输入品牌!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="model"
                label="车型"
                fieldProps={{
                  maxLength: 29,
                }}
                placeholder="请输入车型"
                rules={[
                  {
                    required: true,
                    message: '请输入车型!',
                  },
                ]}
              />
              <ProFormSelect
                width="md"
                options={getBatteryType()}
                name="battery_type"
                label="电池品牌"
                placeholder="请选择电池品牌"
                rules={[
                  {
                    required: true,
                    message: '请选择电池品牌！',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="battery_life"
                label="厂标续航"
                fieldProps={{
                  maxLength: 29,
                }}
                placeholder="请输入厂标续航"
                rules={[
                  {
                    required: true,
                    message: '请输入厂标续航!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="cube"
                label="载货立方"
                fieldProps={{
                  maxLength: 29,
                }}
                placeholder="请输入载货立方"
                rules={[
                  {
                    required: true,
                    message: '请输入载货立方!',
                  },
                ]}
              />
            </>
          )}
          {category === 4 && (
            <>
              <ProFormText
                width="md"
                name="brand"
                label="品牌"
                fieldProps={{
                  maxLength: 29,
                }}
                placeholder="请输入品牌"
                rules={[
                  {
                    required: true,
                    message: '请输入品牌!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="model"
                label="车型"
                fieldProps={{
                  maxLength: 29,
                }}
                placeholder="请输入车型"
                rules={[
                  {
                    required: true,
                    message: '请输入车型!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="size"
                label="尺寸"
                fieldProps={{
                  maxLength: 29,
                }}
                placeholder="请输入尺寸"
                rules={[
                  {
                    required: true,
                    message: '请输入尺寸!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="cube"
                label="载货立方"
                fieldProps={{
                  maxLength: 29,
                }}
                placeholder="请输入载货立方"
                rules={[
                  {
                    required: true,
                    message: '请输入载货立方!',
                  },
                ]}
              />
            </>
          )}
          {category === 5 && (
            <>
              <ProFormText
                width="md"
                name="brand"
                label="品牌"
                fieldProps={{
                  maxLength: 29,
                }}
                placeholder="请输入品牌"
                rules={[
                  {
                    required: true,
                    message: '请输入品牌!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="model"
                label="车型"
                fieldProps={{
                  maxLength: 29,
                }}
                placeholder="请输入车型"
                rules={[
                  {
                    required: true,
                    message: '请输入车型!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="size"
                label="尺寸"
                fieldProps={{
                  maxLength: 29,
                }}
                placeholder="请输入尺寸"
                rules={[
                  {
                    required: true,
                    message: '请输入尺寸!',
                  },
                ]}
              />
              <ProFormSelect
                width="md"
                options={getBackType()}
                name="back_turn_redius"
                label="后回转半径"
                placeholder="请选择后回转半径"
                rules={[
                  {
                    required: true,
                    message: '请选择后回转半径！',
                  },
                ]}
              />
              <ProFormSelect
                width="md"
                options={getSeatHighType()}
                name="seat_high"
                label="鞍座高度"
                placeholder="请选择鞍座高度"
                rules={[
                  {
                    required: true,
                    message: '请选择鞍座高度！',
                  },
                ]}
              />
              <ProFormSelect
                width="md"
                options={getPullPinType()}
                name="pull_pin"
                label="牵引销"
                placeholder="请选择牵引销"
                rules={[
                  {
                    required: true,
                    message: '请选择牵引销！',
                  },
                ]}
              />
            </>
          )}
        </ProForm>
      )}
    </Modal>
  );
};
export default CategoryAddOrEditModal;
