import React, { useEffect, useRef, useState } from 'react';
import { Button, List, message, Popconfirm, Space, Spin, Tabs } from 'antd';
import './index.less'
import logo from '../../../public/icons/new_logo.png';
import user_icon from '../../../public/icons/user_icon.png';
import { clearAllStorage } from '@/utils/storage';
import { getLogsContextListAPI, getLogsLokiListAPI } from '@/services/log';
import { history, useModel } from 'umi';
import { ProForm, ProFormDateTimeRangePicker, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { LogoutOutlined } from '@ant-design/icons';
import { getOpServiceListAPI } from '@/services/opration';
import LogDetailModal from './components/logDetail';
import HistoryLogDetailModal from './components/historyLogDetail';
import HistorySearchlModal from './components/historySearch';
const Index: React.FC = () => {
  const childRef = useRef(null);
  const childHistoryRef = useRef(null);
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  const [formObj] = ProForm.useForm();
  const [formObj1] = ProForm.useForm();
  const [activeKey, setActiveKey] = useState(history?.location?.query?.sname);
  const [activeHistoryKey, setActiveHistoryKey] = useState(history?.location?.query?.sname);
  const [activeRadioKey, setActiveRadioKey] = useState(1);
  const [items, setItems] = useState([]);
  const [historyItems, setHistoryItems] = useState([]);
  const [itemsRadio, setItemsRadio] = useState([
    {
      label: '实时日志', key: 1
    },
    {
      label: '历史日志', key: 2
    },
  ]);
  // 退出登录
  const logout = () => {
    message.success('退出成功');
    setInitialState((s) => ({ ...s, currentUser: undefined }));
    clearAllStorage();
    history.replace({
      pathname: '/user/login',
    })
  }
  const goHome = () => {
    history.goBack()
  }
  //获取服务列表
  const getOpServiceSelectList = async () => {
    const array: { label: any; value: any }[] = [];
    const params = {
      env: history?.location?.query?.env,
      branch: history?.location?.query?.branch,
      organize: history?.location?.query?.organize,
    }
    const {
      data: { items },
      status,
    } = await getOpServiceListAPI(params);
    if (status === 0) {
      items?.map((item: any) => {
        array.push({ label: item.sname, value: item.sname });
      });
      return array;
    } else {
      return [];
    }
  };
  const onRadioChange = (key: string) => {
    setActiveRadioKey(key);
  }
  const onChange = (key: string) => {
    setActiveKey(key);
  };
  const onHistoryChange = (key: string) => {
    setActiveHistoryKey(key);
  };

  const remove = (targetKey: string) => {
    const targetIndex = items.findIndex(pane => pane.key === targetKey);
    const newPanes = items.filter(pane => pane.key !== targetKey);
    if (newPanes.length && targetKey === activeKey) {
      const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
      setActiveKey(key);
    }
    formObj.setFieldsValue({
      service: newPanes.map(item => item.key)
    })

    setItems(newPanes);
  };
  const removeHistory = (targetKey: string) => {
    const targetIndex = historyItems.findIndex(pane => pane.key === targetKey);
    const newPanes = historyItems.filter(pane => pane.key !== targetKey);
    if (newPanes.length && targetKey === activeHistoryKey) {
      const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
      setActiveHistoryKey(key);
    }
    formObj1.setFieldsValue({
      service: newPanes.map(item => item.key)
    })
    setHistoryItems(newPanes);
  };
  const onEdit = (targetKey: string, action: 'add' | 'remove') => {
    remove(targetKey);
  };
  const onEditHistory = (targetKey: string, action: 'add' | 'remove') => {
    removeHistory(targetKey);
  };
  useEffect(() => {
    if (history?.location?.query?.sname) {
      formObj.setFieldsValue({
        service: [history?.location?.query?.sname]
      })
      formObj1.setFieldsValue({
        service: [history?.location?.query?.sname]
      })
      const arr = [
        {
          label: history?.location?.query?.sname,
          key: history?.location?.query?.sname
        }
      ]
      setItems(arr)
      setActiveKey(arr[0].key)
      setHistoryItems(arr)
      setActiveHistoryKey(arr[0].key)
    }
  }, [history?.location?.query?.sname])
  // 实时日志查询
  const onFinishReal = (value) => {
    if (childRef.current) {
      childRef.current.search(value); // 调用子组件的方法
    }
  }

  return (
    <div className='page-container'>
      <div className='page-header'>
        <div className='page-header-logo' onClick={() => { goHome() }}>
          <img src={logo} alt="" />
        </div>
        <div className='page-header-title'>{history?.location?.query?.organize}({history?.location?.query?.env})</div>
        <div className='page-header-action'>
          <div>
            <div className='user-branch'>
              {

                activeRadioKey == 1 && <ProForm form={formObj} submitter={false}><ProFormSelect
                  allowClear={false}
                  label=""
                  name="service"
                  request={() => getOpServiceSelectList()}
                  placeholder="请选择服务"
                  fieldProps={{
                    onChange: (e) => {
                      console.log(e)
                      if (e.length == 0) {
                        return
                      }
                      const array2 = []
                      e?.map((item: any) => {
                        array2.push({ label: item, key: item });
                      });
                      setItems(array2)
                      if(array2.length>0){
                        setActiveKey(array2[array2.length-1].key)
                      }
                    },
                    mode: 'multiple',
                  }}
                />
                </ProForm>
              }
              {
                activeRadioKey == 2 && <ProForm form={formObj1} submitter={false}><ProFormSelect
                  allowClear={false}
                  label=""
                  name="service"
                  request={() => getOpServiceSelectList()}
                  placeholder="请选择服务"
                  fieldProps={{
                    onChange: (e) => {
                      console.log(e)
                      if (e.length == 0) {
                        return
                      }

                      const array2 = []
                      e?.map((item: any) => {
                        array2.push({ label: item, key: item });
                      });
                      setHistoryItems(array2)
                      if(array2.length>0){
                        setActiveHistoryKey(array2[array2.length-1].key)
                      }
                    },
                    mode: 'multiple',
                  }}
                />
                </ProForm>
              }


            </div>
            <div className='user-icon'><img src={user_icon} alt="" /></div>
            <div className='user-name'>{currentUser.name}</div>
          </div>
          <div>
            <Popconfirm
              onConfirm={() => { logout() }}
              key="popconfirm"
              title="确认退出登录?"
              okText="是"
              cancelText="否"
            >
              <LogoutOutlined style={{ fontSize: '22px' }} />
            </Popconfirm>
          </div>
        </div>
      </div>
      <div className='page-wrap'>
        <div className='log-content'>
          <div className='log-content-left'>
            <div className=''>
              <Tabs
                onChange={onRadioChange}
                activeKey={activeRadioKey}
                items={itemsRadio}
              />
            </div>
            {
              activeRadioKey == 1 && <div className='real-time-log'>
                <ProForm
                  submitter={{
                    render: (props_) => (
                      <div style={{ textAlign: 'right' }}>
                        <Space>
                          <Button
                            type="primary"
                            key="submit"
                            onClick={() => props_.form?.submit?.()}
                          >
                            查询
                          </Button>
                        </Space>
                      </div>
                    ),
                  }}
                  onFinish={onFinishReal}
                  form={formObj}
                >
                  <ProFormText
                    width="md"
                    name="key1"
                    label="关键词1"
                    fieldProps={{
                      maxLength: 29,
                    }}
                    placeholder="请输入关键词"
                  />
                  <ProFormText
                    width="md"
                    name="key2"
                    label="关键词2"
                    fieldProps={{
                      maxLength: 29,
                    }}
                    placeholder="请输入关键词"
                  />
                  <ProFormText
                    width="md"
                    name="key3"
                    label="关键词3"
                    fieldProps={{
                      maxLength: 29,
                    }}
                    placeholder="请输入关键词"
                  />
                </ProForm>
              </div>
            }
            {
              activeRadioKey == 2 && <div className='history-log'>
                {
                  historyItems.map(item => {
                    return (
                      <div key={item.key}>
                        <HistorySearchlModal serviceName={item.key} isActive={activeHistoryKey === item.key} />
                      </div>
                    )
                  })
                }

              </div>
            }
          </div>
          <div className='log-content-right'>
            {
              activeRadioKey == 1 && <Tabs
                hideAdd
                onChange={onChange}
                activeKey={activeKey}
                type="editable-card"
                onEdit={onEdit}
                items={items}
              />
            }
            {
              activeRadioKey == 2 && <Tabs
                hideAdd
                onChange={onHistoryChange}
                activeKey={activeHistoryKey}
                type="editable-card"
                onEdit={onEditHistory}
                items={historyItems}
              />
            }
            {
              activeRadioKey == 1 && <div className='log-detail-content' >
                <div id='log-detail-content'>
                  {
                    items.map(item => {
                      return (
                        <div key={item.key} >
                          <LogDetailModal ref={childRef} serviceName={item.key} isActive={activeKey === item.key} />
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            }
            {
              activeRadioKey == 2 && <div className='log-detail-content' >
                <div id='log-detail-content'>
                  {
                    historyItems.map(item => {
                      return (
                        <div key={item.key}>
                          <HistoryLogDetailModal ref={childHistoryRef} serviceName={activeHistoryKey} isActive={activeHistoryKey === item.key} />
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};
export default Index;
