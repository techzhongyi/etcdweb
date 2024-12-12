import React, { useEffect, useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Modal, Button, Tabs } from 'antd';
import './index.less'
import { getLogsinfluxListAPI } from '@/services/log';
import { detectOS } from '@/utils/common';
import { webSocket } from '@/utils/socket';
let webShh: any = null,
  timeoutObj: any = undefined,
  serverTimeoutObj: any = undefined;
let data_ = '';
const LogDetailModal: React.FC<any> = (props: any) => {
  const { visible, isShowModal, record } = props;
  const actionRef = useRef<ActionType>();
  const formRef = useRef();
  const [codeLog, setCodeLog] = useState<string>('');
  const [isScroll, setIsScroll] = useState(false)
  const [pageSize, setPageSize] = useState<number>(10);
  const title = record.sname + '日志'
  const columns: ProColumns<any>[] = [
    {
      title: '内容',
      dataIndex: 'msg',
      key: 'msg',
      hideInSearch: true,
    },
    {
      title: '时间范围',
      key: 'range_time',
      dataIndex: 'range_time',
      align: 'center',
      valueType: 'dateRange',
      hideInTable: true,
    },
  ];
  const onModealCancel = () => {
    isShowModal(false);
  };
  // 获取列表
  const getList = async (params: any) => {
    const param = {
      page: params.current,
      count: params.pageSize,
      sname: record.sname,
      env: record.env,
      organize: record.organize,
      level: params.level ? params.level : '',
      type: params.type ? params.type : '',
      node: params.node ? params.node : '',
      start: params.range_time ? new Date((params.range_time[0] + ' ' + '00:00:00')).getTime() / 1000 : 0,
      end: params.range_time ? new Date((params.range_time[1] + ' ' + '23:59:59')).getTime() / 1000 : 0,
    };
    const {
      data: { list, total },
      status,
    } = await getLogsinfluxListAPI(param);
    return {
      data: list,
      total: total,
      success: status === 0,
    };
  };
  // 保持日志心跳
  const longstart = () => {
    //1、通过关闭定时器和倒计时进行重置心跳
    clearInterval(timeoutObj);
    clearTimeout(serverTimeoutObj);
    // 2、每隔30s向后端发送一条商议好的数据
    timeoutObj = setInterval(() => {
      if (webShh?.readyState === 1) {
        webShh.send('ping');
      } else {
        // webShhRefresh?.readyState != 1 连接异常 重新建立连接
        setWebShh()
      }
    }, 3000);
  };

  // 发送请求
  const setWebShh = async () => {
    const data = {
      env: record.env,
      sname: record.sname,
      organize: record.organize,
    }
    // 必须设置格式为arraybuffer，zmodem 才可以使用
    webShh = await webSocket('/devopsCore/logsreal', data, 'servs');
    webShh.onopen = (res: any) => {
      longstart();
    };
    // 回调
    webShh.onmessage = function (recv: any) {
      if (typeof (recv.data) === 'string') {
        if (recv.data == 'pong' || recv.data == 'null') {
          return
        }
        data_ += (recv.data + '<br/>');
        setCodeLog(data_)
      } else {
        // zsentry.consume(recv.data);
      }
    };
    // 报错
    webShh.onerror = function () {
      webShh?.close();
      webShh = null;
    }
  };
  const isScrollAtBottom = (container) => {
    if(!container){
      return
    }
    return container.scrollHeight - container.scrollTop === container.clientHeight;
  }
  let befortop = 0
  useEffect(() => {
    const div = document.getElementById('log-history')
    window.addEventListener('scroll', () => {
      if (isScrollAtBottom(div)) {
        setIsScroll(false)
      } else {
        const aftertop = div?.scrollTop;//兼容
        if (aftertop - befortop > 0) {
          setIsScroll(true)
        } else {
          setIsScroll(true)
        }
        befortop = aftertop;
      }
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
  useEffect(() => {
    if (record) {
      setWebShh()
    }

    return () => {
      clearInterval(timeoutObj);
      clearTimeout(serverTimeoutObj);
      if (webShh) {
        webShh.close();
      }
    }
  }, [record])
  // 清屏
  const clearLog = () => {
    data_ = ''
    setCodeLog('')
  }
  return (
    <Modal
      title={title}
      width={1280}
      footer={null}
      open={visible}
      maskClosable={false}
      onCancel={onModealCancel}
      destroyOnClose={true}
    >
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="实时日志" key="1">
          <div className='log-history'>
            {
              <div id='log-history' style={{ fontFamily: detectOS() == 'Mac' ? 'monospace' : 'cursive', height: '700px', overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: codeLog }}></div>
            }
            <div className='log-clear' onClick={() => {
              clearLog()
            }}>
              <div> clear </div>
            </div>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="历史日志" key="2">
            <div className='log-select-content' style={{ height: '700px'}}>
              <ProTable<any>
                bordered
                columns={columns}
                actionRef={actionRef}
                formRef={formRef}
                request={(params) => getList(params)}
                editable={{
                  type: 'multiple',
                }}
                columnsState={{
                  persistenceKey: 'pro-table-singe-demos',
                  persistenceType: 'localStorage',
                }}
                rowKey="id"
                search={{
                  labelWidth: 'auto',
                }}
                pagination={{
                  pageSize: pageSize,
                  showSizeChanger: true,
                  onShowSizeChange: (current, pageSize) => {
                    setPageSize(pageSize);
                  },
                }}
                options={false}
                dateFormatter="string"
                headerTitle={false}
                toolBarRender={false}
              />
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};
export default LogDetailModal;
