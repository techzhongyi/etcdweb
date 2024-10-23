import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Card, Select } from 'antd';
import './index.less'

const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState<number>(10);
  const serviceChange = (e) => {

  }
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
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '内容',
      align: 'center',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'NODE',
      align: 'center',
      dataIndex: 'depart_name',
      key: 'depart_name',
      ellipsis: true,
    },
    {
      title: 'LEVEL',
      align: 'center',
      dataIndex: 'depart_name',
      key: 'depart_name',
      ellipsis: true,
    },
  ];
  // 获取列表
  const getList = async (params: any) => {
    const param = {
      skip_root: 0,
      $tableLimit: {
        page: params.current,
        count: params.pageSize,
      },
      $tableSearch: [
        {
          field: 'phone',
          value: params.phone ? params.phone : '__ignore__',
          op: 7,
        },
      ],
      $tableSort: [],
    };
    // const {
    //   data: { list, total },
    //   status,
    // } = await getAccountList(param);
    // return {
    //   data: list,
    //   total: total,
    //   success: status === 0,
    // };
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
        <div className='log-content'>
          <div className='log-list-select'>
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
            <div className='log-item-list'>
              <div>hcore</div>
              <div>pcore</div>
              <div>user</div>
              <div>assets</div>
            </div>

          </div>
          <div className='log-select-content'>
            <ProTable<any>
              bordered
              columns={columns}
              actionRef={actionRef}
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
