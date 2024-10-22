/**
 * 公共组件：表格滚动
 */
import eventBus from '@/utils/eventBus';
import { Table } from 'antd';
import { useEffect, useRef, useState } from 'react';

/**
 * 表格滚动组件
 * @param {Number} props.rollTime 表格每次滚动间隔时间 单位ms
 * @param {Number} props.rollNum 表格超过指定条数开始滚动
 * @param {Number} props.rollTop 表格每次滚动的高度 单位px
 * @param {Boolean} props.flag 是否滚动
 * @returns
 */
const ScrollTable = (props: any) => {
  const {
    dataSource,
    rollTime = 100,
    rollNum = 10,
    rollTop = 2.5,
    flag = true,
  } = props;
  let timer: any = null;
  const tableContainer = useRef();
  const [isScrolle, setIsScrolle] = useState(true);
  const hoverHandler = (flag: boolean) => setIsScrolle(flag);

  // 开启定时器
  const initialScroll = (data: any) => {
    let container: any = tableContainer.current;
    container = container.getElementsByClassName('ant-table-body')[0];
    if (data.length > Number(rollNum) && flag && isScrolle) {
      // 只有当大于10条数据的时候 才会看起来滚动
      let time = setInterval(() => {
        container.scrollTop += Number(rollTop);
        if (
          Math.ceil(container.scrollTop) >=
          Number(container.scrollHeight - container.clientHeight)
        ) {
          container.scrollTop = 0;
        }
      }, Number(rollTime));
      timer = time;
    }
  };

  useEffect(() => {
    if (dataSource) {
      initialScroll(dataSource);
    }
    return () => {
      clearInterval(timer);
    };
  }, [dataSource, isScrolle]); // 检测数组内变量 如果为空 则监控全局
  const rowClassName = (record: any, index: any) => {
    return index % 2 === 0 ? 'even-row' : 'odd-row';
  };
  return (
    <div
      onMouseOver={() => {
        clearInterval(timer);
        hoverHandler(false);
      }}
      onMouseOut={() => {
        initialScroll(dataSource);
        hoverHandler(true);
      }}
    >
      <Table
        rowKey="id"
        ref={tableContainer}
        rowClassName={rowClassName}
        pagination={false}
        scroll={{
          y: 210,
          x: '100%',
          scrollToFirstRowOnChange: true,
        }}
        {...props}
      />
    </div>
  );
};
export default ScrollTable;
