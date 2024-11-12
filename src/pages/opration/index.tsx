import React, { useState, useEffect } from 'react';
import { Button, Space, Table, message } from 'antd';
import './index.less';
import { detectOS } from '@/utils/common';
import { webSocket } from '@/utils/socket';
import { getStorage } from '@/utils/storage';
import { history } from 'umi';
import { finishedSqlconfirmAPI, getFinishedLastugpAPI } from '@/services/comservice';
import './index.less'
import EtdcHeader from '@/components/NewHeader';
import long_arrow from '../../../public/icons/ectd/long_arrow.png'
import { getOpServiceListAPI } from '@/services/opration';
import ApplyModal from './components/applyModal';
import VersionAddOrEditModal from './components/versionAddModal';
import LogDetailModal from './components/logDetailModal';
import ConfigModal from './components/configModal';
import EnvConfigModal from './components/envConfigModal';
import VersionDetailModal from './components/versionDetailModal';
import { getOpVersionListAPI, getCommentVersionAPI, getRevisionVersionAPI } from '@/services/version';
import moment from 'moment';
import CommentModal from './components/commentModal';
import ApplyDownModal from './components/applyDownModal';
import { editEnvConfigAPI } from '@/services/envConfig';
import PortModal from './components/portModal';
let webShh: any = null,
  timeoutObj: any = undefined,
  serverTimeoutObj: any = undefined;
let webShhApply: any = null,
  timeoutObjApply: any = undefined,
  serverTimeoutObjApply: any = undefined;
let webShhRefresh: any = null,
  timeoutObjRefresh: any = undefined,
  serverTimeoutObjRefresh: any = undefined;
const Index: React.FC = () => {
  const [isDone, setIsDone] = useState(false)
  const [applyIsDone, setApplyIsDone] = useState(false)
  const [versionList, setVersionList] = useState([])
  const [serviceList, setServiceList] = useState([])
  const [codeLog, setCodeLog] = useState<string>('');
  const [isScroll, setIsScroll] = useState(false)
  const [serviceStep, setServiceStep] = useState(-1)
  const [applyStep, setApplyStep] = useState(-1)
  const [refreshTopText, setRefreshTopText] = useState('')
  const [refreshBotText, setRefreshBotText] = useState('')
  const [applyBotText, setApplyBotText] = useState('')
  const [visible, setVisible] = useState<boolean>(false);
  const [visible1, setVisible1] = useState<boolean>(false);
  const [record1, setRecord1] = useState<boolean>(false);
  const [visible2, setVisible2] = useState<boolean>(false);
  const [record2, setRecord2] = useState<any>({});
  const [visible3, setVisible3] = useState<boolean>(false);
  const [record3, setRecord3] = useState<any>({});
  const [visible4, setVisible4] = useState<boolean>(false);
  const [record4, setRecord4] = useState<any>({});
  const [visible5, setVisible5] = useState<boolean>(false);
  const [record5, setRecord5] = useState<any>({});
  const [visible6, setVisible6] = useState<boolean>(false);
  const [record6, setRecord6] = useState<any>({});
  const [visible7, setVisible7] = useState<boolean>(false);
  const [record7, setRecord7] = useState<any>({});
  const [visible8, setVisible8] = useState<boolean>(false);
  const [record8, setRecord8] = useState<any>({});
  const [infoDetail, setInfoDetail] = useState<any>({
    stsd: null,
    success: '',
    info: '',
    error: ''
  });
  // apply Modal
  const isShowModal = (show: boolean) => {
    setVisible(show);
  };
  // version Modal
  const isShowModal1 = (show: boolean) => {
    setVisible1(show);
    setRecord1(versionList[0])
  };
  // logDetail Modal
  const isShowModal2 = (show: boolean, row?: any) => {
    setVisible2(show);
    setRecord2(row)
  };
  // config Modal
  const isShowModal3 = (show: boolean, row?: any) => {
    setVisible3(show);
    setRecord3(row)
  };
  // envConfig Modal
  const isShowModal4 = (show: boolean, row?: any) => {
    setVisible4(show);
    setRecord4({
      env: getStorage('env'),
      organize: history?.location?.query?.organize
    });
  };
  // envConfig Modal
  const isShowModal5 = (show: boolean, row?: any) => {
    setVisible5(show);
    setRecord5(row)
  };
  // comment Modal
  const isShowModal6 = (show: boolean, row?: any) => {
    setVisible6(show);
    setRecord6(row)
  };
  const isShowModal7 = (show: boolean) => {
    setVisible7(show);
    setRecord7({
      env: getStorage('env'),
      organize: history?.location?.query?.organize
    });
  };
  // port Modal
  const isShowModal8 = (show: boolean, row?: any) => {
    setVisible8(show);
    setRecord8(row)
  };
  // 保持步骤心跳
  const longRefreshstart = () => {
    //1、通过关闭定时器和倒计时进行重置心跳
    clearInterval(timeoutObjRefresh);
    clearTimeout(serverTimeoutObjRefresh);
    // 2、每隔3s向后端发送一条商议好的数据
    timeoutObjRefresh = setInterval(() => {
      // webShhRefresh?.readyState == 1 正常连接
      if (webShhRefresh?.readyState === 1) {
        webShhRefresh.send('ping');
      } else {
        // webShhRefresh?.readyState != 1 连接异常 重新建立连接
        setWebShhRefresh()
      }
    }, 3000);
  };
  // 发送请求
  const setWebShhRefresh = async () => {
    const data = {
      env: getStorage('env'),
      organize: history?.location?.query?.organize
    }
    // 必须设置格式为arraybuffer，zmodem 才可以使用
    webShhRefresh = await webSocket('/devopsCore/refresh', data);
    webShhRefresh.onopen = (res: any) => {
      longRefreshstart()
    };
    // 回调
    webShhRefresh.onmessage = function (recv: any) {
      if (typeof (recv.data) === 'string') {
        if (recv.data == 'pong' || recv.data == 'null') {
          return
        }
        const _data = JSON.parse(recv.data)
        if (_data.Step == 1 && (!_data.IsDone)) {
          setServiceStep(3)
        } else if (_data.Step == 1 && _data.IsDone) {
          setServiceStep(4)
          setIsDone(!(_data.IsDone))
          setRefreshTopText(_data.Msg)
        } else if (_data.Step === 0 && (!_data.IsDone)) {
          setServiceStep(2)
        }
        if ((!_data.IsDone)) {
          setRefreshBotText(_data.Msg)
        }
      } else {
        // zsentry.consume(recv.data);
      }
    };
    // 报错
    webShhRefresh.onerror = function () {
      webShhRefresh?.close();
      webShhRefresh = null;
    }
  };
  // 保持步骤心跳
  const longApplystart = () => {
    //1、通过关闭定时器和倒计时进行重置心跳
    clearInterval(timeoutObjApply);
    clearTimeout(serverTimeoutObjApply);
    // 2、每隔30s向后端发送一条商议好的数据
    timeoutObjApply = setInterval(() => {
      if (webShhApply?.readyState === 1) {
        webShhApply.send('ping');
      } else {
        // webShhRefresh?.readyState != 1 连接异常 重新建立连接
        setWebShhApply()
      }
    }, 3000);
  };
  // 发送请求
  const setWebShhApply = async () => {
    const data = {
      env:  getStorage('env'),
      organize: history?.location?.query?.organize
    }
    // 必须设置格式为arraybuffer，zmodem 才可以使用
    webShhApply = await webSocket('/devopsCore/apply', data);
    webShhApply.onopen = (res: any) => {
      longApplystart();
    };
    // 回调
    webShhApply.onmessage = function (recv: any) {
      if (typeof (recv.data) === 'string') {
        if (recv.data == 'pong' || recv.data == 'null') {
          return
        }
        const _data = JSON.parse(recv.data)
        if (_data.Step >= 0 && (!_data.IsDone)) {
          setApplyStep(_data.Step + 2)
          setApplyIsDone(!(_data.IsDone))
        } else {
          setApplyIsDone(!(_data.IsDone))
        }
        if (_data.Step >= 0 && (_data.IsDone)) {
          setApplyStep(_data.Step + 3)
          getApplyResult()
        }

        if ((!_data.IsDone) && _data.Msg != '') {
          setApplyBotText(_data.Msg)
        }
        if (_data.NeedSqlConfirm) {
          isShowModal7(true)
        }
        // if (_data.Msg == '') {
        //   return
        // }
        // applyData_ += (_data.Msg) + '<br/>';
        // setApplyData(applyData_)
      } else {
        // zsentry.consume(recv.data);
      }
    };
    // 报错
    webShhApply.onerror = function () {
      webShhApply?.close();
      webShhApply = null;
    }
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
        setWebShh(getStorage('env'))
      }
    }, 3000);
  };
  let data_ = '';
  // 发送请求
  const setWebShh = async () => {
    const data = {
      env: getStorage('env'),
      sname: 'devopsCore'
    }
    // 必须设置格式为arraybuffer，zmodem 才可以使用
    webShh = await webSocket('/devopsCore/logsreal', data);
    webShh.onopen = (res: any) => {
      longstart();
    };
    // 回调
    webShh.onmessage = function (recv: any) {
      if (typeof (recv.data) === 'string') {
        if (recv.data == 'pong' || recv.data == 'null') {
          // setCodeLog('')
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
      // setWebShh(getStorage('env'))
    }
  };
  // 刷新
  const refresh = () => {
    setServiceStep(1)
    setIsDone(true)
    webShhRefresh.send('refresh');
  }
  // 应用
  const onFinish = async (value) => {
    setApplyStep(1)
    setApplyIsDone(true)
    // setApplyData('')
    isShowModal(false)
    webShhApply.send('apply??' + value.desc)
  }
  // 修订版本
  const onFinish1 = async (value) => {
    const params = {
      organize: record1.organize,
      env: getStorage('env'),
      branch: record1.branch,
      revision: value.revision,
    }
    const { status, msg } = await getRevisionVersionAPI(params)
    if (status === 0) {
      isShowModal1(false)
      message.success('版本修订成功')
      getVersionList()
    } else {
      message.error(msg)
    }
  }
  // env配置
  const onFinish4 = async (newCode: string) => {
    const param = {
      env: getStorage('env'),
      sname: record4.sname,
      envs: newCode,
      organize: history?.location?.query?.organize
    }
    console.log(param)
    const { status, msg } = await editEnvConfigAPI(param)
    if (status === 0) {
      isShowModal4(false)
      message.success('修改成功')
    } else {
      message.warning(msg)
    }
  }
  // 评论
  const onFinish6 = async (value) => {
    const params = {
      organize: record6.organize,
      env: getStorage('env'),
      branch: record6.branch,
      content: value.content,
    }
    const { status, msg } = await getCommentVersionAPI(params)
    if (status === 0) {
      isShowModal6(false)
      message.success('评论成功')
      getVersionList()
    } else {
      message.error(msg)
    }
  }
  const onFinish7 = async (value, type) => {
    console.log(value)
    const params = {
      env: getStorage('env'),
      organize: history?.location?.query?.organize,
      sqls: value,
      agree: type ? 'no' : 'yes'
    }
    const { status, msg } = await finishedSqlconfirmAPI(params)
    if (status == 0) {
      isShowModal7(false)
    } else {
      message.error(msg)
    }
  }
  // 获取apply执行结果
  const getApplyResult = async () => {
    const params = {
      env: getStorage('env'),
      organize: history?.location?.query?.organize,
    }
    const { data } = await getFinishedLastugpAPI(params)
    setInfoDetail(data)
  }
  useEffect(() => {
    setWebShh()
    setWebShhApply()
    setWebShhRefresh()
    getServiceList()
    getVersionList()
    getApplyResult()
    return () => {
      clearInterval(timeoutObj);
      clearTimeout(serverTimeoutObj);
      clearInterval(timeoutObjApply);
      clearTimeout(serverTimeoutObjApply);
      clearInterval(timeoutObjRefresh);
      clearTimeout(serverTimeoutObjRefresh);
      if (webShh) {
        webShh.close();
      }
      if (webShhApply) {
        webShhApply.close();
      }
      if (webShhRefresh) {
        webShhRefresh.close();
      }
    }
  }, [])
  let befortop = 0

  // 获取service列表
  const getServiceList = async () => {
    const params = {
      env: getStorage('env'),
      branch: history?.location?.query?.branch,
      organize: history?.location?.query?.organize,
    }
    const { data: { items } } = await getOpServiceListAPI(params)
    setServiceList(items)
  }
  // 获取version列表
  const getVersionList = async () => {
    const params = {
      env: getStorage('env'),
      // branch: history?.location?.query?.branch,
      organize: history?.location?.query?.organize,
      // organize: 'gkzyrent',
    }
    const { data: { items } } = await getOpVersionListAPI(params)
    setVersionList(items)
  }
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
      dataIndex: 'sname',
      align: 'center',
      key: 'sname',
    },
    {
      title: '服务状态',
      dataIndex: 'status',
      key: 'status',
      hideInSearch: true,
      align: 'center',
      render: (_, record) => record.status == 'lost' ? '失联' : record.status == 'good' ? '正常' : record.status == 'fault' ? '故障' : '--',
    },
    {
      title: '启动时间',
      dataIndex: 'bootupts',
      align: 'center',
      key: 'bootupts',
      render: (_, record) => record.bootupts ? moment(record.bootupts * 1000).format('YYYY-MM-DD HH:mm') : '--',
    },
    {
      title: '镜像时间',
      dataIndex: 'buildtime',
      align: 'center',
      key: 'buildtime',
    },
    {
      title: 'Sql升级时间',
      dataIndex: 'resptime',
      align: 'center',
      key: 'resptime',
    },
    {
      title: '创建时间',
      dataIndex: 'createtime',
      align: 'center',
      key: 'createtime',
    },
    {
      title: '操作',
      align: 'center',
      render: (_, row: any) => (
        <Space>
          <a onClick={() => { isShowModal2(true, row) }}>日志</a>
          <a onClick={() => { isShowModal3(true, row) }}>配置</a>
          <a onClick={() => { isShowModal8(true, row) }}>接口</a>
          <a onClick={() => { isShowModal4(true, row) }}>ENV</a>
        </Space>
      ),
    },
  ];
  const columns1 = [
    {
      title: '版本名称',
      dataIndex: 'branch',
      key: 'branch',
      align: 'center',
    },
    {
      title: '版本描述',
      dataIndex: 'revision',
      key: 'revision',
      align: 'center',
      ellipsis: true
    },
    {
      title: '修订次数',
      dataIndex: 'rcount',
      key: 'rcount',
      align: 'center',
    },
    {
      title: '评论次数',
      dataIndex: 'ccount',
      key: 'ccount',
      align: 'center',
    },
    {
      title: '修订时间',
      dataIndex: 'ts',
      key: 'ts',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (_, row) => (
        <Space>
          <a onClick={() => { isShowModal5(true, row) }}>详情</a>
          <a onClick={() => { isShowModal6(true, row) }}>评论</a>
        </Space>
      ),
    },
  ];
  return (
    <div className='page-container'>
      {/* <Button onClick={() => { isShowModal7(true)}}>7777</Button> */}
      <EtdcHeader />

      <div className='page-wrap'>
        <div className='service-list'>
          <div className='tables-titles'>
            <div>Service</div>
            <div className='version-info'>
              <div>项目名称: {history?.location?.query?.organize}</div>
              <div>版本号: {history?.location?.query?.branch}</div>
              <div>环境:{getStorage('env')}</div>
            </div>
          </div>
          <div>
            <Table
              rowKey={(record) => record.id}
              rowClassName={(_, index) => (index % 2 == 1 ? 'rowBgColor' : '')}
              dataSource={serviceList}
              pagination={false}
              columns={columns}
              scroll={{ y: 300 }} />
          </div>
        </div>
        <div className='version-list'>
          <div className='tables-titles'>
            <div>Version</div>
            <div><Button type="primary" onClick={() => {
              isShowModal1(true)
            }}>修订版本</Button></div>
          </div>
          <div>
            <Table
              locale={{
                emptyText: '', // 使用自定义组件作为“暂无数据”的提示
              }}
              rowKey={(record) => record.id}
              rowClassName={(_, index) => (index % 2 == 1 ? 'rowBgColor' : '')}
              dataSource={versionList}
              pagination={false}
              columns={columns1}
              scroll={{ y: 300 }} />
          </div>
        </div>
        <div className='opration-refresh'>
          <div className='opration-refresh-title'>
            <div>
              <Button type="primary" loading={isDone} onClick={() => {
                refresh()
              }}>{isDone ? 'waiting...' : 'Refresh'}</Button>
            </div>
            <div className='opration-refresh-step'>
              <div style={{ color: serviceStep == 1 ? '#11BBAA' : '' }}>Start</div>
              <div><img src={long_arrow} alt="" /></div>
              <div style={{ color: serviceStep == 2 ? '#11BBAA' : '' }}>Repo Sync</div>
              <div><img src={long_arrow} alt="" /></div>
              <div style={{ color: serviceStep == 3 ? '#11BBAA' : '' }}>Project Scan</div>
              <div><img src={long_arrow} alt="" /></div>
              <div style={{ color: serviceStep == 4 ? '#11BBAA' : '' }}>End</div>
            </div>
          </div>
          <div className='opration-refresh-content'>
            <div className='refresh-log-box'>
              {
                <div id='refresh-content' style={{ fontFamily: detectOS() == 'Mac' ? 'monospace' : 'cursive', height: '200px', overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: refreshTopText }}></div>
              }
            </div>
            <div className='refresh-line-box'>
              {
                <div id='refresh-content' style={{ fontFamily: detectOS() == 'Mac' ? 'monospace' : 'cursive', overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: refreshBotText }}></div>
              }
            </div>
          </div>
        </div>
        <div className='opration-apply'>
          <div className='opration-apply-title'>
            <div>
              <Button type="primary" loading={applyIsDone} onClick={() => {
                isShowModal(true)
              }}>{applyIsDone ? 'waiting...' : 'Apply'}</Button>
            </div>
            <div className='opration-apply-step'>
              <div style={{ color: applyStep == 1 ? '#11BBAA' : '' }}>Start</div>
              <div><img src={long_arrow} alt="" /></div>
              <div style={{ color: applyStep == 2 ? '#11BBAA' : '' }}>bootup</div>
              <div><img src={long_arrow} alt="" /></div>
              <div style={{ color: applyStep == 3 ? '#11BBAA' : '' }}>Sql gen</div>
              <div><img src={long_arrow} alt="" /></div>
              <div style={{ color: applyStep == 4 ? '#11BBAA' : '' }}>Sql confirm</div>
              <div><img src={long_arrow} alt="" /></div>
              <div style={{ color: applyStep == 5 ? '#11BBAA' : '' }}>End</div>
            </div>
          </div>
          <div className='opration-apply-content'>
            <div className='apply-log-box'>
              <div>上次执行结果:</div>
              <div>时间: {moment(infoDetail.stsd * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
              <div>标题: {infoDetail.info}</div>
              <div>执行结果: {infoDetail.success == 'yes' ? '成功' : '失败'}</div>
              {
                infoDetail.success != 'yes' && <div>失败原因: {infoDetail.error}</div>
              }
            </div>
            <div className='apply-line-box'>
              {
                <div id='refresh-content' style={{ fontFamily: detectOS() == 'Mac' ? 'monospace' : 'cursive', overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: applyBotText }}></div>
              }
            </div>
          </div>
        </div>
        <div className='log-content'>
          <div className='log-titles'>
            <div>日志</div>
          </div>
          <div className='log-content-box'>
            {
              <div id='log-content' style={{ fontFamily: detectOS() == 'Mac' ? 'monospace' : 'cursive', height: '800px', overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: codeLog }}></div>
            }
          </div>
        </div>
      </div>
      {!visible ? (
        ''
      ) : (
        <ApplyModal
          visible={visible}
          isShowModal={isShowModal}
          onFinish={onFinish}
        />
      )}
      {!visible1 ? (
        ''
      ) : (
        <VersionAddOrEditModal
          visible={visible1}
          isShowModal={isShowModal1}
          record={record1}
          onFinish={onFinish1}
        />
      )}
      {!visible2 ? (
        ''
      ) : (
        <LogDetailModal
          visible={visible2}
          isShowModal={isShowModal2}
          record={record2}
        />
      )}
      {!visible3 ? (
        ''
      ) : (
        <ConfigModal
          visible={visible3}
          isShowModal={isShowModal3}
          record={record3}
          branch={history?.location?.query?.branch}
        />
      )}
      {!visible4 ? (
        ''
      ) : (
        <EnvConfigModal
          visible={visible4}
          isShowModal={isShowModal4}
          record={record4}
          onFinish={onFinish4}
        />
      )}
      {!visible5 ? (
        ''
      ) : (
        <VersionDetailModal
          visible={visible5}
          isShowModal={isShowModal5}
          record={record5}
        />
      )}
      {!visible6 ? (
        ''
      ) : (
        <CommentModal
          visible={visible6}
          isShowModal={isShowModal6}
          record={record6}
          onFinish={onFinish6}
        />
      )}
      {!visible7 ? (
        ''
      ) : (
        <ApplyDownModal
          visible={visible7}
          isShowModal={isShowModal7}
          onFinish={onFinish7}
          record={record7}
        />
      )}
      {!visible8 ? (
        ''
      ) : (
        <PortModal
          visible={visible8}
          isShowModal={isShowModal8}
          record={record8}
          branch={history?.location?.query?.branch}
        />
      )}
    </div>
  );
};
export default Index;
