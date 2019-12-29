import { Button, Divider, Form, Modal, message } from 'antd';
import React, { useState, useRef } from 'react';

import { FormComponentProps } from 'antd/es/form';
import { GridContent } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import { TableListItem } from './data.d';
import { query, update, create, del } from './service';

interface TableListProps extends FormComponentProps {
  match: {
    params: {
      product_key: string;
    };
  };
}

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
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
 * @param topicId
 */
const handleDelete = async (topicId?: string) => {
  if (!topicId) return true;
  try {
    await del({ topic_id: topicId });
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    message.error('删除失败，请重试');
    return false;
  }
};

const handleDelClick = (record: TableListItem, actionRef: ActionType) => {
  Modal.confirm({
    title: `确定删除【Topic：${record.topic}】？`,
    okText: '确认',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      const success = await handleDelete(record.topic_id);
      if (actionRef && success) actionRef!.reload();
    },
  });
};

const TableList: React.FC<TableListProps> = ({ match }) => {
  const [ModalVisible, handleModalVisible] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<TableListItem>({});
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'Topic类',
      dataIndex: 'topic',
    },
    {
      title: '权限',
      dataIndex: 'access',
      valueEnum: {
        1: { text: '发布' },
        2: { text: '订阅' },
        3: { text: '全部' },
      },
    },
    {
      title: '描述',
      hideInSearch: true,
      dataIndex: 'description',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record, _i, action) => {
        if (record.topic.startsWith('/ota') || record.topic.startsWith('/sys')) {
          return null;
        }
        return (<>
          <Button 
            type="link" 
            onClick={() => {
              handleModalVisible(true);
              setFormValues(record);
            }}
          >修改</Button>
          <Divider type="vertical" />
          <Button 
            type="link" 
            onClick={() => handleDelClick(record, action)}
          >删除</Button>
        </>);
      }
    },
  ];

  const productKey = match.params.product_key;
  return (
    <GridContent>
      <ProTable<TableListItem>
        headerTitle={false}
        actionRef={actionRef}
        rowKey="topic_id"
        search={false}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            定义Topic类
          </Button>,
        ]}
        tableAlertRender={() => false}
        request={params => query({ ...params, product_key: productKey })}
        columns={columns}
        options={{
          fullScreen: false,
          setting: false,
          reload: true,
        }}
      />
      <CreateForm
        onSubmit={async value => {
          const success = await handleAdd({
            ...value,
            allow: 1,
            product_key: productKey,
          });
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleModalVisible(false)}
        modalVisible={ModalVisible}
      />
      {formValues && Object.keys(formValues).length ? (
        <CreateForm
          onSubmit={async value => {
            const success = await handleUpdate({
              ...formValues,
              ...value,
            });
            if (success) {
              handleModalVisible(false);
              setFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleModalVisible(false);
            setFormValues({});
          }}
          modalVisible={ModalVisible}
          values={formValues}
        />
      ) : null}
    </GridContent>
  );
};

export default Form.create<TableListProps>()(TableList);
