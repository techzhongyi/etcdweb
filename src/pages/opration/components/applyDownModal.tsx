import React, { useState, useEffect } from 'react';
import { Card, Modal, Skeleton } from 'antd';
import CodeMirrorEditorModal from '@/components/CodeMirror';
import { getSqlconfirmAPI } from '@/services/comservice';
import { ProDescriptions } from '@ant-design/pro-components';
let list_ = []
const ApplyDownModal: React.FC<any> = (props: any) => {
  const [initialValues, setInitialValues] = useState(undefined);
  const [dataList, setDataList] = useState([]);
  const [isChange, setIsChange] = useState(1);
  const { visible, onFinish, record } = props;
  const handleCodeChange = (e, index: number) => {
    setIsChange(2)
    console.log('index===>',index)
    console.log('e===>',e)
    list_[index].sql = e
    console.log('list_===>',list_)
  };
  const getDetail = async () => {
    const params = {
      env: record.env,
      organize: record.organize,
    }

    const { data:{list} } = await getSqlconfirmAPI(params)
    setInitialValues(list)
    list_ = [...dataList]
    setTimeout(() => {
      setDataList(list)
    },500)

  }
  useEffect(() => {
    if (record.organize) {
      getDetail()
    }
  }, [record])
  const onModealCancel = () => {
    onFinish(dataList,'reject')
  };
  return (
    <Modal
      title='详细信息'
      width={1024}
      onOk={() => {
        onFinish(dataList);
      }}
      okText='同意'
      cancelText='拒绝'
      open={visible}
      maskClosable={false}
      onCancel={onModealCancel}
      destroyOnClose={true}
      closable={false}
    >
      {initialValues === undefined ? (
        <Skeleton active={true} paragraph={{ rows: 3 }} />
      ) : (
        <div>
          {
            dataList.map((item, index) => {
              return (
                <Card title={item.sname} style={{ marginBottom: '5px' }} bodyStyle={{ padding: '0 8px' }}>
                  <ProDescriptions column={4} style={{ marginTop: '20px' }}>
                    <ProDescriptions.Item valueType="text" label="branch">
                      {item.branch}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item valueType="text" ellipsis label="env">
                      {item.env}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item valueType="text" ellipsis label="lang">
                      {item.lang}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item valueType="text" ellipsis label="organize">
                      {item.organize}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item valueType="text" ellipsis label="projpath">
                      {item.projpath}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item valueType="text" ellipsis label="sname">
                      {item.sname}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item valueType="text" ellipsis label="sqlpath">
                      {item.sqlpath}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item valueType="text" ellipsis label="status">
                      {item.status}
                    </ProDescriptions.Item>
                    <ProDescriptions.Item valueType="text" ellipsis label="vcode">
                      {item.vcode}
                    </ProDescriptions.Item>
                  </ProDescriptions>
                  <CodeMirrorEditorModal
                    value={item.sql}
                    height={400}
                    language="javascript"
                    onChange={(e) => { handleCodeChange(e, index) }}
                    isChange={isChange}
                  />
                </Card>
              )
            })
          }
        </div>
      )
      }
    </Modal>
  );
};
export default ApplyDownModal;
