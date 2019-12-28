import { Divider, Form, Modal, message } from 'antd';
import React, { useState, useRef } from 'react';

import Link from 'umi/link';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import PButton from '@/components/PermButton';
import { TableListItem } from './data.d';
import { query, create, del } from './service';

interface TableListProps extends FormComponentProps {}

/**
 * 添加节点
 * @param fields
 */
const handleCreate = async (fields: TableListItem) => {
  try {
    await create(fields);
    message.success('添加成功');
    return true;
  } catch (error) {
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param productKey
 */
const handleDelete = async (productKey?: string) => {
  if (!productKey) return true;
  try {
    await del({ product_key: productKey });
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    message.error('删除失败，请重试');
    return false;
  }
};

function handleDelClick(record: TableListItem, actionRef: ActionType) {
  Modal.confirm({
    title: `确定删除【产品：${record.name}】？`,
    okText: '确认',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      const success = await handleDelete(record.product_key);
      if (actionRef && success) actionRef!.reload();
    },
  });
}

const TableList: React.FC<TableListProps> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '产品名称',
      dataIndex: 'name',
    },
    {
      title: 'ProductKey',
      dataIndex: 'product_key',
      hideInSearch: true,
    },
    {
      title: '节点类型',
      dataIndex: 'node_type',
      valueEnum: {
        1: { text: '设备' },
        2: { text: '网关' },
      },
    },
    {
      title: '添加时间',
      dataIndex: 'created_at',
      sorter: true,
      hideInSearch: true,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record, _i, action) => (
        <>
          <Link to={`/hardware/product/${record.product_key}`}>查看</Link>
          <Divider type="vertical" />
          <Link to={`/hardware/device?product_key=${record.product_key}`}>管理设备</Link>
          <Divider type="vertical" />
          <PButton code="del" type="link" onClick={() => handleDelClick(record, action)}>
            删除
          </PButton>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="产品列表"
        actionRef={actionRef}
        rowKey="product_key"
        toolBarRender={() => [
          <PButton code="add" icon="plus" type="primary" onClick={() => handleModalVisible(true)}>
            新建
          </PButton>,
        ]}
        request={params => query(params)}
        columns={columns}
        options={{
          fullScreen: false,
          setting: false,
          reload: true,
        }}
      />
      <CreateForm
        onSubmit={async value => {
          const success = await handleCreate(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      />
    </PageHeaderWrapper>
  );
};

export default Form.create<TableListProps>()(TableList);
