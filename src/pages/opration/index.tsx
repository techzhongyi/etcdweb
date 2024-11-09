import React, { useState, useEffect } from 'react';
import { Button, Space, Table } from 'antd';
import './index.less';
import { detectOS } from '@/utils/common';
import { webSocket } from '@/utils/socket';
import { getStorage } from '@/utils/storage';
import eventBus from '@/utils/eventBus';
import { finishedSqlconfirmAPI, getFinishedLastugpAPI } from '@/services/comservice';
import moment from 'moment';
import './index.less'
import EtdcHeader from '@/components/NewHeader';
import long_arrow from '../../../public/icons/ectd/long_arrow.png'

const Index: React.FC = () => {
  const [isDone, setIsDone] = useState(false)
  const [versionList, setVersionList] = useState([])
  const [serviceList, setServiceList] = useState([])
  const [codeLog, setCodeLog] = useState<string>('');
  const [isScroll, setIsScroll] = useState(false)
  // const handleEvent = (env) => {
  //   setWebShh(env)
  //   // setWebShhApply(env)
  //   getApplyResult(env)
  // }
  useEffect(() => {
    // setWebShh(getStorage('env'))
    // setWebShhApply(getStorage('env'))
    // setWebShhRefresh(getStorage('env'))
    // getApplyResult(getStorage('env'))
    // eventBus.on('envChange', (env) => { handleEvent(env) });
  }, [])
  let befortop = 0
  useEffect(() => {
    const div = document.getElementById('log-content')
    window.addEventListener('scroll', () => {
      const aftertop = div?.scrollTop;//兼容
      if (aftertop - befortop > 0) {
        console.log('向下');
        setIsScroll(false)
      } else {
        console.log('向上');
        setIsScroll(true)
      }
      befortop = aftertop;
    }, true)
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        setIsScroll(false)
      }
    })
    if (div && !isScroll) {
      div.scrollTop = div.scrollHeight
    }
  }, [codeLog])
  const columns = [
    {
      title: '服务名称',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
    },
    {
      title: '启动时间',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
    },
    {
      title: '镜像时间',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
    },
    {
      title: 'Sql升级时间',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
    },
    {
      title: '操作',
      align: 'center',
      render: () => (
        <Space>
          <a>日志</a>
          <a>配置</a>
          <a>接口</a>
          <a>ENV</a>
        </Space>
      ),
    },
  ];
  const columns1 = [
    {
      title: '版本名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '版本描述',
      dataIndex: 'age',
      key: 'age',
      align: 'center',
    },
    {
      title: '修订时间',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: () => (
        <Space>
          <a>详情</a>
        </Space>
      ),
    },
  ];
  return (
    <div className='page-container'>
      <EtdcHeader />
      <div className='page-wrap'>
        <div className='opration-refresh'>
          <div className='opration-refresh-title'>
            <div>
              <Button type="primary" loading={isDone} onClick={() => {
                // refresh()
              }}>Refresh</Button>
            </div>
            <div className='opration-refresh-step'>
              <div>Start</div>
              <div><img src={long_arrow} alt="" /></div>
              <div>Repo Sync</div>
              <div><img src={long_arrow} alt="" /></div>
              <div>Project Scan</div>
              <div><img src={long_arrow} alt="" /></div>
              <div>End</div>
            </div>
          </div>
          <div className='opration-refresh-content'>
            <div className='refresh-log-box'>
              {
                <div id='refresh-content' style={{ fontFamily: detectOS() == 'Mac' ? 'monospace' : 'cursive', height: '200px', overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: 111 }}></div>
              }
            </div>
            <div className='refresh-line-box'> 111</div>
          </div>
        </div>
        <div className='opration-apply'>
          <div className='opration-apply-title'>
            <div>
              <Button type="primary" loading={isDone} onClick={() => {
                // refresh()
              }}>Apply</Button>
            </div>
            <div className='opration-apply-step'>
              <div>Start</div>
              <div><img src={long_arrow} alt="" /></div>
              <div>Devbootup</div>
              <div><img src={long_arrow} alt="" /></div>
              <div>Sql gen</div>
              <div><img src={long_arrow} alt="" /></div>
              <div>Sql confirm</div>
              <div><img src={long_arrow} alt="" /></div>
              <div>End</div>
            </div>
          </div>
          <div className='opration-apply-content'>
            <div className='apply-log-box'>
              {
                <div id='apply-content' style={{ fontFamily: detectOS() == 'Mac' ? 'monospace' : 'cursive', height: '200px', overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: 2222 }}></div>
              }
            </div>
            <div className='apply-line-box'> 111</div>
          </div>
        </div>
        <div className='service-list'>
          <div className='tables-titles'>Service</div>
          <div>
            <Table
              rowKey={(record) => record.id}
              rowClassName={(_, index) => (index % 2 == 1 ? 'rowBgColor' : '')} dataSource={serviceList}
              pagination={false}
              columns={columns}
              scroll={{ y: 300 }} />
          </div>
        </div>
        <div className='version-list'>
          <div className='tables-titles'>
            <div>版本列表</div>
            <div><Button type="primary" loading={isDone} onClick={() => {
              // refresh()
            }}>新建版本</Button></div>
          </div>
          <div>
            <Table
              locale={{
                emptyText: '', // 使用自定义组件作为“暂无数据”的提示
              }}
              rowKey={(record) => record.id}
              rowClassName={(_, index) => (index % 2 == 1 ? 'rowBgColor' : '')} dataSource={versionList}
              pagination={false}
              columns={columns1}
              scroll={{ y: 300 }} />
          </div>
        </div>
        <div className='log-content'>
          <div className='log-titles'>
            <div>日志</div>
          </div>
          <div className='log-content-box'>
            {
              <div id='log-content' style={{ fontFamily: detectOS() == 'Mac' ? 'monospace' : 'cursive', height: '400px', overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: codeLog }}></div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};
export default Index;
