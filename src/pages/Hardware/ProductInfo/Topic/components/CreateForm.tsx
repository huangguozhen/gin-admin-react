import React from 'react';
import { Form, Input, Modal, Select, Alert } from 'antd';

import { FormComponentProps } from 'antd/es/form';
import { TableListItem } from '../data.d';

const FormItem = Form.Item;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { 
    access: number;
    topic: string;
    description: string;
  }) => void;
  onCancel: () => void;
  values?: TableListItem;
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const { 
    modalVisible, 
    form, 
    onSubmit: handleAdd, 
    onCancel,
    values,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="定义Topic类"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Alert
        message="Topic格式必须以“/”进行分层，区分每个类目。其中前三个类目已经规定好，第一个代表产品标识productKey，第二个固定字符串'device'，第三个通配$deviceName"
        type="info"
        showIcon
      />
      <FormItem label="操作权限">
        {form.getFieldDecorator('access', {
          rules: [{ required: true, message: '设备操作权限不能为空' }],
          initialValue: values && values.access || 1,
        })(
          <Select style={{ width: '100%' }}>
            <Select.Option value={1}>发布</Select.Option>
            <Select.Option value={2}>订阅</Select.Option>
            <Select.Option value={3}>发布和订阅</Select.Option>
          </Select>,
        )}
      </FormItem>
      <FormItem label="Topic 类">
        {form.getFieldDecorator('topic', {
          rules: [{ required: true, message: '请输入至少五个字符的Topic类名', min: 5 }],
          initialValue: values && values.topic,
        })(<Input placeholder="请输入您的Topic类名" />)}
      </FormItem>
      <FormItem label="产品描述">
        {form.getFieldDecorator('description', {
          initialValue: values && values.description,
        })(
          <Input.TextArea rows={3} placeholder="请输入描述" />
        )}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
