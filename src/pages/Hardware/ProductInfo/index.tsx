import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { connect } from 'dva';
import { Descriptions  } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import router from 'umi/router';
import { ProductStateType } from './model';
import { DataItem } from './data.d';

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
  data: DataItem;
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

  getTabKey = () => {
    const { match, location } = this.props;
    const tabKey = location.pathname.replace(match.url, '');
    if (tabKey && tabKey.startsWith('/')) {
      return tabKey.substr(1);
    }
    return 'info';
  };

  render() {
    const tabList = [{
      key: 'info',
      tab: '产品信息',
    },{
      key: 'topic',
      tab: 'Topic类列表',
    },{
      key: 'thing',
      tab: '功能定义',
    }];

    const { data } = this.props;
    const mainHeader = data && (<Descriptions>
      <Descriptions.Item label="Product Key">{data.product_key}</Descriptions.Item>
      <Descriptions.Item label="Product Secret">{data.secret}</Descriptions.Item>
      <Descriptions.Item label="设备管理">{0}</Descriptions.Item>
    </Descriptions>);

    const { children } = this.props;

    return (
      <PageHeaderWrapper
        title={data && data.name}
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

export default connect(({ product }: { product: ProductStateType }) => ({
  data: product.data,
}))(ProductInfo);