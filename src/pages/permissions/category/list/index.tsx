import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm } from 'antd';
import CategoryAddOrEditModal from '../components/addOrEditModal';
import { categoryItemType } from '../../data';
import {
  addCategory,
  deleteCategory,
  editCategory,
  getCategoryList,
} from '@/services/permissions/category';

const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [visible, setVisible] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | undefined>(undefined);
  const [record, setRecord] = useState<categoryItemType | undefined>(undefined);

  // 新增 编辑 关闭Modal
  const isShowModal = (show: boolean, row?: categoryItemType, id?: string) => {
    setVisible(show);
    setEditId(id);
    setRecord(row);
  };

  // 提交
  const onFinish = async (value: any) => {
    if (editId === undefined) {
      const { status, msg } = await addCategory(value);
      if (status === 0) {
        message.success('添加成功');
        // 刷新列表数据
        actionRef.current?.reload();
        isShowModal(false);
      } else {
        message.warn(msg);
      }
    } else {
      const { status, msg } = await editCategory({ ...value, id: editId });
      if (status === 0) {
        message.success('修改成功');
        // 刷新列表数据
        actionRef.current?.reload();
        isShowModal(false);
      } else {
        message.warn(msg);
      }
    }
  };
  const columns: ProColumns<categoryItemType>[] = [
    {
      title: '序号',
      key: 'index',
      align: 'center',
      dataIndex: 'index',
      hideInSearch: true,
      valueType: 'index',
      width: 60,
    },
    {
      title: '类别名称',
      key: 'type',
      align: 'center',
      dataIndex: 'type',
      valueType: 'select',
      hideInSearch: true,
      valueEnum: {
        '1': { text: '重卡' },
        '2': { text: '轻卡' },
        '3': { text: 'van车' },
        '4': { text: '车厢' },
        '5': { text: '挂车' },
      },
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      align: 'center',
      key: 'brand',
    },
    {
      title: '车型',
      dataIndex: 'model',
      align: 'center',
      key: 'model',
    },
    {
      title: '尺寸',
      dataIndex: 'size',
      align: 'center',
      key: 'size',
      hideInSearch: true,
    },
    {
      title: '电池品牌',
      key: 'battery_type',
      align: 'center',
      dataIndex: 'battery_type',
      valueType: 'select',
      hideInSearch: true,
      valueEnum: {
        '1': { text: '宁德时代' },
        '2': { text: '国轩动力电池41.93度' },
        '3': { text: '宁德时代100.41度' },
        '4': { text: '亿纬锂能' },
      },
    },
    {
      title: '厂标续航(KM)',
      align: 'center',
      dataIndex: 'battery_life',
      key: 'battery_life',
      hideInSearch: true,
    },
    {
      title: '载货立方',
      align: 'center',
      dataIndex: 'cube',
      key: 'cube',
    },
    {
      title: '后回转半径',
      dataIndex: 'back_turn_redius',
      align: 'center',
      key: 'back_turn_redius',
      hideInSearch: true,
    },
    {
      title: '鞍座高度',
      dataIndex: 'seat_high',
      align: 'center',
      key: 'seat_high',
      hideInSearch: true,
    },
    {
      title: '牵引销',
      dataIndex: 'pull_pin',
      align: 'center',
      key: 'pull_pin',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      align: 'center',
      fixed: 'right',
      render: (text, record_: categoryItemType) => {
        return [
          <a
            onClick={() => {
              isShowModal(true, record_, record_.id);
            }}
          >
            编辑
          </a>,
          <Popconfirm
            onConfirm={async () => {
              const { status, msg } = await deleteCategory({
                id: record_?.id,
              });
              if (status === 0) {
                message.success('删除成功');
                actionRef.current?.reload();
              } else {
                message.error(msg);
              }
            }}
            key="popconfirm"
            title="删除后不可恢复，确认删除吗?"
            okText="是"
            cancelText="否"
          >
            <a>删除</a>
          </Popconfirm>,
        ];
      },
    },
  ];
  // 获取分类列表
  const getList = async (params: any) => {
    const param = {
      skip_root: 0,
      $tableLimit: {
        page: params.current,
        count: params.pageSize,
      },
      $tableSearch: [
        {
          field: 'brand',
          value: params.brand ? params.brand : '__ignore__',
          op: 7,
        },
        {
          field: 'model',
          value: params.model ? params.model : '__ignore__',
          op: 7,
        },
        {
          field: 'cube',
          value: params.cube ? params.cube : '__ignore__',
          op: 7,
        },
      ],
      $tableSort: [],
    };
    const {
      data: { list, total },
      status,
    } = await getCategoryList(param);
    return {
      data: list,
      total,
      success: status === 0,
    };
  };
  return (
    <PageContainer
      ghost
      header={{
        title: ' ',
        breadcrumb: {},
      }}
    >
      <ProTable<categoryItemType>
        bordered
        columns={columns}
        actionRef={actionRef}
        request={(params) => getList(params)}
        editable={{
          type: 'multiple',
        }}
        scroll={{ x: 1600 }}
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
        headerTitle="类别列表"
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              isShowModal(true);
            }}
          >
            新增
          </Button>,
          // <Button>
          //     导出
          // </Button>,
        ]}
      />
      {!visible ? (
        ''
      ) : (
        <CategoryAddOrEditModal
          visible={visible}
          isShowModal={isShowModal}
          onFinish={onFinish}
          record={record}
          editId={editId}
        />
      )}
    </PageContainer>
  );
};
export default Index;
