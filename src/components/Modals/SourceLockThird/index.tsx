import React, { useRef, useState } from 'react';
import { Button, Modal, Select, Space } from 'antd';
import ProTable from '@ant-design/pro-table';
import request from 'umi-request';

type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
};
const SourceLockThirdModal = (prop: {
  visible: any;
  onThirdOk: any;
  onCancel: any;
  columns: any;
  num: any;
}) => {
  const { visible, onThirdOk, onCancel, columns, num } = prop;
  const actionRef = useRef();

  return (
    <Modal
      title={num}
      width="955px"
      bodyStyle={{
        padding: 0,
      }}
      visible={visible}
      onOk={onThirdOk}
      onCancel={onCancel}
      // footer={null}
    >
      <ProTable<GithubIssueItem>
        bordered
        columns={columns}
        actionRef={actionRef}
        request={async (params = {}, sort, filter) => {
          return request<{
            data: GithubIssueItem[];
          }>('https://proapi.azurewebsites.net/github/issues', {
            params,
          });
        }}
        search={false}
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
        options={false}
        dateFormatter="string"
        rowSelection={{}}
        tableAlertRender={({
          selectedRowKeys,
          selectedRows,
          onCleanSelected,
        }) => (
          <Space size={24}>
            <span>
              已选 {selectedRowKeys.length} 项
              <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                取消选择
              </a>
            </span>
            <span>{`调用量: ${selectedRows.reduce(
              (pre, item) => pre + item.number,
              0,
            )} 次`}</span>
          </Space>
        )}
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <a>批量删除</a>
              <a>导出数据</a>
            </Space>
          );
        }}
      />
    </Modal>
  );
};

export default SourceLockThirdModal;
