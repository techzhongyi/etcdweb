import React, { useEffect, useState } from 'react';
import { Button, Modal, Skeleton, Space } from 'antd';
import ProForm, {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { FormValues, configItemType } from '../../data';
// import CodeMirrorEditor from 'CodeMirror';
// import { UnControlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/yonce.css';
// 代码模式，clike是包含java,c++等模式的
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/javascript/javascript'; //js
import 'codemirror/mode/python/python.js'; //python
//代码高亮
import 'codemirror/addon/selection/active-line';

//代码滚动
import 'codemirror/addon/scroll/simplescrollbars.js';
import 'codemirror/addon/scroll/simplescrollbars.css';
import CodeMirrorEditorModal from '@/components/CodeMirror';
interface accountModalType {
  visible: boolean;
  record?: configItemType | undefined;
  editId?: string;
  loading?: boolean;
  isShowModal: (show: boolean, _record?: configItemType, id?: string) => void;
  onFinish: (value: FormValues) => void;
}
const ConfigAddOrEditModal: React.FC<accountModalType> = (props: any) => {
  const [formObj] = ProForm.useForm();
  const {
    visible,
    isShowModal,
    onFinish,
    record,
    editId,
    loading = false,
  } = props;
  const [initialValues, setInitialValues] = useState(undefined);
  const title = editId === undefined ? '创建配置' : '编辑配置';
  const [code, setCode] = useState(`
    import java.util.*;
    import com.alibaba.fastjson.JSON;
    import com.alibaba.fastjson.JSONArray;
    import com.alibaba.fastjson.JSONObject;
    import com.alibaba.fastjson.TypeReference;
    `);
  const typeList = [
    {
      label: 'Docker',
      id: 1,
    },
    {
      label: 'sURi',
      id: 2,
    },
    {
      label: 'sconf',
      id: 3,
    },
    {
      label: 'sqlupgd',
      id: 4,
    },
    {
      label: 'config',
      id: 5,
    },
  ];
  const versionsList = [
    {
      label: 'v1.0',
      id: 1,
    },
  ];
  useEffect(() => {}, []);
  const handleCodeChange = (value: string) => {
    setCode(value);
    console.log(value);
  };

  const onModealCancel = () => {
    isShowModal(false);
  };
  return (
    <Modal
      title={title}
      width={766}
      footer={null}
      open={visible}
      maskClosable={false}
      onCancel={onModealCancel}
      destroyOnClose={true}
    >
      {initialValues === undefined && editId !== undefined ? (
        <Skeleton active={true} paragraph={{ rows: 3 }} />
      ) : (
        <ProForm
          submitter={{
            render: (props_) => (
              <div style={{ textAlign: 'right' }}>
                <Space>
                  <Button onClick={onModealCancel}>取消</Button>
                  <Button
                    type="primary"
                    loading={loading}
                    key="submit"
                    onClick={() => props_.form?.submit?.()}
                  >
                    提交
                  </Button>
                </Space>
              </div>
            ),
          }}
          onFinish={onFinish}
          initialValues={initialValues}
          form={formObj}
        >
          <ProFormText
            width="md"
            name="name"
            label="服务名称"
            fieldProps={{
              maxLength: 29,
            }}
            placeholder="请输入服务名称"
            rules={[
              {
                required: true,
                message: '请输入服务名称!',
              },
            ]}
          />
          <ProFormSelect
            width="md"
            options={typeList}
            name="type"
            placeholder="请选择类型"
            label="类型"
            rules={[
              {
                required: true,
                message: '请选择类型！',
              },
            ]}
          />
          <ProFormSelect
            width="md"
            options={versionsList}
            name="versions"
            placeholder="请选择版本"
            label="版本"
            rules={[
              {
                required: true,
                message: '请选择版本！',
              },
            ]}
          />
          <ProFormTextArea
            width="md"
            name="desc"
            label="描述"
            placeholder="请输入描述"
            fieldProps={{
              maxLength: 499,
            }}
          />
          <ProForm.Item
            name="configDesc"
            label="配置内容"
            rules={[
              {
                required: true,
                message: '请填写配置内容!',
              },
            ]}
          >
            <CodeMirrorEditorModal
              value={code}
              language="javascript"
              onChange={handleCodeChange}
            />
          </ProForm.Item>
        </ProForm>
      )}
    </Modal>
  );
};
export default ConfigAddOrEditModal;
