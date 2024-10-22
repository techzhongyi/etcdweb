import { getCategoryType } from '@/services/interfaceType';
import { getRecoveryDetail } from '@/services/operate/recovery';
import { getAllAssetList, getAssetDetail } from '@/services/property/common';
import Help from '@/utils/help';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { Button, Modal, Skeleton, Space } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';

const recoveryAddModal: React.FC<any> = (props: any) => {
  const { isShowModal, visible, editId, onFinish } = props;
  const [initialValues, setInitialValues] = useState(undefined);
  const [formObj] = ProForm.useForm();
  const title = editId === undefined ? '新增回收' : '编辑回收';

  //获取详情
  const getDetail = async (id: string) => {
    const { data } = await getRecoveryDetail({ id });
    setInitialValues({
      ...data,
      num: { label: data.assets_number, value: data.assets_id },
      lisence: data.assets_info.split('-')[1],
      brand: data.assets_info.split('-')[0],
      model: data.assets_info.split('-')[2],
      vin: data.assets_info.split('-')[3],
      expire_time: moment(data.expire_time * 1000).format('YYYY-MM-DD'),
      effective_time: moment(data.effective_time * 1000).format('YYYY-MM-DD'),
    });
  };
  const showModal = () => {
    isShowModal(false);
  };
  useEffect(() => {
    if (editId) {
      getDetail(editId);
    }
  }, []);
  const assetsChange = async (row: any) => {
    const { data } = await getAssetDetail({ id: row.value });
    formObj.setFieldsValue({
      assets_type: data.type,
      gps_count: data.gps_ids.length,
      vin: data.vin,
      lisence: data.license,
      brand: data.brand,
      model: data.model,
    });
  };
  //获取资产列表
  const getAssets = async () => {
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
    } = await getAllAssetList(param);
    if (status === 0) {
      list?.map((item: any) => {
        array.push({ label: item.num, value: item.id });
      });
      return array;
    } else {
      return [];
    }
  };

  return (
    <>
      <Modal
        title={title}
        visible={visible}
        onCancel={showModal}
        footer={null}
        maskClosable={false}
        destroyOnClose={true}
        width={980}
      >
        {' '}
        {initialValues === undefined && editId !== undefined ? (
          <Skeleton active={true} paragraph={{ rows: 3 }} />
        ) : (
          <ProForm
            submitter={{
              render: (props_) => (
                <div style={{ textAlign: 'right' }}>
                  <Space>
                    <Button onClick={showModal}>取消</Button>
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
            initialValues={initialValues}
          >
            <ProForm.Group>
              <ProFormSelect
                label="资产编号"
                name="num"
                width="lg"
                showSearch
                allowClear={false}
                fieldProps={{
                  onChange: (val) => assetsChange(val),
                  labelInValue: true,
                }}
                placeholder="请选择资产"
                request={async () => getAssets()}
                rules={[
                  {
                    required: true,
                    message: '请选择资产!',
                  },
                ]}
              />
              <ProFormSelect
                name="assets_type"
                width="lg"
                label="资产类型"
                disabled={true}
                options={getCategoryType()}
                placeholder="请选择资产类型"
                rules={[
                  {
                    required: true,
                    message: '请选择资产类型',
                  },
                ]}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormText
                name="brand"
                label="品牌"
                // placeholder="请输入品牌"
                disabled={true}
                width="lg"
                fieldProps={{
                  maxLength: 100,
                }}
                rules={[
                  {
                    required: true,
                    message: '请输入品牌!',
                  },
                ]}
              />
              <ProFormText
                name="lisence"
                label="车牌号"
                disabled={true}
                // placeholder="请输入车牌号"
                width="lg"
                fieldProps={{
                  maxLength: 100,
                }}
                rules={[
                  {
                    required: true,
                    message: '请输入车牌号!',
                  },
                ]}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormText
                name="model"
                disabled={true}
                label="车型"
                // placeholder="请输入车型"
                width="lg"
                fieldProps={{
                  maxLength: 100,
                }}
                rules={[
                  {
                    required: true,
                    message: '请输入车型!',
                  },
                ]}
              />
              <ProFormText
                name="vin"
                disabled={true}
                label="车架号"
                placeholder="请输入车架号"
                width="lg"
                fieldProps={{
                  maxLength: 100,
                }}
                rules={[
                  {
                    required: true,
                    message: '请输入车架号!',
                  },
                ]}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormText
                name="reason"
                label="回收原因"
                placeholder="请输入回收原因"
                width="lg"
                fieldProps={{
                  maxLength: 100,
                }}
                rules={[
                  {
                    required: true,
                    message: '请输入回收原因!',
                  },
                ]}
              />
              <ProFormText
                name="evaluate_amount"
                label="评价估值"
                placeholder="请输入评价估值"
                width="lg"
                fieldProps={{
                  maxLength: 100,
                }}
                rules={[
                  {
                    required: true,
                    message: '请输入评价估值!',
                  },
                  {
                    pattern: Help.Regular.number.price,
                    message: '请输入正确的金额',
                  },
                ]}
              />
              <ProFormText
                name="real_amount"
                label="实际价值"
                placeholder="请输入实际价值"
                width="lg"
                fieldProps={{
                  maxLength: 100,
                }}
                rules={[
                  {
                    required: true,
                    message: '请输入实际价值!',
                  },
                  {
                    pattern: Help.Regular.number.price,
                    message: '请输入正确的金额',
                  },
                ]}
              />
            </ProForm.Group>
          </ProForm>
        )}
      </Modal>
    </>
  );
};
export default recoveryAddModal;
