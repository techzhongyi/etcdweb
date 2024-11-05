import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Card } from 'antd';
import './index.less'
import { getServiceListAPI } from '@/services/comservice';
import { getStorage } from '@/utils/storage';
import { getLogsinfluxListAPI } from '@/services/log';
import eventBus from '@/utils/eventBus';
const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef();
  const [pageSize, setPageSize] = useState<number>(10);
  const [servicesList, setServicesList] = useState([])
  const [activeIndex, setActiveIndex] = useState('')
  const [sname, setSname] = useState('')
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
      title: '时间',
      key: 'logtime',
      dataIndex: 'logtime',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '内容',
      align: 'center',
      dataIndex: 'msg',
      key: 'msg',
      hideInSearch: true,
    },
    {
      title: 'NODE',
      align: 'center',
      dataIndex: 'node',
      key: 'node',
      ellipsis: true,
    },
    {
      title: 'LEVEL',
      align: 'center',
      dataIndex: 'level',
      key: 'level',
      ellipsis: true,
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
  // 获取列表
  const getList = async (params: any, sname: string) => {
    const param = {
      page: params.current,
      count: params.pageSize,
      sname,
      env: getStorage('env'),
      organize: getStorage('organize'),
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
  const getServiceList = async (env) => {
    const param = {
      env: env ? env : getStorage('env'),
      organize: getStorage('organize')
    }
    console.log(env)
    const { data: { items } } = await getServiceListAPI(param)
    setServicesList(items)
  }
  const handleEvent = (env) => {
    setActiveIndex('')
    setSname('')
    getServiceList(env)
    formRef?.current?.submit();
  }
  useEffect(() => {
    getServiceList(getStorage('env'))
    eventBus.on('envChange', (env) => { handleEvent(env) });
    return () => {
      eventBus.off('envChange', handleEvent);
    }
  }, [])
  const selectSevices = (e) => {
    setActiveIndex(e)
    setSname(e)
    getList({ current: 1, pageSize: 10 }, e)
    formRef?.current?.submit();
  }
  return (
    <PageContainer
      ghost
      header={{
        title: ' ',
        breadcrumb: {},
      }}
    >
      <Card>
        <div className='logs-content'>
          <div className='log-list-select'>
            <div className='log-content-title'>微服务列表</div>
            <div className='log-item-list'>
              {
                servicesList.map(item => {
                  return (
                    <div className={activeIndex === item ? 'item-active' : ''} onClick={() => {
                      selectSevices(item)
                    }}>{item}</div>
                  )
                })
              }
            </div>

          </div>
          <div className='log-select-content'>
          <ProTable<any>
            bordered
            columns={columns}
            actionRef={actionRef}
            formRef={formRef}
            request={(params) => getList(params, sname)}
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
