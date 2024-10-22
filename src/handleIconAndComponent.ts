import React from 'react';
import * as allIcons from '@ant-design/icons';

export function handleIconAndComponent(routes: any) {
  return routes.map(
    (ele: {
      iconName: string | number;
      icon:
        | {}
        | React.ReactElement<any, string | React.JSXElementConstructor<any>>;
      component: any;
      routes: string | any[];
    }) => {
      if (ele.iconName) {
        const iconNode: React.ReactNode = React.createElement(
          allIcons[ele.iconName],
        );
        if (iconNode) {
          ele.icon = iconNode;
        }
      }
      delete ele.component;
      if (ele.routes && ele.routes.length > 0) {
        handleIconAndComponent(ele.routes);
      }
      return ele;
    },
  );
}
