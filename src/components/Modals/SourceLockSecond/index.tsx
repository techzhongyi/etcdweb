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
const SourceLockedSecondModal = (prop: {
  visible: any;
  onCancel: any;
  columns: any;
  num: any;
}) => {
  const { visible, onCancel, columns, num } = prop;
  const actionRef = useRef();

  return (
    <Modal
      title={num}
      width="955px"
      bodyStyle={{
        padding: 0,
      }}
      visible={visible}
      onCancel={onCancel}
      footer={null}
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
        options={false}
        pagination={false}
        dateFormatter="string"
      />
    </Modal>
  );
};

export default SourceLockedSecondModal;
