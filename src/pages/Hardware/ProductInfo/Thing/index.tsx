import { Button, Divider, Form, message } from 'antd';
import React, { useState, useRef } from 'react';

import { FormComponentProps } from 'antd/es/form';
import { GridContent } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
// import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem } from './data.d';
import { query, create } from './service';

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
  const hide = message.loading('正在添加');
  try {
    await create(fields);
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
// const handleUpdate = async (fields: FormValueType) => {
//   const hide = message.loading('正在配置');
//   try {
//     await updateRule({
//       name: fields.name,
//       desc: fields.desc,
//       key: fields.key,
//     });
//     hide();

//     message.success('配置成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('配置失败请重试！');
//     return false;
//   }
// };

/**
 *  删除节点
 * @param selectedRows
 */
// const handleRemove = async (selectedRows: TableListItem[]) => {
//   const hide = message.loading('正在删除');
//   if (!selectedRows) return true;
//   try {
//     await removeRule({
//       key: selectedRows.map(row => row.key),
//     });
//     hide();
//     message.success('删除成功，即将刷新');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('删除失败，请重试');
//     return false;
//   }
// };

const TableList: React.FC<TableListProps> = ({ match }) => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  // const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  // const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '功能类型',
      dataIndex: 'func_type',
    },
    {
      title: '功能名称',
      dataIndex: 'func_name',
    },
    {
      title: '标识符',
      dataIndex: 'identifier',
    },
    {
      title: '数据类型',
      dataIndex: 'data_type',
      valueEnum: {},
    },
    {
      title: '数据定义',
      dataIndex: 'spec',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: () => (
        <></>
      ),
    },
  ];

  const productKey = match.params.product_key;
  return (
    <GridContent>
      <ProTable<TableListItem>
        headerTitle={false}
        actionRef={actionRef}
        rowKey="thing_id"
        search={false}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            添加功能
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
          const success = await handleAdd(value);
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
      {/* {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async value => {
            const success = await handleUpdate(value);
            if (success) {
              handleModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null} */}
    </GridContent>
  );
};

export default Form.create<TableListProps>()(TableList);
