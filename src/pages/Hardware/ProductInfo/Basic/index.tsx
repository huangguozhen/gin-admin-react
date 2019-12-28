import { Card, Descriptions } from 'antd';
import React from 'react';

import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';

interface ProductBasicProps {
  loading: boolean;
  dispatch: Dispatch<any>;
}

const ProductBasic: React.FC<ProductBasicProps> = () => (
  <GridContent>
    <Card bordered={false}>
      <Descriptions title="退款申请" style={{ marginBottom: 32 }}>
        <Descriptions.Item label="取货单号">1000000000</Descriptions.Item>
        <Descriptions.Item label="状态">已取货</Descriptions.Item>
        <Descriptions.Item label="销售单号">1234123421</Descriptions.Item>
        <Descriptions.Item label="子订单">3214321432</Descriptions.Item>
      </Descriptions>
    </Card>
  </GridContent>
);

export default connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
  loading: loading.effects['hardwareAndProductBasic/fetchBasic'],
}))(ProductBasic);
