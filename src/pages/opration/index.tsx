import React, { useState, useEffect } from 'react';
import { Button, Space, Table, message } from 'antd';
import './index.less';
import ProForm from '@ant-design/pro-form';
import { detectOS } from '@/utils/common';
import { webSocket } from '@/utils/socket';
import { history, useModel } from 'umi';
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
import { getOpVersionListAPI, getCommentVersionAPI, getRevisionVersionAPI, getCreateVersionAPI, getMergeVersionAPI, getVersionListAPI } from '@/services/version';
import moment from 'moment';
import CommentModal from './components/commentModal';
import ApplyDownModal from './components/applyDownModal';
import { editEnvConfigAPI } from '@/services/envConfig';
import PortModal from './components/portModal';
import AddVersionModal from './components/addVersionModal';
import MergeModal from './components/mergeModal';
import { ProFormSelect } from '@ant-design/pro-components';

let webShh: any = null,
  timeoutObj: any = undefined,
  serverTimeoutObj: any = undefined;
let webShhEtcd: any = null,
  timeoutObjEtcd: any = undefined,
  serverTimeoutObjEtcd: any = undefined;
let webShhApply: any = null,
  timeoutObjApply: any = undefined,
  serverTimeoutObjApply: any = undefined;
let webShhRefresh: any = null,
  timeoutObjRefresh: any = undefined,
  serverTimeoutObjRefresh: any = undefined;
let data_ = '';
let etcd_data = ''
const Index: React.FC = () => {
  const [formObj] = ProForm.useForm();
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  const [isDone, setIsDone] = useState(false)
  const [branch, setBranch] = useState('')
  const [applyIsDone, setApplyIsDone] = useState(false)
  const [versionList, setVersionList] = useState([])
  const [serviceList, setServiceList] = useState([])
  const [codeLog, setCodeLog] = useState<string>('');
  const [etcdCodeLog, setEtcdCodeLog] = useState<string>('');
  const [isScroll, setIsScroll] = useState(false)
  const [isEtcdScroll, setIsEtcdScroll] = useState(false)
  const [serviceStep, setServiceStep] = useState(-1)
  const [applyStep, setApplyStep] = useState(-1)
  const [refreshTopText, setRefreshTopText] = useState('')
  const [refreshBotText, setRefreshBotText] = useState('')
  const [applyBotText, setApplyBotText] = useState('')
  const [visible, setVisible] = useState<boolean>(false);
  const [visible1, setVisible1] = useState<boolean>(false);
  const [record1, setRecord1] = useState<any>({});
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
  const [visible9, setVisible9] = useState<boolean>(false);
  const [record9, setRecord9] = useState<any>({});
  const [visible10, setVisible10] = useState<boolean>(false);
  const [record10, setRecord10] = useState<any>({});
  const [infoDetail, setInfoDetail] = useState<any>({
    stsd: null,
    success: '',
    info: '',
    error: ''
  });
  // apply Modal
  const isShowModal = (show: boolean) => {
    if (!webShhApply) {
      message.error('网络连接错误,请稍后再试...')
      return
    }
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
      ...row,
      env: history?.location?.query?.env,
      organize: history?.location?.query?.organize
    });
  };
  // envConfig Modal
  const isShowModal5 = (show: boolean, row?: any) => {
    setVisible5(show);
    setRecord5({
      ...row,
      env: history?.location?.query?.env,
      organize: history?.location?.query?.organize
    });
  };
  // comment Modal
  const isShowModal6 = (show: boolean, row?: any) => {
    setVisible6(show);
    setRecord6(row)
  };
  const isShowModal7 = (show: boolean) => {
    setVisible7(show);
    setRecord7({
      env: history?.location?.query?.env,
      organize: history?.location?.query?.organize
    });
  };
  // port Modal
  const isShowModal8 = (show: boolean, row?: any) => {
    setVisible8(show);
    setRecord8(row)
  };
  // addversion Modal
  const isShowModal9 = (show: boolean, row?: any) => {
    setVisible9(show);
    setRecord9(row)
  };
  // addversion Modal
  const isShowModal10 = (show: boolean, row?: any) => {
    setVisible10(show);
    setRecord10(row)
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
      env: history?.location?.query?.env,
      organize: history?.location?.query?.organize,
      name: currentUser.name
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
        setBranch(_data.Branch?_data.Branch:'')
        if (_data.Step >= 0 && (!_data.IsDone) && (!_data.Err)) {
          setServiceStep(_data.Step + 2)
        }
        if (_data.Step >= 0 && (_data.IsDone) && (!_data.Err)) {
          setServiceStep(_data.Step + 3)
          getServiceList(formObj.getFieldValue('version'))
          if (_data.Result != '') {
            setRefreshTopText(_data.Result)
          }
        }
        if (_data.Msg != '') {
          setRefreshBotText(_data.Msg)
        }
        setIsDone(!(_data.IsDone))
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
      env: history?.location?.query?.env,
      organize: history?.location?.query?.organize,
      name: currentUser.name
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
        if (_data.Step >= 0 && (!_data.IsDone) && (!_data.Err)) {
          setApplyStep(_data.Step + 2)
        }
        if (_data.Step >= 0 && (_data.IsDone) && (!_data.Err)) {
          setApplyStep(_data.Step + 3)
          getServiceList(formObj.getFieldValue('version'))
          getApplyResult(formObj.getFieldValue('version'))
        }
        setApplyIsDone(!(_data.IsDone))
        if (_data.Msg != '') {
          setApplyBotText(_data.Msg)
        }
        if (_data.NeedSqlConfirm) {
          isShowModal7(true)
        }
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
        setWebShh()
      }
    }, 3000);
  };

  // 发送请求
  const setWebShh = async () => {
    const data = {
      env: history?.location?.query?.env,
      sname: 'devopsCore'
    }
    // 必须设置格式为arraybuffer，zmodem 才可以使用
    webShh = await webSocket('/devopsCore/logsreal', data, 'devops');
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
  // 保持日志心跳
  const longEtcdstart = () => {
    //1、通过关闭定时器和倒计时进行重置心跳
    clearInterval(timeoutObjEtcd);
    clearTimeout(serverTimeoutObjEtcd);
    // 2、每隔30s向后端发送一条商议好的数据
    timeoutObjEtcd = setInterval(() => {
      if (webShh?.readyState === 1) {
        webShh.send('ping');
      } else {
        // webShhRefresh?.readyState != 1 连接异常 重新建立连接
        setEtcdWebShh()
      }
    }, 3000);
  };

  // 发送请求etcd日志
  const setEtcdWebShh = async () => {
    const data = {
      env: history?.location?.query?.env,
      sname: 'devopsCore'
    }
    // 必须设置格式为arraybuffer，zmodem 才可以使用
    webShhEtcd = await webSocket('/devopsCore/logsreal', data, 'etcd');
    webShhEtcd.onopen = (res: any) => {
      longEtcdstart();
    };
    // 回调
    webShhEtcd.onmessage = function (recv: any) {
      if (typeof (recv.data) === 'string') {
        if (recv.data == 'pong' || recv.data == 'null') {
          return
        }
        etcd_data += (recv.data + '<br/>');
        setEtcdCodeLog(etcd_data)
      } else {
        // zsentry.consume(recv.data);
      }
    };
    // 报错
    webShhEtcd.onerror = function () {
      webShhEtcd?.close();
      webShhEtcd = null;
    }
  };
  // 刷新
  const refresh = () => {
    if (!webShhRefresh) {
      message.error('网络连接错误,请稍后再试...')
      return
    }
    setRefreshTopText('')
    setRefreshBotText('')
    setServiceStep(1)
    setIsDone(true)
    // webShhRefresh.send('refresh');
    console.log(formObj.getFieldValue('version'))
    debugger
    webShhRefresh.send('refresh??' + formObj.getFieldValue('version'))
  }
  // 应用
  const onFinish = async (value) => {
    setApplyStep(1)
    setApplyIsDone(true)
    setApplyBotText('')
    isShowModal(false)
    webShhApply.send('apply??' + value.desc)
  }
  // 修订版本
  const onFinish1 = async (value) => {
    const params = {
      organize: record1.organize,
      env: history?.location?.query?.env,
      branch: value.branch.value,
      revision: value.revision,
      vclosed: value.vclosed == 1 ? 'yes' : 'no',
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
      env: history?.location?.query?.env,
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
      env: history?.location?.query?.env,
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
      env: history?.location?.query?.env,
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
  // 创建版本
  const onFinish9 = async (value: any) => {
    if(value == 'SUCCESS'){
      getVersionList()
      getVersionSelectList()
      isShowModal9(false)
    }
  }
  // 合并分支
  const onFinish10 = async (value: any) => {
    const params = {
      organize: history?.location?.query?.organize,
      revision: value.revision
    }
    const { status, msg } = await getMergeVersionAPI(params)
    if (status === 0) {
      message.success('合并分支成功')
    } else {
      message.error(msg)
    }
  }
  // 获取apply执行结果
  const getApplyResult = async (branch) => {
    const params = {
      env: history?.location?.query?.env,
      organize: history?.location?.query?.organize,
      branch,
    }
    const { data } = await getFinishedLastugpAPI(params)
    setInfoDetail(data)
  }
  useEffect(() => {
    // setWebShh()
    // if (history?.location?.query?.env != 'Dev') {
    //   setEtcdWebShh()
    // }
    setWebShhApply()
    setWebShhRefresh()

    getVersionList()

    return () => {
      clearInterval(timeoutObj);
      clearTimeout(serverTimeoutObj);
      clearInterval(timeoutObjApply);
      clearTimeout(serverTimeoutObjApply);
      clearInterval(timeoutObjRefresh);
      clearTimeout(serverTimeoutObjRefresh);
      clearInterval(timeoutObjEtcd);
      clearTimeout(serverTimeoutObjEtcd);
      if (webShh) {
        webShh.close();
      }
      if (webShhApply) {
        webShhApply.close();
      }
      if (webShhRefresh) {
        webShhRefresh.close();
      }
      if (webShhEtcd) {
        webShhEtcd.close();
      }
    }
  }, [])
  let befortop = 0
  let beforetcdtop = 0

  // 获取service列表
  const getServiceList = async (branch) => {
    const params = {
      env: history?.location?.query?.env,
      branch,
      organize: history?.location?.query?.organize,
    }
    const { data: { items } } = await getOpServiceListAPI(params)
    setServiceList(items)
  }
  // 获取version列表
  const getVersionList = async () => {
    const params = {
      env: history?.location?.query?.env,
      organize: history?.location?.query?.organize,
      // organize: 'gkzyrent',
    }
    const { data: { items } } = await getOpVersionListAPI(params)
    setVersionList(items)
  }
  // 清屏
  const clearLog = (type) => {
    if (type == 'devopsCore') {
      data_ = ''
      setCodeLog('')
    } else {
      etcd_data = ''
      setEtcdCodeLog('')
    }
  }

  const isScrollAtBottom = (container) => {
    if (!container) {
      return
    }
    return container.scrollHeight - container.scrollTop === container.clientHeight;
  }
  useEffect(() => {
    const div = document.getElementById('log-content')
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
    const div = document.getElementById('log-etcd-content')
    window.addEventListener('scroll', () => {
      if (isScrollAtBottom(div)) {
        setIsEtcdScroll(false)
      } else {
        const aftertop = div?.scrollTop;//兼容
        if (aftertop - befortop > 0) {
          setIsEtcdScroll(true)
        } else {
          setIsEtcdScroll(true)
        }
        befortop = aftertop;
      }
    }, true)
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        setIsEtcdScroll(false)
      }
    })
    if (div && !isEtcdScroll) {
      div.scrollTop = div.scrollHeight
    }
  }, [etcdCodeLog])

  const columnsTest = [
    {
      title: '服务名称',
      dataIndex: 'sname',
      align: 'center',
      key: 'sname',
    },
    {
      title: 'API端口号',
      dataIndex: 'apiport',
      align: 'center',
      key: 'apiport',
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
      title: '镜像构建时间',
      dataIndex: 'imagebuildtime',
      align: 'center',
      key: 'imagebuildtime',
    },
    {
      title: '镜像更新时间',
      dataIndex: 'imageapplytime',
      align: 'center',
      key: 'imageapplytime',
    },
    {
      title: 'Sql升级时间',
      dataIndex: 'sqltime',
      align: 'center',
      key: 'sqltime',
    },
    {
      title: '持续运行时间',
      dataIndex: 'createtime',
      align: 'center',
      key: 'createtime',
      width: 170,
    },
    {
      title: '操作',
      align: 'center',
      width: 180,
      render: (_, row: any) => (
        <Space>
          <a onClick={() => { isShowModal2(true, row) }}>log</a>
          <a onClick={() => { isShowModal3(true, row) }}>config</a>
          {
            row.sname == 'httpCore' && <a onClick={() => { isShowModal8(true, row) }}>expuri</a>
          }
          <a onClick={() => { isShowModal4(true, row) }}>envs</a>
        </Space>
      ),
    },
  ];
  const columnsDev = [
    {
      title: '服务名称',
      dataIndex: 'sname',
      align: 'center',
      key: 'sname',
    },
    {
      title: 'API端口号',
      dataIndex: 'apiport',
      align: 'center',
      key: 'apiport',
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
      title: 'git地址',
      dataIndex: 'gitrepo',
      align: 'center',
      key: 'gitrepo',
      hideInTable: history?.location?.query?.env != 'Dev',
    },
    {
      title: 'Sql升级时间',
      dataIndex: 'sqltime',
      align: 'center',
      key: 'sqltime',
    },
    {
      title: '持续运行时间',
      dataIndex: 'createtime',
      align: 'center',
      key: 'createtime',
      width: 170,
    },
    {
      title: '操作',
      align: 'center',
      width: 180,
      render: (_, row: any) => (
        <Space>
          <a onClick={() => { isShowModal2(true, row) }}>log</a>
          <a onClick={() => { isShowModal3(true, row) }}>config</a>
          {
            row.sname == 'httpCore' && <a onClick={() => { isShowModal8(true, row) }}>expuri</a>
          }
          <a onClick={() => { isShowModal4(true, row) }}>envs</a>
        </Space>
      ),
    },
  ];
  const columnsProd = [
    {
      title: '服务名称',
      dataIndex: 'sname',
      align: 'center',
      key: 'sname',
    },
    {
      title: 'API端口号',
      dataIndex: 'apiport',
      align: 'center',
      key: 'apiport',
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
      title: '镜像更新时间',
      dataIndex: 'imageapplytime',
      align: 'center',
      key: 'imageapplytime',
    },
    {
      title: 'Sql升级时间',
      dataIndex: 'sqltime',
      align: 'center',
      key: 'sqltime',
    },
    {
      title: '持续运行时间',
      dataIndex: 'createtime',
      align: 'center',
      key: 'createtime',
      width: 170,
    },
    {
      title: '操作',
      align: 'center',
      width: 180,
      render: (_, row: any) => (
        <Space>
          <a onClick={() => { isShowModal2(true, row) }}>log</a>
          <a onClick={() => { isShowModal3(true, row) }}>config</a>
          {
            row.sname == 'httpCore' && <a onClick={() => { isShowModal8(true, row) }}>expuri</a>
          }
          <a onClick={() => { isShowModal4(true, row) }}>envs</a>
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      hideInSearch: true,
      align: 'center',
      render: (_, record) => record.status == 'doing' ? '进行中' : record.status == 'done' ? '已完成' : '--',
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
  //获取版本列表
  const getVersionSelectList = async () => {
    const array: { label: any; value: any }[] = [];
    const params = {
      env: history?.location?.query?.env,
      organize: history?.location?.query?.organize,
      // organize: 'gkzyrent',
    }
    const {
      data: { items },
      status,
    } = await getVersionListAPI(params);
    if (status === 0) {
      getServiceList(items[0])
      getApplyResult(items[0])
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
  return (
    <div className='page-container'>
      <EtdcHeader />
      <div className='page-wrap'>
        <div className='version-list'>
          <div className='tables-titles'>
            <div>Version</div>
            <div><Space>
              <Button type="primary" onClick={() => {
                isShowModal9(true)
              }}>创建版本</Button>
              {/* <Button type="primary" onClick={() => {
                isShowModal10(true)
              }}>合并分支</Button> */}
              <Button type="primary" onClick={() => {
                isShowModal1(true)
              }}>修订版本</Button></Space></div>
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
        <div className='service-list'>
          <div className='tables-titles'>
            <div>Service</div>
            <div className='version-info'>
              <div>项目名称: {history?.location?.query?.organize}</div>
              <div>版本号: {history?.location?.query?.branch}</div>
              <div>环境:{history?.location?.query?.env}</div>
            </div>
          </div>
          <div>
            <Table
              rowKey={(record) => record.id}
              rowClassName={(_, index) => (index % 2 == 1 ? 'rowBgColor' : '')}
              dataSource={serviceList}
              pagination={false}
              columns={history?.location?.query?.env == 'Dev' ? columnsDev : history?.location?.query?.env == 'Test' ? columnsTest : history?.location?.query?.env == 'Prod' ? columnsProd : columnsDev}
            />
          </div>
        </div>

        <div className='opration-refresh'>
          <div className='opration-refresh-title'>
            <div className="title-left">
              <Button type="primary" disabled={!formObj.getFieldValue('version')} loading={applyIsDone || isDone} onClick={() => {
                refresh()
              }}>{(applyIsDone || isDone) ? 'waiting...' : 'Refresh'}</Button>
              <ProForm form={formObj} submitter={false}>
                <ProFormSelect
                  allowClear={false}
                  label=""
                  name="version"
                  width="sm"
                  request={() => getVersionSelectList()}
                  placeholder="请选择版本号"
                  fieldProps={{
                    onChange: (e) => {
                      // setUserType(e)
                      console.log(e)
                      setBranch(e.value)
                      getServiceList(e.value)
                      formObj.setFieldsValue({
                        version: e.value
                      })
                    },
                    labelInValue: true
                  }}
                />
              </ProForm>

            </div>
            <div className='opration-refresh-step'>
              <div style={{ color: serviceStep == 1 ? '#11BBAA' : '' }}>Start</div>
              <div><img src={long_arrow} alt="" /></div>
              <div style={{ color: serviceStep == 2 ? '#11BBAA' : '' }}>Repo Sync</div>
              <div><img src={long_arrow} alt="" /></div>
              <div style={{ color: serviceStep == 3 ? '#11BBAA' : '' }}>Project Scan</div>
              <div><img src={long_arrow} alt="" /></div>
              <div style={{ color: serviceStep == 4 ? '#11BBAA' : '' }}>Web Depoly</div>
              <div><img src={long_arrow} alt="" /></div>
              <div style={{ color: serviceStep == 5 ? '#11BBAA' : '' }}>End</div>
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
            <div className='opration-apply-title-left'>
              <Button type="primary" loading={applyIsDone || isDone} onClick={() => {
                isShowModal(true)
              }}>{(applyIsDone || isDone) ? 'waiting...' : 'Apply'}</Button>
              <div className='apply-branch'>{branch}</div>
            </div>
            {
              history?.location?.query?.env == 'Dev' ? <div className='opration-apply-step'>
                <div style={{ color: applyStep == 1 ? '#11BBAA' : '' }}>Start</div>
                <div><img src={long_arrow} alt="" /></div>
                <div style={{ color: applyStep == 2 ? '#11BBAA' : '' }}>Bootup</div>
                <div><img src={long_arrow} alt="" /></div>
                <div style={{ color: applyStep == 3 ? '#11BBAA' : '' }}>Sql gen</div>
                <div><img src={long_arrow} alt="" /></div>
                <div style={{ color: applyStep == 4 ? '#11BBAA' : '' }}>Sql confirm</div>
                <div><img src={long_arrow} alt="" /></div>
                <div style={{ color: applyStep == 5 ? '#11BBAA' : '' }}>End</div>
              </div> : history?.location?.query?.env == 'Test' ? <div className='opration-apply-step'>
                <div style={{ color: applyStep == 1 ? '#11BBAA' : '' }}>Start</div>
                <div><img src={long_arrow} alt="" /></div>
                <div style={{ color: applyStep == 2 ? '#11BBAA' : '' }}>Docker Build</div>
                <div><img src={long_arrow} alt="" /></div>
                <div style={{ color: applyStep == 3 ? '#11BBAA' : '' }}>Etcd Upgrade</div>
                <div><img src={long_arrow} alt="" /></div>
                <div style={{ color: applyStep == 4 ? '#11BBAA' : '' }}>Sql Gen</div>
                <div><img src={long_arrow} alt="" /></div>
                <div style={{ color: applyStep == 5 ? '#11BBAA' : '' }}>Sql Confirm</div>
                <div><img src={long_arrow} alt="" /></div>
                <div style={{ color: applyStep == 6 ? '#11BBAA' : '' }}>End</div>
              </div> : history?.location?.query?.env == 'Prod' ? <div className='opration-apply-step'>
                <div style={{ color: applyStep == 1 ? '#11BBAA' : '' }}>Start</div>
                <div><img src={long_arrow} alt="" /></div>
                <div style={{ color: applyStep == 2 ? '#11BBAA' : '' }}>Etcd Upgrade</div>
                <div><img src={long_arrow} alt="" /></div>
                <div style={{ color: applyStep == 3 ? '#11BBAA' : '' }}>Sql Gen</div>
                <div><img src={long_arrow} alt="" /></div>
                <div style={{ color: applyStep == 4 ? '#11BBAA' : '' }}>Sql Confirm</div>
                <div><img src={long_arrow} alt="" /></div>
                <div style={{ color: applyStep == 5 ? '#11BBAA' : '' }}>End</div>
              </div> : ''
            }

          </div>
          <div className='opration-apply-content'>

            <div className='apply-log-box'>
              {
                infoDetail.stsd != null && <>
                  <div>上次执行结果:</div>
                  <div>时间: {moment(infoDetail.stsd * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
                  <div>标题: {infoDetail.info}</div>
                  <div>执行结果: {infoDetail.success == 'yes' ? '成功' : '失败'}</div>
                  {
                    infoDetail.success != 'yes' && <div>失败原因: {infoDetail.error}</div>
                  }
                </>
              }
            </div>
            <div className='apply-line-box'>
              {
                <div id='refresh-content' style={{ fontFamily: detectOS() == 'Mac' ? 'monospace' : 'cursive', overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: applyBotText }}></div>
              }
            </div>
          </div>
        </div>
        {/* <div className='log-content'>
          <div className='log-titles'>
            <div>devopsCore日志</div>
          </div>
          <div className='log-content-box'>
            {
              <div id='log-content' style={{ fontFamily: detectOS() == 'Mac' ? 'monospace' : 'cursive', height: '600px', overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: codeLog }}></div>
            }
          </div>
          <div className='log-clear' onClick={() => {
            clearLog('devopsCore')
          }}>
            <div> clear </div>
          </div>
        </div> */}
        {/* {
          history?.location?.query?.env != 'Dev' && <div className='log-content'>
            <div className='log-titles'>
              <div>etcd日志</div>
            </div>
            <div className='log-content-box'>
              {
                <div id='log-etcd-content' style={{ fontFamily: detectOS() == 'Mac' ? 'monospace' : 'cursive', height: '600px', overflowY: 'auto' }} dangerouslySetInnerHTML={{ __html: etcdCodeLog }}></div>
              }
            </div>
            <div className='log-clear' onClick={() => {
              clearLog('etcd')
            }}>
              <div> clear </div>
            </div>
          </div>
        } */}

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
      {!visible9 ? (
        ''
      ) : (
        <AddVersionModal
          visible={visible9}
          isShowModal={isShowModal9}
          record={record9}
          onFinish={onFinish9}
          branch={history?.location?.query?.branch}
        />
      )}
      {!visible10 ? (
        ''
      ) : (
        <MergeModal
          visible={visible10}
          isShowModal={isShowModal10}
          record={record10}
          onFinish={onFinish10}
          branch={history?.location?.query?.branch}
        />
      )}
    </div>
  );
};
export default Index;
