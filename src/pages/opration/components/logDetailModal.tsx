import React, { useEffect, useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Modal, Button } from 'antd';
import './index.less'
import { getServiceListAPI } from '@/services/comservice';
import { getStorage } from '@/utils/storage';
import { getLogsinfluxListAPI } from '@/services/log';
const LogDetailModal: React.FC<any> = (props: any) => {
  const { visible, isShowModal, record } = props;
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
  const onModealCancel = () => {
    isShowModal(false);
  };
  // 获取列表
  const getList = async (params: any, name) => {
    const param = {
      page: params.current,
      count: params.pageSize,
      sname: name,
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
  const getServiceList = async () => {
    const param = {
      env: record.env,
      organize: record.organize
    }
    const { data: { items } } = await getServiceListAPI(param)
    setServicesList(items)
  }
  useEffect(() => {
    getServiceList()
  }, [])
  const selectSevices = (e) => {
    setActiveIndex(e)
    setSname(e)
    getList({ current: 1, pageSize: 10 }, e)
    formRef?.current?.submit();
  }
  return (
    <Modal
      title='日志'
      width={1280}
      footer={[
        <Button key="back" onClick={onModealCancel}>
          关闭
        </Button>,
      ]}
      open={visible}
      maskClosable={false}
      onCancel={onModealCancel}
      destroyOnClose={true}
    >
      <div className='logs-content'>
        <div className='log-list-select'>
          <div className='log-content-title'>微服务列表</div>
          <div className='log-item-list'>
            {
              servicesList.map(item => {
                return (
                  <div className={activeIndex === item.id ? 'item-active' : ''} onClick={() => {
                    selectSevices(item.id)
                  }}>{item.value}</div>
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
    </Modal>
  );
};
export default LogDetailModal;
