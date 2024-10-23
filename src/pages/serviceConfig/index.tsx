import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Input, message, Popconfirm, Card, Select } from 'antd';
import './index.less'
import CodeMirrorEditorModal from '@/components/CodeMirror';

const Index: React.FC = () => {
  const [code, setCode] = useState(`
  import java.util.*;
  import com.alibaba.fastjson.JSON;
  import com.alibaba.fastjson.JSONArray;
  import com.alibaba.fastjson.JSONObject;
  import com.alibaba.fastjson.TypeReference;
  `);

  const serviceChange = (e) => {

  }
  const versionsChange = (e) => {

  }
  const handleCodeChange = (value: string) => {
    setCode(value);
    console.log(value);
  };
  useEffect(() => {
  }, [])
  return (
    <PageContainer
      ghost
      header={{
        title: ' ',
        breadcrumb: {},
      }}
    >
      <Card>
        <div className='service-content'>
          <div className='service-list-select'>
            <div>
              <Select
                defaultValue=""
                style={{ width: 200 }}
                onChange={(e) => { serviceChange(e) }}
                options={[
                  {
                    value: '',
                    label: '微服务',
                  },
                  {
                    value: '1',
                    label: '微服务1',
                  },
                  {
                    value: '2',
                    label: '微服务2',
                  },
                  {
                    value: '3',
                    label: '微服务3',
                  },
                ]}
              />
            </div>
            <div className='service-item-list'>
              <div>hcore</div>
              <div>pcore</div>
              <div>user</div>
              <div>assets</div>
            </div>

          </div>
          <div className='service-select-content'>
            <div className='top-search-content'>
              <div className='top-search-label'>版本:</div>
              <div>
                <Select
                  defaultValue=""
                  style={{ width: 200 }}
                  onChange={(e) => { versionsChange(e) }}
                  options={[
                    {
                      value: '',
                      label: '全部',
                    },
                    {
                      value: '1',
                      label: '启动',
                    },
                    {
                      value: '2',
                      label: '熄火',
                    },
                    {
                      value: '3',
                      label: '其他',
                    },
                  ]}
                />
              </div>

            </div>
            <div className='config-content-list'>
              <div>
                <div>CONFIG</div>
                <div>
                  <CodeMirrorEditorModal
                    value={code}
                    language="javascript"
                    onChange={handleCodeChange}
                  />
                </div>
              </div>
              <div>
                <div>CONFIG</div>
                <div>
                  <CodeMirrorEditorModal
                    value={code}
                    language="javascript"
                    onChange={handleCodeChange}
                  />
                </div>
              </div>
              <div>
                <div>CONFIG</div>
                <div>
                  <CodeMirrorEditorModal
                    value={code}
                    language="javascript"
                    onChange={handleCodeChange}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </Card>
      {/* {!visible ? (
        ''
      ) : (
        <ConfigAddOrEditModal
          visible={visible}
          isShowModal={isShowModal}
          onFinish={onFinish}
          record={record}
          editId={editId}
        />
      )}
      {!visible1 ? (
        ''
      ) : (
        <ComparesModal
          visible={visible1}
          isShowModal={isShowModal1}
          onFinish={onFinish1}
          record={record}
          editId={editId}
        />
      )} */}
    </PageContainer>
  );
};
export default Index;
