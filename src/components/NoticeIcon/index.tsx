import { useEffect, useRef, useState } from 'react';
import { Badge } from 'antd';
import styles from './index.less';
import HeaderDropdown from '../HeaderDropdown';
import { BellOutlined } from '@ant-design/icons';
import { ProList } from '@ant-design/pro-components';

import type { ActionType } from '@ant-design/pro-table';

export type GlobalHeaderRightProps = {
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
};

const NoticeIconView = () => {
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState<boolean>(false);
  const [noReadcount] = useState<number>(0);
  useEffect(() => {}, []);

  const NoticeBellIcon = <BellOutlined className={styles.icon} />;
  const trigger = (
    <span>
      <Badge
        count={noReadcount}
        style={{ boxShadow: 'none' }}
        className={styles.badge}
      >
        {NoticeBellIcon}
      </Badge>
    </span>
  );
  const notificationBox = () => {
    return (
      <ProList<any>
        toolBarRender={() => {
          return [];
        }}
        search={false}
        rowKey="name"
        headerTitle=""
        pagination={{
          pageSize: 10,
        }}
        showActions="hover"
        metas={{
          description: {
            dataIndex: 'message',
            render: (_, row) => {
              return (
                <>
                  <a style={{ color: row.is_read == 0 ? '#000' : '#aaa' }}>
                    <i
                      className={
                        row.is_read == 0 ? styles.iRedStyle : styles.iGrayStyle
                      }
                    ></i>
                    {row.message}
                  </a>
                </>
              );
            },
          },
        }}
      />
    );
  };
  const triggerChange = (e: any) => {
    setVisible(e);
    actionRef.current?.reload();
  };
  return (
    <HeaderDropdown
      placement="bottomCenter"
      overlay={notificationBox}
      overlayClassName={styles.popover}
      trigger={['click']}
      visible={visible}
      onVisibleChange={(e) => {
        triggerChange(e);
      }}
    >
      {trigger}
    </HeaderDropdown>
  );
};

export default NoticeIconView;
