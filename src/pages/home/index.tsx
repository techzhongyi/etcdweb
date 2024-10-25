import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {Input, Card } from 'antd';
import moment from 'moment';
import './index.less'
import { webSocket } from '@/utils/socket';
import { useModel } from 'umi';
import { getStorage } from '@/utils/storage';
let webShh: any = null,
  timeoutObj: any = undefined,
  serverTimeoutObj: any = undefined;
const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [dataList, setDataList] = useState([])
  const {envs, setEnvs } = useModel('model')
  const columns: ProColumns<any>[] = [
    {
      title: '序号',
      align: 'center',
      key: 'index',
      hideInSearch: true,
      valueType: 'index',
      width: 60,
    },
    {
      title: 'NODE名称',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: 'IP地址',
      key: 'ip',
      dataIndex: 'ip',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: 'CPU使用率',
      key: 'cpuusage',
      dataIndex: 'cpuusage',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '磁盘空间',
      key: 'diskio',
      dataIndex: 'diskio',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '内存使用率',
      align: 'center',
      dataIndex: 'memusage',
      key: 'memusage',
      hideInSearch: true,
    },
    {
      title: '系统类型',
      align: 'center',
      dataIndex: 'os',
      key: 'os',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'healthy',
      key: 'healthy',
      hideInSearch: true,
      align: 'center',
      valueType: 'select',
      valueEnum: {
        '0': { text: '运行中', status: 'Success', },
        '1': { text: '故障', status: 'Error', },
        '2': { text: '失联', status: 'Default', },
      }
    },
    {
      title: '描述',
      align: 'center',
      dataIndex: 'desc',
      key: 'desc',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '更新时间',
      align: 'center',
      dataIndex: 'updatetime',
      key: 'updatetime',
      valueType: 'dateTime',
      render: (_, row) => moment(row.updatetime).format('YYYY-MM-DD'),
      hideInSearch: true,
    },
  ];

  const licenseChange = (e) => {

  }

  // 保持心跳
  const longstart = () => {
    //1、通过关闭定时器和倒计时进行重置心跳
    clearInterval(timeoutObj);
    clearTimeout(serverTimeoutObj);
    // 2、每隔30s向后端发送一条商议好的数据
    timeoutObj = setInterval(() => {
      if (webShh?.readyState === 1) {
        webShh.send('ping');
      }
      // 3、发送数据 5s后没有接收到返回的数据进行关闭websocket重连
      serverTimeoutObj = setTimeout(() => {
        webShh?.close();
        webShh = null;
        // 通知关掉当前终端的图片长链接
        // sshImgCol(connect_id)
        // destroyed(false)
        setWebShh()
      }, 10000);

    }, 3000);
  };
  // 发送请求
  const setWebShh = async () => {
    const data = {
      env: envs || getStorage('env')
    }
    console.log(envs)
    // 必须设置格式为arraybuffer，zmodem 才可以使用
    webShh = await webSocket('/devopsCore/home', data);
    webShh.onopen = (res: any) => {
      longstart();
    };
    // 回调
    webShh.onmessage = function (recv: any) {
      longstart();
      if (typeof (recv.data) === 'string') {
        if (recv.data == 'pong' || recv.data == 'null') {
          setDataList([])
          return
        }
        const data_ = JSON.parse(recv.data);
        setDataList(data_)
      } else {
        // zsentry.consume(recv.data);
      }
    };
    // 报错
    webShh.onerror = function () {
      webShh?.close();
      webShh = null;
      setWebShh()
    }
  };
  // 获取初始数据
//   useEffect(() => {
//     eventBus.on('env', (env) => { handleEvent(env) });
//     return () => {
//         eventBus.off('env', handleEvent);
//     }
// }, []);
  useEffect(() => {
    setWebShh()
    return () => {
      clearInterval(timeoutObj);
      clearTimeout(serverTimeoutObj);
      if (webShh) {
          webShh.close();
      }
  };
  }, [])
  return (
    <PageContainer
      ghost
      header={{
        title: ' ',
        breadcrumb: {},
      }}
    >
      <Card style={{marginBottom: '20px'}}>
        <div className='top-search'>
          <div className='top-search-left'>
            <div className='top-search-label'>服务器名称:</div>
            <div><Input placeholder="请输入服务器名称" allowClear={true} onChange={(e) => { licenseChange(e) }} /></div>
          </div>
          <div className='top-search-right'>
            <div>
              <div className='green'></div>
              <div className='text'>正常</div>
            </div>
            <div>
              <div className='red'></div>
              <div className='text'>异常</div>
            </div>
            <div>
              <div className='yellow'></div>
              <div className='text'>失联</div>
            </div>
          </div>
        </div>
        <div className='node-wrap'>
          {
            dataList.map(item => {
              return (
                <div className='node-list'>
                  <div className='node-title'>{item.name}</div>
                  <div className='square-list'>
                    {
                      item.services.map(item_ => {
                        return (
                          <div className={item_.health === 0 ? 'square-item-green' : item_.health === 1 ? 'square-item-red' : 'square-item-yellow'}>
                            {item_.sname}
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      </Card>
      <ProTable<any>
        bordered
        columns={columns}
        actionRef={actionRef}
        dataSource={dataList}
        editable={{
          type: 'multiple',
        }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        search={false}
        pagination={{
          pageSize: pageSize,
          showSizeChanger: true,
          onShowSizeChange: (current, pageSize) => {
            setPageSize(pageSize);
          },
        }}
        options={false}
        dateFormatter="string"
        headerTitle="配置列表"
        toolBarRender={() => []}
      />
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
