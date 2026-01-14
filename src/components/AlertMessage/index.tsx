import React from 'react';
import { Alert } from 'antd';
import { ExclamationCircleOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

export interface AlertMessageProps {
  message?: string;
  type?: 'error' | 'info' | 'success' | 'warning';
}

const AlertMessage: React.FC<AlertMessageProps> = ({ message, type = 'info' }) => {
  if (!message) {
    return null;
  }

  const iconMap = {
    error: <ExclamationCircleOutlined />,
    info: <InfoCircleOutlined />,
    success: <CheckCircleOutlined />,
    warning: <ExclamationCircleOutlined />,
  };

  return (
    <Alert
      message={message}
      type={type}
      icon={iconMap[type]}
      showIcon
      style={{ marginBottom: 16 }}
    />
  );
};

export default AlertMessage;
