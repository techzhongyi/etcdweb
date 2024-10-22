import {
  ProForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Modal, Skeleton, Space, message } from 'antd';
import { accidentItemType, modalType } from '../../data';
import { useEffect, useState } from 'react';
import { getAllAssetList, getAssetDetail } from '@/services/property/common';
import AliyunOSSUpload from '@/components/AliYunOSSupload';
import { PlusOutlined } from '@ant-design/icons';
import { getCategoryType } from '@/services/interfaceType';
import moment from 'moment';
import Help from '@/utils/help';

const AccidentOpModal: React.FC<modalType<accidentItemType>> = (props: any) => {
  const [formObj] = ProForm.useForm();
  const { visible, isShowModal, onFinish, record, editId } = props;
  const [url, setUrl] = useState<any>(undefined);
  const [initialValues, setInitialValues] = useState(undefined);
  const payTypeList = [
    {
      label: '直付',
      value: 1,
    },
    {
      label: '代付',
      value: 2,
    },
  ];
  const responsibleTypeList = [
    {
      label: '租赁方',
      value: 1,
    },
    {
      label: '第三方',
      value: 2,
    },
  ];
  useEffect(() => {
    if (record) {
      setInitialValues({
        ...record,
        type: record.assets_type,
        brand: record.assets_info.split('-')[0],
        license: record.assets_info.split('-')[1],
        model: record.assets_info.split('-')[2],
        vin: record.assets_info.split('-')[3],
        assets_id: { value: record.assets_id, label: record.assets_number },
      });
      delete initialValues?.complete_time;
      if (record.complete_time) {
        setInitialValues({
          ...record,
          type: record.assets_type,
          brand: record.assets_info.split('-')[0],
          license: record.assets_info.split('-')[1],
          model: record.assets_info.split('-')[2],
          vin: record.assets_info.split('-')[3],
          complete_time: moment(record.complete_time * 1000).format(
            'YYYY-MM-DD',
          ),
          assets_id: { value: record.assets_id, label: record.assets_number },
        });
      }
      setUrl(
        record.images?.map((item: any, index: any) => {
          return {
            uid: index,
            name: item,
            status: 'done',
            url: item,
          };
        }),
      );
      formObj.setFieldsValue({
        images: record.images,
      });
    }
  }, [record]);
  const assetsChange = async (value: any) => {
    const { data } = await getAssetDetail({ id: value.value });
    formObj.setFieldsValue({
      type: data.type,
      info: data.info,
      license: data.license,
      brand: data.brand,
      model: data.model,
      vin: data.vin,
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
  const uploadButton = (
    <div>
      <PlusOutlined />
    </div>
  );
  const setAccidentImage = (file: any, status: any, files: any) => {
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
  const onModealCancel = () => {
    isShowModal(false);
  };
  return (
    <Modal
      title="新增出险"
      open={visible}
      onCancel={onModealCancel}
      footer={null}
      maskClosable={false}
      destroyOnClose={true}
      width={980}
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
          <ProForm.Group>
            <ProFormSelect
              label="资产编号"
              name="assets_id"
              width="lg"
              disabled
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
              name="type"
              disabled
              width="lg"
              options={getCategoryType()}
              label="资产类型"
              placeholder="请选择资产类型"
              rules={[
                {
                  required: true,
                  message: '请选择资产类型!',
                },
              ]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText
              name="brand"
              disabled
              label="品牌"
              placeholder="请输入品牌"
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
              name="license"
              label="车牌号"
              disabled
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
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText
              name="model"
              label="车型"
              disabled
              placeholder="请输入车型"
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
              label="车架号"
              disabled
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
              name="insurance_amount"
              label="保单费用"
              disabled={true}
              placeholder="请输入保单费用"
              width="lg"
              fieldProps={{
                maxLength: 100,
              }}
              rules={[
                {
                  required: true,
                  message: '请输入保单费用',
                },
                {
                  pattern: Help.Regular.number.price,
                  message: '请输入正确的金额',
                },
              ]}
            />
            <ProFormText
              name="reparation_amount"
              label="赔偿金额"
              placeholder="请输入赔偿金额"
              width="lg"
              fieldProps={{
                maxLength: 100,
              }}
              rules={[
                {
                  required: true,
                  message: '请输入赔偿金额!',
                },
                {
                  pattern: Help.Regular.number.price,
                  message: '请输入正确的金额',
                },
              ]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormDatePicker
              label="出险完成时间"
              allowClear={false}
              width="lg"
              name="complete_time"
              fieldProps={{
                format: 'YYYY-MM-DD',
              }}
              rules={[
                {
                  required: true,
                  message: '请选择出险完成时间！',
                },
              ]}
            />

            <ProFormSelect
              name="responsible_party"
              width="lg"
              options={responsibleTypeList}
              label="责任方"
              placeholder="请选择责任方"
              rules={[
                {
                  required: true,
                  message: '请选择责任方!',
                },
              ]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormSelect
              name="pay_type"
              width="lg"
              options={payTypeList}
              label="付款方式"
              placeholder="请选择付款方式"
              rules={[
                {
                  required: true,
                  message: '请选择付款方式!',
                },
              ]}
            />
            {/* <ProFormText
                        name="creator_name"
                        label="经办人"
                        disabled
                        placeholder="请输入经办人"
                        width='lg'
                        fieldProps={{
                            maxLength: 100
                        }}
                        rules={[
                            {
                                required: true,
                                message: '请输入经办人!',
                            },
                        ]}
                    /> */}
          </ProForm.Group>
          <ProForm.Group>
            <ProForm.Item
              name="images"
              label="出险记录"
              rules={[
                {
                  required: true,
                  message: '请上传出险记录!',
                },
              ]}
            >
              <AliyunOSSUpload
                accept="image/*"
                setSrc={setAccidentImage}
                fileList={url}
                maxCount={6}
                listType={'picture-card'}
              >
                {url?.length >= 6 ? null : uploadButton}
              </AliyunOSSUpload>
            </ProForm.Item>
          </ProForm.Group>
        </ProForm>
      )}
    </Modal>
  );
};
export default AccidentOpModal;
