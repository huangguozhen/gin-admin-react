import React from 'react';
import { Form, Input, Modal } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { TableListItem } from '../data.d';

const FormItem = Form.Item;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: TableListItem) => void;
  onCancel: () => void;
  values: TableListItem;
}

const UpdateForm: React.FC<CreateFormProps> = ({ 
  modalVisible, 
  form, 
  onSubmit: handleUpdate, 
  onCancel,
  values,
}) => {
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { updated_at, created_at, ...rest } = values;
      handleUpdate({ ...rest, ...fieldsValue});
      form.resetFields();
    });
  };
  return (
    <Modal
      destroyOnClose
      title="修改设备"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="DeviceName">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '至少输入三个字符的设备名称！', min: 3 }],
          initialValue: values.name,
        })(<Input placeholder="请输入设备名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注名称">
        {form.getFieldDecorator('nickname', {
          rules: [{ required: false }],
          initialValue: values.nickname,
        })(<Input placeholder="请输入备注名称" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(UpdateForm);