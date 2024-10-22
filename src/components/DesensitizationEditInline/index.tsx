import { FC, useState } from 'react';
import styles from './index.less';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { Input, Space } from 'antd';
import Help from '@/utils/help';

interface IndexProps {
  value?: any;
  defaultVal?: any;
  onChange?: Function;
}
const Index: React.FC<IndexProps> = ({ value, onChange, defaultVal }) => {
  const [inputValue, setInputValue] = useState<string>(value);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // 设置是否可以编辑
  const setSwitch = () => {
    setIsEdit(!isEdit);
    setInputValue(isEdit ? defaultVal : '');
    if (isEdit) {
      setInputValue(defaultVal);
      onChange?.(defaultVal);
    }
  };

  const handleInputConfirm = () => {
    onChange?.(inputValue);
  };
  return (
    <Space className="editBox">
      <Input
        type="text"
        size="small"
        bordered={isEdit}
        readOnly={!isEdit}
        style={{ width: 130 }}
        maxLength={11}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputConfirm}
        onPressEnter={handleInputConfirm}
      />
      <a onClick={setSwitch}>{isEdit ? '取消' : '修改'}</a>
    </Space>
  );
};

export default Index;
