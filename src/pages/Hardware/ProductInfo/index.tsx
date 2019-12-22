import React, { PureComponent } from 'react';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import router from 'umi/router';

interface ProductInfoProps {
  match: {
    url: string;
    path: string;
  };
  location: {
    pathname: string;
  };
}

@connect()
class ProductInfo extends PureComponent<ProductInfoProps> {
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
    let tabKey = location.pathname.replace(match.url, '');
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

    const mainSearch = (
      <div>
      </div>
    );

    const { children } = this.props;

    return (
      <PageHeaderWrapper
        title="产品名称"
        content={mainSearch}
        tabList={tabList}
        tabActiveKey={this.getTabKey()}
        onTabChange={this.handleTabChange}
      >
        {children}
      </PageHeaderWrapper>
    );
  }
}

export default ProductInfo;
