import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import './index.less'
import { webSocket } from '@/utils/socket';
import { useModel } from 'umi';
import { setStorage, getStorage } from '@/utils/storage';
import eventBus from '@/utils/eventBus';
import green_cloud from '../../../public/icons/ectd/green_cloud.png'
import red_cloud from '../../../public/icons/ectd/red_cloud.png'
import gray_cloud from '../../../public/icons/ectd/gray_cloud.png'
import EtdcHeader from '@/components/NewHeader';
let webShh: any = null,
  timeoutObj: any = undefined,
  serverTimeoutObj: any = undefined;
const Index: React.FC = () => {

  const { initialState } = useModel('@@initialState');
  const { extraArray, defaultEnv } = initialState?.currentUser
  const [initDefaultEnv, setInitDefaultEnv] = useState(getStorage('env') || defaultEnv)
  const [dataList, setDataList] = useState([])

  useEffect(() => {
    if (!getStorage('env')) {
      setStorage('env', defaultEnv)
    }
    eventBus.emit('envChange', defaultEnv);
  }, [defaultEnv])
  // 环境切换
  const envChange = (e) => {
    setStorage('env', e)
    setInitDefaultEnv(e)
    // setEnvs(e)
    eventBus.emit('envChange', e);
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
      } else {
        // webShhRefresh?.readyState != 1 连接异常 重新建立连接
        setWebShh(getStorage('env'))
      }
    }, 3000);
  };
  // 发送请求
  const setWebShh = async (env?) => {
    const data = {
      env: env ? env : getStorage('env'),
      organize: getStorage('organize')
    }
    // 必须设置格式为arraybuffer，zmodem 才可以使用
    webShh = await webSocket('/devopsCore/home', data);
    webShh.onopen = (res: any) => {
      longstart();
    };
    // 回调
    webShh.onmessage = function (recv: any) {
      if (typeof (recv.data) === 'string') {
        if (recv.data == 'pong' || recv.data == 'null') {
          return
        }
        const data_ = JSON.parse(recv.data);
        console.log(data_)
        setDataList(data_)
      } else {
        // zsentry.consume(recv.data);
      }
    };
    // 报错
    webShh.onerror = function () {
      webShh?.close();
      webShh = null;
      // setWebShh()
    }
  };
  const handleEvent = (env) => {
    setWebShh(env)
  }
  useEffect(() => {
    setWebShh()
    eventBus.on('envChange', (env) => { handleEvent(env) });
    return () => {
      eventBus.off('envChange', handleEvent);
      clearInterval(timeoutObj);
      clearTimeout(serverTimeoutObj);
      if (webShh) {
        webShh.close();
      }
    };

  }, [])

  return (
    <div className='page-container'>
      {/* <div className='page-header'>
        <div className='page-header-logo'><img src={logo} alt="" /></div>
        <div className='page-header-title'>服务监控治理CICD平台</div>
        <div className='page-header-action'>
          <div>
            <div className='user-icon'><img src={user_icon} alt="" /></div>
            <div className='user-name'>{currentUser.name}</div>
          </div>
          <div>
            <LogoutOutlined onClick={() => { logout() }} style={{ fontSize: '30px' }} />
          </div>
        </div>
      </div> */}
      <EtdcHeader />
      <div className='home-select-env'>
        <Select
          defaultValue={initDefaultEnv}
          style={{ width: 200 }}
          onChange={(e) => { envChange(e) }}
          options={extraArray}
        />
      </div>
      <div className='home-content'>
        <div className='home-content-list'>
          <div className='list-title'>
            <div>Gkzyrent.node1</div>
            <div>CPU:90%,MEM:40%,IO:XXX</div>
            <div>V2.0</div>
          </div>
          <div className='list-content'>
            <div className='list-item'>
              <div className='list-item-icon'><img src={green_cloud} alt="" /></div>
              <div className='list-item-text'>
                <div className='text-title'>HttpCore</div>
                <div className='text-status'>健康</div>
              </div>
            </div>
            <div className='list-item'>
              <div className='list-item-icon'><img src={green_cloud} alt="" /></div>
              <div className='list-item-text'>
                <div className='text-title'>HttpCore</div>
                <div className='text-status'>健康</div>
              </div>
            </div>
            <div className='list-item'>
              <div className='list-item-icon'><img src={green_cloud} alt="" /></div>
              <div className='list-item-text'>
                <div className='text-title'>HttpCore</div>
                <div className='text-status'>健康</div>
              </div>
            </div>
            <div className='list-item'>
              <div className='list-item-icon'><img src={gray_cloud} alt="" /></div>
              <div className='list-item-text'>
                <div className='text-title'>HttpCore</div>
                <div className='text-status'>健康</div>
              </div>
            </div>
            <div className='list-item'>
              <div className='list-item-icon'><img src={red_cloud} alt="" /></div>
              <div className='list-item-text'>
                <div className='text-title'>HttpCore</div>
                <div className='text-status'>健康</div>
              </div>
            </div>
          </div>
        </div>
        <div className='home-content-list'>
          <div className='list-title'>
            <div>Gkzyrent.node1</div>
            <div>CPU:90%,MEM:40%,IO:XXX</div>
            <div>V2.0</div>
          </div>
          <div className='list-content'>
            <div className='list-item'>
              <div className='list-item-icon'><img src={green_cloud} alt="" /></div>
              <div className='list-item-text'>
                <div className='text-title'>HttpCore</div>
                <div className='text-status'>健康</div>
              </div>
            </div>
            <div className='list-item'>
              <div className='list-item-icon'><img src={green_cloud} alt="" /></div>
              <div className='list-item-text'>
                <div className='text-title'>HttpCore</div>
                <div className='text-status'>健康</div>
              </div>
            </div>
            <div className='list-item'>
              <div className='list-item-icon'><img src={green_cloud} alt="" /></div>
              <div className='list-item-text'>
                <div className='text-title'>HttpCore</div>
                <div className='text-status'>健康</div>
              </div>
            </div>
            <div className='list-item'>
              <div className='list-item-icon'><img src={gray_cloud} alt="" /></div>
              <div className='list-item-text'>
                <div className='text-title'>HttpCore</div>
                <div className='text-status'>健康</div>
              </div>
            </div>
            <div className='list-item'>
              <div className='list-item-icon'><img src={red_cloud} alt="" /></div>
              <div className='list-item-text'>
                <div className='text-title'>HttpCore</div>
                <div className='text-status'>健康</div>
              </div>
            </div>
          </div>
        </div>
        <div className='home-content-list'>
          <div className='list-title'>
            <div>Gkzyrent.node1</div>
            <div>CPU:90%,MEM:40%,IO:XXX</div>
            <div>V2.0</div>
          </div>
          <div className='list-content'>
            <div className='list-item'>
              <div className='list-item-icon'><img src={green_cloud} alt="" /></div>
              <div className='list-item-text'>
                <div className='text-title'>HttpCore</div>
                <div className='text-status'>健康</div>
              </div>
            </div>
            <div className='list-item'>
              <div className='list-item-icon'><img src={green_cloud} alt="" /></div>
              <div className='list-item-text'>
                <div className='text-title'>HttpCore</div>
                <div className='text-status'>健康</div>
              </div>
            </div>
            <div className='list-item'>
              <div className='list-item-icon'><img src={green_cloud} alt="" /></div>
              <div className='list-item-text'>
                <div className='text-title'>HttpCore</div>
                <div className='text-status'>健康</div>
              </div>
            </div>
            <div className='list-item'>
              <div className='list-item-icon'><img src={gray_cloud} alt="" /></div>
              <div className='list-item-text'>
                <div className='text-title'>HttpCore</div>
                <div className='text-status'>健康</div>
              </div>
            </div>
            <div className='list-item'>
              <div className='list-item-icon'><img src={red_cloud} alt="" /></div>
              <div className='list-item-text'>
                <div className='text-title'>HttpCore</div>
                <div className='text-status'>健康</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // <PageContainer
    //   ghost
    //   header={{
    //     title: ' ',
    //     breadcrumb: {},
    //   }}
    // >
    //   <Card style={{ marginBottom: '20px' }}>
    //     <div className='top-search'>
    //       <div className='top-search-left'>
    //         {/* <div className='top-search-label'>服务器名称:</div>
    //         <div><Input placeholder="请输入服务器名称" allowClear={true} onChange={(e) => { licenseChange(e) }} /></div> */}
    //       </div>
    //       <div className='top-search-right'>
    //         <div>
    //           <div className='green'></div>
    //           <div className='text'>正常</div>
    //         </div>
    //         <div>
    //           <div className='red'></div>
    //           <div className='text'>异常</div>
    //         </div>
    //         <div>
    //           <div className='yellow'></div>
    //           <div className='text'>失联</div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className='node-wrap'>
    //       {
    //         dataList.map(item => {
    //           return (
    //             <div className='node-list'>
    //               <div className='node-title'>{item.name}</div>
    //               <div className='square-list'>
    //                 {
    //                   item.services.map(item_ => {
    //                     return (
    //                       <div className={item_.health === 0 ? 'square-item-green' : item_.health === 1 ? 'square-item-red' : 'square-item-yellow'}>
    //                         {item_.sname}
    //                       </div>
    //                     )
    //                   })
    //                 }
    //               </div>
    //             </div>
    //           )
    //         })
    //       }
    //     </div>
    //   </Card>
    //   <ProTable<any>
    //     bordered
    //     columns={columns}
    //     actionRef={actionRef}
    //     dataSource={dataList}
    //     editable={{
    //       type: 'multiple',
    //     }}
    //     columnsState={{
    //       persistenceKey: 'pro-table-singe-demos',
    //       persistenceType: 'localStorage',
    //     }}
    //     rowKey="id"
    //     search={false}
    //     pagination={{
    //       pageSize: pageSize,
    //       showSizeChanger: true,
    //       onShowSizeChange: (current, pageSize) => {
    //         setPageSize(pageSize);
    //       },
    //     }}
    //     options={false}
    //     dateFormatter="string"
    //     headerTitle="配置列表"
    //     toolBarRender={() => []}
    //   />
    //   {/* {!visible ? (
    //     ''
    //   ) : (
    //     <ConfigAddOrEditModal
    //       visible={visible}
    //       isShowModal={isShowModal}
    //       onFinish={onFinish}
    //       record={record}
    //       editId={editId}
    //     />
    //   )}
    //   {!visible1 ? (
    //     ''
    //   ) : (
    //     <ComparesModal
    //       visible={visible1}
    //       isShowModal={isShowModal1}
    //       onFinish={onFinish1}
    //       record={record}
    //       editId={editId}
    //     />
    //   )} */}
    // </PageContainer>
  );
};
export default Index;
