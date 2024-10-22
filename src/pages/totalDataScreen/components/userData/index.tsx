import React, { useState, useEffect } from 'react';
import './index.less';
import Left from './components/left';
import Center from './components/center';
import Right from './components/right';
const User: React.FC<any> = (props) => {
  //  创建Context
  // const CommunicationContext = React.createContext()
  return (
    <>
      <div className="data-wrap">
        <Left />
        <Center />
        <Right />
      </div>
    </>
  );
};

export default User;
