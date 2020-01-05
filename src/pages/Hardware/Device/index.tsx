import { Button, Divider, Form, Modal, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'dva';
import { AnyAction, Dispatch } from 'redux';
import _ from 'lodash';

import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { TableListItem } from './data.d';
import { TableListItem as ProductItem } from '@/pages/Hardware/Product/data.d';
import { query, update, create, del } from './service';
import { ProductStateType } from '@/models/product';

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<AnyAction>;
  products: ProductItem[];
  location: {
    query: {
      product_key?: string;
    }
  };
}

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
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: TableListItem) => {
  try {
    await update(fields);
    message.success('保存成功');
    return true;
  } catch (error) {
    message.error('保存失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleDelete = async (iotId?: string) => {
  if (!iotId) return true;
  try {
    await del({ iot_id: iotId });
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    message.error('删除失败，请重试');
    return false;
  }
};

function handleDelClick(record: TableListItem, actionRef: ActionType) {
  Modal.confirm({
    title: `确定删除【设备：${record.name}】？`,
    okText: '确认',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      const success = await handleDelete(record.iot_id);
      if (actionRef && success) actionRef!.reload();
    },
  });
}

const TableList: React.FC<TableListProps> = ({ dispatch, products, location }) => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<TableListItem>({});

  const mapByKey = _.keyBy(products, 'product_key');
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'DeviceName',
      dataIndex: 'name',
    },
    {
      title: '所属产品',
      hideInSearch: true,
      dataIndex: 'product_key',
      renderText: key => mapByKey[key] && mapByKey[key].name,
    },
    {
      title: '节点类型',
      dataIndex: 'node_type',
      valueEnum: {
        0: { text: '全部' },
        1: { text: '设备' },
        2: { text: '网关' },
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        '': { text: '全部' },
        'online': { text: '在线' },
        'offline': { text: '离线' },
        'unactive': { text: '未激活' },
        'disable': { text: '禁用' },
      },
    },
    {
      title: '最后上线时间',
      dataIndex: 'utc_online',
      hideInSearch: true,
      sorter: true,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record, _idx, action) => (
        <>
          <Button 
            type="link" 
            onClick={() => {
              handleUpdateModalVisible(true);
              setFormValues(record);
            }}
          >修改</Button>
          <Divider type="vertical" />
          <Button 
            type="link" 
            onClick={() => handleDelClick(record, action)}
          >删除</Button>
        </>
      ),
    },
  ];

  useEffect(() => {
    dispatch({ type: 'product/fetchAll' });
  }, []);

  return (
    <PageHeaderWrapper
      content={}
    >
      <ProTable<TableListItem>
        headerTitle="设备管理"
        actionRef={actionRef}
        rowKey="key"
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            添加设备
          </Button>,
        ]}
        tableAlertRender={() => false}
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
          const product = mapByKey[value.product_key];
          const success = await handleCreate({ 
            ...value, 
            node_type: product.node_type,
          });
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
        products={products}
        productKey={location.query.product_key}
      />
      {formValues && Object.keys(formValues).length ? (
        <UpdateForm
          onSubmit={async value => {
            const success = await handleUpdate(value);
            if (success) {
              handleModalVisible(false);
              setFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setFormValues({});
          }}
          modalVisible={updateModalVisible}
          values={formValues}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default connect(({ product }: { product: ProductStateType }) => ({
  products: product.list || [],
}))(Form.create<TableListProps>()(TableList));