import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import router from 'umi/router';

interface ProductInfoProps {
  dispatch: Dispatch<any>;
  match: {
    url: string;
    path: string;
    params: {
      product_key?: string;
    };
  };
  location: {
    pathname: string;
  };
}

class ProductInfo extends Component<ProductInfoProps> {
  componentDidMount() {
    const {
      dispatch,
      match: { params },
    } = this.props;

    if (params.product_key) {
      dispatch({
        type: 'product/fetch',
        key: params.product_key,
      });
    }
  }

  handleTabChange = (key: string) => {
    const { match } = this.props;
    const url = match.url === '/' ? '' : match.url;
    switch (key) {
      case 'info':
        router.push(`${url}`);
        break;
      case 'topic':
        router.push(`${url}/topic`);
        break;
      case 'thing':
        router.push(`${url}/thing`);
        break;
      default:
        break;
    }
  };

  handleFormSubmit = (value: string) => {
    console.log(value);
  };

  getTabKey = () => {
    const { match, location } = this.props;
    const tabKey = location.pathname.replace(match.url, '');
    if (tabKey && tabKey.startsWith('/')) {
      return tabKey.substr(1);
    }
    return 'info';
  };

  render() {
    const tabList = [
      {
        key: 'info',
        tab: '产品信息',
      },
      {
        key: 'topic',
        tab: 'Topic类列表',
      },
      {
        key: 'thing',
        tab: '功能定义',
      },
    ];

    const mainHeader = <div></div>;

    const { children } = this.props;

    return (
      <PageHeaderWrapper
        title="产品名称"
        content={mainHeader}
        tabList={tabList}
        tabActiveKey={this.getTabKey()}
        onTabChange={this.handleTabChange}
      >
        {children}
      </PageHeaderWrapper>
    );
  }
}

export default connect()(ProductInfo);
