import AliyunOSSUpload from '@/components/AliYunOSSupload';
import { getCategoryType } from '@/services/interfaceType';
import { getRegulationsDetail } from '@/services/operate/regulations';
import { getAllAssetList, getAssetDetail } from '@/services/property/common';
import Help from '@/utils/help';
import { PlusOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Modal, Skeleton, Space, message } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';

const regulatAddModal: React.FC<any> = (props: any) => {
  const { isShowModal, visible, editId, onFinish } = props;
  const [formObj] = ProForm.useForm();
  const title = editId === undefined ? '新增违章' : '编辑违章';
  const [url, setUrl] = useState<any>(undefined);
  const [initialValues, setInitialValues] = useState(undefined);

  const getDetail = async (id: string) => {
    const { data } = await getRegulationsDetail({ id });
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
    // setUrl(data.images[0])
    setInitialValues({
      ...data,
      num: { label: data.assets_number, value: data.assets_id },
      lisence: data.assets_info.split('-')[1],
      brand: data.assets_info.split('-')[0],
      model: data.assets_info.split('-')[2],
      vin: data.assets_info.split('-')[3],
      time: moment(data.time * 1000).format('YYYY-MM-DD'),
      // effective_time: moment(data.effective_time * 1000).format('YYYY-MM-DD')
    });
  };
  useEffect(() => {
    if (editId) {
      getDetail(editId);
    }
  }, []);

  const showModal = () => {
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
  const regulatypeList = [
    {
      label: '超速',
      value: 1,
    },
    {
      label: '超载',
      value: 2,
    },
    {
      label: '违章超车',
      value: 3,
    },
    {
      label: '违章停车',
      value: 4,
    },
    {
      label: '疲劳驾驶',
      value: 5,
    },
    {
      label: '无证驾驶',
      value: 6,
    },
    {
      label: '酒后驾驶',
      value: 7,
    },
    {
      label: '病车及报废车上路',
      value: 8,
    },
    {
      label: '转借机动车牌证',
      value: 9,
    },
    {
      label: '其他',
      value: 10,
    },
  ];
  return (
    <>
      <Modal
        title={title}
        open={visible}
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
            initialValues={initialValues}
            form={formObj}
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
                disabled={true}
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
                name="lisence"
                label="车牌号"
                disabled={true}
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
                ]}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormText
                name="model"
                label="车型"
                disabled={true}
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
                disabled={true}
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
              <ProFormSelect
                name="type"
                width="lg"
                label="违章行为"
                options={regulatypeList}
                placeholder="请选择违章行为"
                rules={[
                  {
                    required: true,
                    message: '请选择违章行为!',
                  },
                ]}
              />
              <ProFormText
                name="number"
                label="违章编码"
                placeholder="请输入违章编码"
                width="lg"
                fieldProps={{
                  maxLength: 100,
                }}
                // rules={[
                //     {
                //         required: true,
                //         message: '请输入违章编码!',
                //     },
                // ]}
              />
              <ProFormText
                name="amount"
                label="违章金额"
                placeholder="请输入违章金额"
                width="lg"
                fieldProps={{
                  maxLength: 100,
                }}
                rules={[
                  {
                    required: true,
                    message: '请输入违章金额!',
                  },
                  {
                    pattern: Help.Regular.number.price,
                    message: '请输入正确的金额',
                  },
                ]}
              />
              <ProFormDatePicker
                label="违章时间"
                allowClear={false}
                width="lg"
                name="time"
                fieldProps={{
                  format: 'YYYY-MM-DD',
                }}
                rules={[
                  {
                    required: true,
                    message: '请选择违章时间！',
                  },
                ]}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormText
                name="processing_period"
                label="违章处理期限"
                placeholder="请输入违章处理期限"
                width="lg"
                fieldProps={{
                  maxLength: 100,
                }}
                rules={[
                  {
                    required: true,
                    message: '请输入违章处理期限!',
                  },
                ]}
              />
              <ProFormText
                name="order_number"
                label="订单编号"
                placeholder="请输入订单编号"
                width="lg"
                fieldProps={{
                  maxLength: 100,
                }}
                rules={[
                  {
                    required: true,
                    message: '请输入订单编号!',
                  },
                ]}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProForm.Item
                name="images"
                label="违章记录"
                rules={[
                  {
                    required: true,
                    message: '请上传违章记录!',
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
    </>
  );
};
export default regulatAddModal;
