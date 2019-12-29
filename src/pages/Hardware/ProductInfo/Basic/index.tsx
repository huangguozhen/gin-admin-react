import React from 'react';
import { Card, Descriptions } from 'antd';
import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import { ProductStateType } from '../model';
import { DataItem } from '../data.d';

interface ProductBasicProps {
  loading: boolean;
  dispatch: Dispatch<any>;
  data: DataItem;
}

const nodeTypeEnum = {
  1: '设备',
  2: '网关',
}

const netTypeEnum = {
  3: 'WiFi',
  6: '蜂窝(2G/3G/4G/5G)',
  7: '以太网',
  8: '其他',
}

const dataFormatEnum = {
  1: '标准格式',
  2: '透传/自定义',
}

const ProductBasic: React.FC<ProductBasicProps> = ({ data }) => (
  <GridContent>
    <Card bordered={false}>
      <Descriptions bordered style={{ marginBottom: 32 }}>
        <Descriptions.Item label="产品名称">{data.name}</Descriptions.Item>
        <Descriptions.Item label="节点类型">{nodeTypeEnum[data.node_type || 1]}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{moment(data.created_at).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
        <Descriptions.Item label="数据格式">{dataFormatEnum[data.data_format || 1]}</Descriptions.Item>
        <Descriptions.Item label="连网方式">{netTypeEnum[data.net_type || 3]}</Descriptions.Item>
        <Descriptions.Item label="状态">{data.status}</Descriptions.Item>
        <Descriptions.Item label="产品描述">{data.description || '-'}</Descriptions.Item>
      </Descriptions>
    </Card>
  </GridContent>
);

export default connect(({ loading, product }: { 
  loading: { effects: { [key: string]: boolean } };
  product: ProductStateType;
}) => ({
  loading: loading.effects['product/fetch'],
  data: product.data,
}))(ProductBasic);
