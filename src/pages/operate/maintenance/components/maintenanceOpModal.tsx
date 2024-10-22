import {
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Modal, Skeleton, Space, message } from 'antd';
import { operateMaintenance, modalType } from '../../data';
import { useEffect, useState } from 'react';
import { getAllAssetList, getAssetDetail } from '@/services/property/common';
import AliyunOSSUpload from '@/components/AliYunOSSupload';
import { PlusOutlined } from '@ant-design/icons';
import {
  getRepairShop,
  getRepairShopDetail,
} from '@/services/serviceProviders/repairShop';
import { getCategoryType } from '@/services/interfaceType';
import moment from 'moment';
import { getMaintenanceDetail } from '@/services/operate/maintenance';
import Help from '@/utils/help';
const MaintenanceOpModal: React.FC<modalType<operateMaintenance>> = (
  props: any,
) => {
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
  const { visible, isShowModal, onFinish, editId } = props;
  const [initialValues, setInitialValues] = useState(undefined);
  const [formObj] = ProForm.useForm();
  const [url, setUrl] = useState<any>(undefined);
  const [assetsType, setAssetsType] = useState<number>(1);
  const title = editId === undefined ? '新增维修' : '编辑维修';
  const getDetail = async (id: string) => {
    const { data } = await getMaintenanceDetail({ id });
    setUrl(
      data.images?.map((item: any, index: any) => {
        return {
          uid: index,
          name: item.split('__GKZY__')[1],
          status: 'done',
          url: item,
        };
      }),
    );
    formObj.setFieldsValue({
      images: data.images,
    });
    setInitialValues({
      ...data,
      manufacturer_id: {
        label: data.manufacturer_name,
        value: data.manufacturer_id,
      },
      num: { label: data.assets_number, value: data.assets_id },
      lisence: data.assets_info.split('-')[1],
      brand: data.assets_info.split('-')[0],
      model: data.assets_info.split('-')[2],
      vin: data.assets_info.split('-')[3],
      in_manufacturer_time: moment(data.in_manufacturer_time * 1000).format(
        'YYYY-MM-DD',
      ),
      out_time: moment(data.out_time * 1000).format('YYYY-MM-DD'),
      // done_time: moment(data.done_time * 1000).format('YYYY-MM-DD')
    });
    delete initialValues?.done_time;
    if (data.done_time) {
      setInitialValues({
        ...data,
        manufacturer_id: {
          label: data.manufacturer_name,
          value: data.manufacturer_id,
        },
        num: { label: data.assets_number, value: data.assets_id },
        lisence: data.assets_info.split('-')[1],
        brand: data.assets_info.split('-')[0],
        model: data.assets_info.split('-')[2],
        vin: data.assets_info.split('-')[3],
        in_manufacturer_time: moment(data.in_manufacturer_time * 1000).format(
          'YYYY-MM-DD',
        ),
        out_time: moment(data.out_time * 1000).format('YYYY-MM-DD'),
        done_time: moment(data.done_time * 1000).format('YYYY-MM-DD'),
      });
      formObj.setFieldsValue({
        done_time: moment(data.done_time * 1000).format('YYYY-MM-DD'),
      });
    }
    setAssetsType(data.assets_type);
  };
  useEffect(() => {
    if (editId) {
      getDetail(editId);
    }
  }, []);
  //关闭弹窗
  const onModealCancel = () => {
    isShowModal(false);
  };

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
    setAssetsType(data.type);
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
  const serviceProvidersChange = async (row: any) => {
    const { data } = await getRepairShopDetail({ id: row.value });
    formObj.setFieldsValue({});
  };

  //获取修理厂供应商列表
  const getServiceProviders = async () => {
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
    } = await getRepairShop(param);
    if (status === 0) {
      list?.map((item: any) => {
        array.push({ label: item.name, value: item.id });
      });
      return array;
    } else {
      return [];
    }
  };

  //上传方法
  const setLicenseImage = (file: any, status: any, files: any) => {
    if (status === 'uploading') {
      setUrl(files);
    } else if (status === 'done') {
      setUrl(files);
      formObj.setFieldsValue({ images: file });
      message.success('上传成功');
    } else if (status === 'removed') {
      setUrl(files);
      formObj.setFieldsValue({ images: file });
    }
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
    </div>
  );
  return (
    <Modal
      title={title}
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
          form={formObj}
          initialValues={initialValues}
        >
          <ProForm.Group>
            <ProFormSelect
              label="资产编号"
              name="num"
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
              disabled={true}
              placeholder="请输入品牌"
              width="lg"
              fieldProps={{
                maxLength: 100,
              }}
            />
            <ProFormText
              name="model"
              label="车型"
              disabled={true}
              placeholder="请输入车系"
              width="lg"
              fieldProps={{
                maxLength: 100,
              }}
            />
          </ProForm.Group>
          <ProForm.Group>
            {assetsType != 4 && (
              <>
                <ProFormText
                  name="vin"
                  label="车架号"
                  disabled={true}
                  placeholder="请输入车架号"
                  width="lg"
                  fieldProps={{
                    maxLength: 100,
                  }}
                />
                <ProFormText
                  name="lisence"
                  label="车牌号"
                  disabled={true}
                  placeholder="请输入车牌号"
                  width="lg"
                  fieldProps={{
                    maxLength: 100,
                  }}
                />
              </>
            )}
          </ProForm.Group>
          <ProForm.Group>
            <ProFormSelect
              label="维修厂商"
              name="manufacturer_id"
              width="lg"
              showSearch
              disabled
              allowClear={false}
              fieldProps={{
                onChange: (val) => serviceProvidersChange(val),
                labelInValue: true,
              }}
              placeholder="请选择维修厂商"
              request={async () => getServiceProviders()}
              rules={[
                {
                  required: true,
                  message: '请选择维修厂商!',
                },
              ]}
            />
            <ProFormDatePicker
              label="维修送厂时间"
              disabled
              allowClear={false}
              width="lg"
              name="in_manufacturer_time"
              fieldProps={{
                format: 'YYYY-MM-DD',
              }}
              rules={[
                {
                  required: true,
                  message: '请选择维修送厂时间！',
                },
              ]}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormText
              name="reason"
              label="维修原因"
              disabled
              placeholder="请输入维修原因"
              width="lg"
              fieldProps={{
                maxLength: 100,
              }}
              rules={[
                {
                  required: true,
                  message: '请输入维修原因!',
                },
              ]}
            />
            <ProFormDatePicker
              label="预计出厂时间"
              disabled
              allowClear={false}
              width="lg"
              name="out_time"
              fieldProps={{
                format: 'YYYY-MM-DD',
              }}
              rules={[
                {
                  required: true,
                  message: '请选择预计出厂时间！',
                },
              ]}
            />
          </ProForm.Group>
          <ProForm.Group>
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
            <ProFormDatePicker
              label="维修完成时间"
              allowClear={false}
              width="lg"
              name="done_time"
              fieldProps={{
                format: 'YYYY-MM-DD',
              }}
              rules={[
                {
                  required: true,
                  message: '请选择维修完成时间！',
                },
              ]}
            />
            {/* <ProFormText
                        name="creator_name"
                        label="经办人"
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
            <ProFormText
              name="amount"
              label="维修费用"
              placeholder="请输入维修费用"
              width="lg"
              fieldProps={{
                maxLength: 100,
              }}
              rules={[
                {
                  required: true,
                  message: '请输入维修费用!',
                },
                {
                  pattern: Help.Regular.number.price,
                  message: '请输入正确的金额',
                },
              ]}
            />
            {/* <ProFormText
                        name="order_number"
                        label="订单编号"
                        placeholder="请输入订单编号"
                        width='lg'
                        fieldProps={{
                            maxLength: 100
                        }}
                    /> */}
          </ProForm.Group>
          <ProForm.Group>
            <ProForm.Item
              name="images"
              label="维修记录"
              rules={[
                {
                  required: true,
                  message: '请上传维修记录!',
                },
              ]}
            >
              <AliyunOSSUpload
                accept="image/*"
                setSrc={setLicenseImage}
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
export default MaintenanceOpModal;
