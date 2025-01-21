import { ProForm, ProFormRadio, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Modal, Skeleton, Space, message } from 'antd';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import { ProDescriptions } from '@ant-design/pro-components';
import { getVersionListAPI } from '@/services/version';
import { webSocket } from '@/utils/socket';
let webShhVersion: any = null,
  timeoutObjVersion: any = undefined,
  serverTimeoutObjVersion: any = undefined;
const VersionAddOrEditModal: React.FC<any> = (
  props: any,
) => {
  const [formObj] = ProForm.useForm();
  const [loading, setLoading] = useState(false)
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


  // 保持步骤心跳
  const longVersionstart = () => {
    //1、通过关闭定时器和倒计时进行重置心跳
    clearInterval(timeoutObjVersion);
    clearTimeout(serverTimeoutObjVersion);
    // 2、每隔3s向后端发送一条商议好的数据
    timeoutObjVersion = setInterval(() => {
      // webShhRefresh?.readyState == 1 正常连接
      if (webShhVersion?.readyState === 1) {
        webShhVersion.send('ping');
      } else {
        // webShhRefresh?.readyState != 1 连接异常 重新建立连接
        // setWebShhVersion()
      }
    }, 3000);
  };
  // 发送请求
  const setWebShhVersion = async () => {
    const params = {
      organize: history?.location?.query?.organize,
      branch: formObj.getFieldValue('branch'),
      revision: formObj.getFieldValue('revision'),
      type: formObj.getFieldValue('type') == 1 ? 'yes' : 'no'
    }
    // 必须设置格式为arraybuffer，zmodem 才可以使用
    webShhVersion = await webSocket('/devopsCore/wsrevision', params);
    webShhVersion.onopen = (res: any) => {
      longVersionstart()
    };
    // 回调
    webShhVersion.onmessage = function (recv: any) {
      if (typeof (recv.data) === 'string') {
        if (recv.data == 'pong' || recv.data == 'null') {
          return
        } else if (recv.data == 'SUCCESS') {
          message.success('创建成功')
          onFinish('SUCCESS')
          webShhVersion?.close();
          webShhVersion = null;
          setLoading(false)
        } else {
          onFinish('ERROR')
          message.error(recv.data)
          webShhVersion?.close();
          webShhVersion = null;
          setLoading(false)
        }
      } else {
        // zsentry.consume(recv.data);
        setLoading(false)
      }
    };
    // 报错
    webShhVersion.onerror = function () {
      webShhVersion?.close();
      webShhVersion = null;
      setLoading(false)
    }
  };
  const onFinish1 = () => {
    setLoading(true)
    setWebShhVersion()
  }
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
                    loading={loading}
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
          onFinish={onFinish1}
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
