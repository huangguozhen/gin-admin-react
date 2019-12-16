import React, { useContext } from 'react';
import { Button } from 'antd';
import { RouteContext } from '@ant-design/pro-layout';
import { ButtonProps } from 'antd/lib/button/button';

export interface PermButtonProps extends ButtonProps {
  code: string;
}

function getActions(menuData: any[], pathname: string) {
  const result = {};
  function fill(data: any[]) {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].path !== '') {
        result[data[i].path] = data[i].actions;
      }
      if (data[i].children && (data[i].children).length > 0) {
        fill(data[i].children);
      }
    }
  }
  fill(menuData);

  return result[pathname] || [];
}

const PermButton: React.FC<PermButtonProps> = props => {
  const { children, code, ...rest } = props;
  const { menuData, location: { pathname } }: any = useContext(RouteContext);
  const actions = getActions(menuData, pathname);
  for (let i = 0; i < actions.length; i += 1) {
    if (actions[i].code === code) {
      return <Button {...rest}>{children}</Button>;
    }
  }
  return null;
}

export default PermButton;