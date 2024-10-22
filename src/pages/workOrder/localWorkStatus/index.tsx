import React, { useEffect, useState } from 'react';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import ProForm from '@ant-design/pro-form';
import {
  Button,
  Image,
  Empty,
  Skeleton,
  Space,
  Timeline,
  Rate,
  message,
} from 'antd';
import { history } from 'umi';
import {
  ProCard,
  ProFormDatePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import moment from 'moment';
import Help from '@/utils/help';
import { workOrderItemType } from '../data';
import {
  editWorkOrderAPI,
  getWorkOrderDetailAPI,
  getWorkOrderProcessAPI,
  getWorkOrderProcessListAPI,
} from '@/services/workOrder';
import AliyunOSSUpload from '@/components/AliYunOSSupload';
import { getCategoryType, getLevelType } from '@/services/interfaceType';
import FollowUpAddOrEditModal from '../components/followUpModal';
import './index.less';
import { getProblemTypeListAPI } from '@/services/permissions/question';
import { getAccountList } from '@/services/permissions/account';
import { getServiceSiteListAPI } from '@/services/site';
import FinishOrderModal from '../components/finishOrderModal';
import { PlusOutlined } from '@ant-design/icons';
const Index: React.FC = () => {
  const [formObj] = ProForm.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [orderStatus, setOrderStatus] = useState<number>(0);
  const [processList, setProcessList] = useState<any[]>([]);
  const [siteList, setSiteList] = useState<any[]>([]);
  const [comment, setComment] = useState({
    desc: '',
    score: null,
    images: [],
  });
  const [initialValues, setInitialValues] = useState(undefined);
  const [assetsType, setAssetsType] = useState(0);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [record, setRecord] = useState<workOrderItemType | undefined>(
    undefined,
  );
  const [visible1, setVisible1] = useState<boolean>(false);
  const [editId1, setEditId1] = useState<string | undefined>(undefined);
  const [record1, setRecord1] = useState<workOrderItemType | undefined>(
    undefined,
  );
  // 新增 编辑 关闭Modal
  const isShowModal = (show: boolean, row?: workOrderItemType, id?: string) => {
    setVisible(show);
    setEditId(id);
    setRecord(row);
  };
  // 结束工单
  const isShowModal1 = (
    show: boolean,
    row?: workOrderItemType,
    id?: string,
  ) => {
    setVisible1(show);
    setEditId1(id);
    setRecord1(row);
  };

  // 获取详情
  const getDetail = async (id: string | string[]) => {
    const { data } = await getWorkOrderDetailAPI({ id });
    setInitialValues({
      ...data,
      create_time: moment(data.create_time * 1000).format('YYYY-MM-DD'),
    });
    setAssetsType(data.type);
    setOrderStatus(data.status);
    console.log(Object.keys(data.comment));
    if (Object.keys(data.comment).length != 0) {
      setComment(data.comment);
    }
    setFileList(
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
  };
  // 获取工单跟进列表
  const getWorkOrderProcess = async (id) => {
    const param = {
      $tableLimit: {
        page: 1,
        count: 500,
      },
      $tableSearch: [{ field: 'work_order_id', value: id, op: 0 }],
      $tableSort: [],
    };
    const {
      data: { list },
      status,
      msg,
    } = await getWorkOrderProcessListAPI(param);
    if (status === 0) {
      setProcessList(list);
    } else {
      message.error(msg);
    }
  };
  useEffect(() => {
    if (history?.location?.query?.id) {
      getDetail(history?.location?.query?.id);
      setOrderStatus(history?.location?.query?.status);
      if (history?.location?.query?.status != 1) {
        getWorkOrderProcess(history?.location?.query?.id);
      }
    }
  }, []);

  const onFinish = async (value: any) => {};
  // 跟进
  const onFinishFollowUp = async (value: any) => {
    console.log(value);
    if (value.type === 2) {
      const { status, msg } = await getWorkOrderProcessAPI({
        ...value,
        work_order_id: history?.location?.query?.id,
      });
      if (status === 0) {
        message.success('跟进成功');
        // 刷新列表数据
        getDetail(history?.location?.query?.id);
        getWorkOrderProcess(history?.location?.query?.id);
        isShowModal(false);
      } else {
        message.warn(msg);
      }
    } else {
      const params = {
        images: value.images && value.images.length > 0 ? value.images : [],
        desc: value.desc ? value.desc : '',
        work_order_id: history?.location?.query?.id,
        type: value.type,
      };
      const { status, msg } = await getWorkOrderProcessAPI(params);
      if (status === 0) {
        message.success('跟进成功');
        // 刷新列表数据
        getDetail(history?.location?.query?.id);
        getWorkOrderProcess(history?.location?.query?.id);
        isShowModal(false);
      } else {
        message.warn(msg);
      }
    }
  };
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
  // 获取负责人
  const designateList = async () => {
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
    } = await getAccountList(param);
    if (status === 0) {
      list?.map((item: any) => {
        array.push({ label: item.name, value: item.id });
      });
      return array;
    } else {
      return [];
    }
  };
  // 编辑工单
  const saveWorkOrder = async () => {
    const params = {
      contact_name: formObj.getFieldValue('contact_name') || '',
      contact_phone: formObj.getFieldValue('contact_phone') || '',
      images: formObj.getFieldValue('images') || [],
      desc: formObj.getFieldValue('desc') || '',
      level: formObj.getFieldValue('level'),
      license: formObj.getFieldValue('license'),
      owner_ids: formObj.getFieldValue('owner_ids'),
      service_site_id: formObj.getFieldValue('service_site_id'),
      service_site_type: formObj.getFieldValue('service_site_type'),
      id: history?.location?.query?.id,
    };
    const { status, msg } = await editWorkOrderAPI(params);
    if (status === 0) {
      message.success('编辑成功');
      getDetail(history?.location?.query?.id);
      getWorkOrderProcess(history?.location?.query?.id);
      setIsEdit(false);
    } else {
      message.error(msg);
    }
  };
  // 结束工单回调
  const onFinish1 = async (value) => {
    const params = {
      work_order_id: history?.location?.query?.id,
      type: 4,
      images: value.images,
      desc: value.desc,
    };
    const { status, msg } = await getWorkOrderProcessAPI(params);
    if (status === 0) {
      message.success('结束工单成功');
      getDetail(history?.location?.query?.id);
      getWorkOrderProcess(history?.location?.query?.id);
      setVisible1(false);
    } else {
      message.error(msg);
    }
  };
  const editBtn = (
    <Button
      type="primary"
      onClick={() => {
        setIsEdit(true);
      }}
    >
      编辑工单
    </Button>
  );
  const saveBtn = (
    <Space>
      <Button
        onClick={() => {
          setIsEdit(false);
        }}
      >
        取消
      </Button>
      <Button
        type="primary"
        onClick={() => {
          saveWorkOrder();
        }}
      >
        保存
      </Button>
    </Space>
  );
  const opBtn = (
    <Button
      type="primary"
      onClick={() => {
        isShowModal(true);
      }}
    >
      跟进
    </Button>
  );
  const setResume = (file: any, status: any, files: any) => {
    if (status === 'uploading') {
      setFileList(files);
    } else if (status === 'done') {
      setFileList(files);
      formObj.setFieldsValue({ images: files.map((item: any) => item.url) });
      message.success('上传成功');
    } else if (status === 'removed') {
      setFileList(files);
      formObj.setFieldsValue({ images: files.map((item: any) => item.url) });
    }
  };
  // 获取服务站列表
  const getList = async (type) => {
    const array: { label: any; value: any }[] = [];
    const param = {
      $tableLimit: {
        page: 1,
        count: 1000,
      },
      $tableSearch: [{ field: 'type', value: type, op: 7 }],
      $tableSort: [],
    };
    const {
      data: { list },
      status,
    } = await getServiceSiteListAPI(param);
    if (status === 0) {
      list?.map((item: any) => {
        array.push({ label: item.name, value: item.id });
      });
      setSiteList(array);
    } else {
      return [];
    }
  };
  useEffect(() => {
    getList(assetsType);
  }, [assetsType]);
  const uploadButton = (
    <div>
      <PlusOutlined />
    </div>
  );
  return (
    <PageContainer
      ghost
      header={{
        title: ' ',
        breadcrumb: {},
      }}
    >
      <div className="process-bg">
        <div className={orderStatus == 1 ? 'active-status' : ''}>1.待处理</div>
        <div
          className={
            orderStatus == 2 || orderStatus == 3 ? 'active-status' : ''
          }
        >
          2.处理中
        </div>
        <div className={orderStatus == 4 ? 'active-status' : ''}>3.已完成</div>
      </div>

      {initialValues === undefined &&
      history?.location?.query?.id !== undefined ? (
        <Skeleton active={true} paragraph={{ rows: 3 }} />
      ) : (
        <ProForm
          submitter={{
            render: (props) => (
              <FooterToolbar>
                <Button
                  key="rest"
                  onClick={() => history.push('/workOrder/list')}
                >
                  {orderStatus != 4 ? '取消' : '返回'}
                </Button>
              </FooterToolbar>
            ),
          }}
          onFinish={onFinish}
          initialValues={initialValues}
          form={formObj}
        >
          <ProCard title="工单信息">
            <ProForm.Group>
              <ProFormText
                width="md"
                name="uu_number"
                disabled
                label="工单号"
                fieldProps={{
                  maxLength: 99,
                }}
                placeholder="请填写工单号"
              />
              <ProFormSelect
                width="md"
                disabled={isEdit ? false : true}
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
            </ProForm.Group>
            <ProForm.Group>
              <ProForm.Item name="images" label="图片">
                <AliyunOSSUpload
                  accept="image/*"
                  fileList={fileList}
                  setSrc={setResume}
                  maxCount={5}
                  listType={'picture-card'}
                  isShowUploadList={{
                    showRemoveIcon: isEdit ? true : false,
                  }}
                >
                  {/* {(fileList?.length >= 5 || !isEdit) ? null : uploadButton} */}
                </AliyunOSSUpload>
              </ProForm.Item>
            </ProForm.Group>
            <ProForm.Group>
              <ProFormTextArea
                label="描述"
                disabled={isEdit ? false : true}
                name="desc"
                fieldProps={{
                  maxLength: 499,
                }}
                width="md"
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormSelect
                name="type"
                disabled
                width="md"
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
              <ProFormText
                width="md"
                disabled={isEdit ? false : true}
                name="license"
                label="车牌号"
                fieldProps={{
                  maxLength: 100,
                }}
                placeholder="请填写车牌号"
                rules={[
                  {
                    required: true,
                    message: '请填写车牌号!',
                  },
                ]}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormSelect
                width="md"
                disabled={isEdit ? false : true}
                mode="multiple"
                request={() => designateList()}
                name="owner_ids"
                label="负责人"
                placeholder="请选择负责人"
                rules={[
                  {
                    required: true,
                    message: '请选择负责人！',
                  },
                ]}
              />
              <ProFormText
                width="md"
                disabled={isEdit ? false : true}
                name="contact_phone"
                label="联系方式"
                fieldProps={{
                  maxLength: 11,
                }}
                rules={[
                  {
                    pattern: Help.Regular.mobilePhone,
                    message: '请输入正确的手机号码！',
                  },
                ]}
                placeholder="请填写联系方式"
              />
              <ProFormDatePicker
                label="指派时间"
                disabled
                allowClear={false}
                width="md"
                name="create_time"
                fieldProps={{
                  format: 'YYYY-MM-DD',
                }}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormRadio.Group
                width="md"
                name="level"
                label="工单级别"
                disabled={isEdit ? false : true}
                options={getLevelType()}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormSelect
                width="md"
                name="service_site_type"
                disabled={isEdit ? false : true}
                label="服务站类型"
                options={getCategoryType()}
                fieldProps={{
                  allowClear: false,
                  onChange: async (e) => {
                    setAssetsType(e);
                  },
                }}
                rules={[
                  {
                    required: true,
                    message: '请选择服务站类型!',
                  },
                ]}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormSelect
                width="md"
                name="service_site_id"
                disabled={isEdit ? false : true}
                options={siteList}
                label="服务站"
                fieldProps={{
                  allowClear: false,
                }}
                rules={[
                  {
                    required: true,
                    message: '请选择服务站!',
                  },
                ]}
              />
            </ProForm.Group>
          </ProCard>
          <ProCard title="处理进程" extra={orderStatus != 4 && opBtn}>
            {processList.length > 0 ? (
              <>
                <Timeline>
                  {processList.map((item) => {
                    if (item.type == 2) {
                      return (
                        <Timeline.Item>
                          <div className="timeline-title">
                            {item.processor_name}
                            {item.processor_type == 1
                              ? '处理跟进'
                              : '服务站处理反馈'}
                            :定损定责
                          </div>
                          <div className="timeline-title">
                            责任人: {item.duty_type == 1 ? '其他' : '司机'}
                          </div>
                          <div className="timeline-item">
                            {item.pay_items.map((item_) => {
                              return (
                                <div>
                                  <div className="marginR10">
                                    收费项: {item_.pay_name}
                                  </div>
                                  <div>金额: {item_.pay_amount}元</div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="timeline-title">
                            合计金额:{' '}
                            {item.pay_items.reduce((sum, obj) => {
                              return (
                                parseFloat(sum) + parseFloat(obj.pay_amount)
                              ).toFixed(2);
                            }, 0)}
                            元
                          </div>
                          {item.images.length > 0 && (
                            <div className="timeline-img">
                              <div className="marginR10">图片:</div>
                              <Image.PreviewGroup>
                                {item.images.map((item_) => {
                                  return (
                                    <Image
                                      rootClassName="imgBox"
                                      width={60}
                                      height={60}
                                      src={item_}
                                    />
                                  );
                                })}
                              </Image.PreviewGroup>
                            </div>
                          )}
                          {item.desc && (
                            <div className="timeline-desc">
                              <div className="marginR10">描述: </div>
                              <div>{item.desc}</div>
                            </div>
                          )}
                          <div className="timeline-title">
                            处理人: {item.processor_name}
                          </div>
                          <div className="timeline-title">
                            处理时间:{' '}
                            {moment(item.create_time * 1000).format(
                              'YYYY-MM-DD HH:mm',
                            )}
                          </div>
                        </Timeline.Item>
                      );
                    } else {
                      return (
                        <Timeline.Item>
                          <div className="timeline-title">
                            {item.processor_name}
                            {item.processor_type == 1
                              ? '处理跟进'
                              : '服务站处理反馈'}
                            :{' '}
                            {item.type == 1
                              ? '一般跟进'
                              : item.type == 3
                              ? '关闭'
                              : '结束'}
                          </div>
                          {item.images.length > 0 && (
                            <div className="timeline-img">
                              <div className="marginR10">图片:</div>
                              <Image.PreviewGroup>
                                {item.images.map((item_) => {
                                  return (
                                    <Image
                                      rootClassName="imgBox"
                                      width={60}
                                      height={60}
                                      src={item_}
                                    />
                                  );
                                })}
                              </Image.PreviewGroup>
                            </div>
                          )}
                          {item.desc && (
                            <div className="timeline-desc">
                              <div className="marginR10">描述: </div>
                              <div>{item.desc}</div>
                            </div>
                          )}
                          <div className="update-desc">
                            更新时间:{' '}
                            {moment(item.create_time * 1000).format(
                              'YYYY-MM-DD HH:mm',
                            )}
                          </div>
                        </Timeline.Item>
                      );
                    }
                  })}
                </Timeline>
              </>
            ) : (
              <Empty />
            )}
          </ProCard>
          {comment.score != null && (
            <ProCard title="司机评价">
              <div className="timeline-rate">
                <div className="marginR10">评价:</div>
                <div>
                  <Rate disabled defaultValue={comment.score} />
                </div>
              </div>
              <div className="timeline-img">
                <div className="marginR10">图片:</div>
                <Image.PreviewGroup>
                  {comment.images.map((item) => {
                    return (
                      <Image
                        rootClassName="imgBox"
                        width={60}
                        height={60}
                        src="item"
                      />
                    );
                  })}
                </Image.PreviewGroup>
              </div>
              <div className="timeline-desc">
                <div className="marginR10">描述: </div>
                <div>{comment.desc}</div>
              </div>
            </ProCard>
          )}
        </ProForm>
      )}
      {!visible ? (
        ''
      ) : (
        <FollowUpAddOrEditModal
          visible={visible}
          isShowModal={isShowModal}
          onFinish={onFinishFollowUp}
          record={record}
          editId={editId}
          editType={'edit'}
        />
      )}
      {!visible1 ? (
        ''
      ) : (
        <FinishOrderModal
          visible={visible1}
          isShowModal={isShowModal1}
          onFinish={onFinish1}
          record={record1}
          editId={editId1}
        />
      )}
    </PageContainer>
  );
};
export default Index;
