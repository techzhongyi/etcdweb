import { FC, useState } from 'react';
import styles from './index.less';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { Input } from 'antd';

interface IndexProps {
  isDataEdit?: boolean; //是否为数据编辑  只有编辑的时候才有 修改 按钮
  form?: any; //当前的form
  [propKey: string]: any;
}

const Index: FC<IndexProps> = ({
  isDataEdit = false,
  form,
  formData,
  ...rest
}) => {
  const defaultVal = rest.record
    ? rest?.record[rest?.name]
    : formData
    ? formData[rest?.name]
    : '';
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // 设置是否可以编辑
  const setSwitch = () => {
    setIsEdit(!isEdit);
    form.setFieldsValue({
      [rest.name]: isEdit ? defaultVal : '',
    });
  };
  return (
    <div className={styles.editBox}>
      <ProFormText
        style={{ width: '100px' }}
        disabled={isDataEdit && !isEdit}
        {...rest}
      />
      <a onClick={setSwitch}> {isEdit ? '取消' : '修改'} </a>
    </div>
  );
};

export default Index;
