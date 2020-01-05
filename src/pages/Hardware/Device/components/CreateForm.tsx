import React from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { TableListItem } from '@/pages/Hardware/Product/data.d';

const FormItem = Form.Item;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: {
    product_key: string;
    name: string;
    node_type?: number;
    nickname?: string;
  }) => void;
  onCancel: () => void;
  products?: TableListItem[];
  productKey?: string;
}

const CreateForm: React.FC<CreateFormProps> = ({ 
  modalVisible, 
  form, 
  onSubmit: handleCreate, 
  onCancel, 
  products,
  productKey,
}) => {
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleCreate(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="创建设备"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      {products && <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属产品">
        {form.getFieldDecorator('product_key', {
          rules: [{ required: true, message: '所属产品不能为空！' }],
          initialValue: productKey,
        })(
          <Select placeholder="请选择相应产品" style={{ width: '100%' }}>
            {products.map(item => (
              <Select.Option value={item.product_key} key={item.product_key}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </FormItem>}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="DeviceName">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '至少输入三个字符的设备名称！', min: 3 }],
        })(<Input placeholder="请输入设备名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注名称">
        {form.getFieldDecorator('nickname', {
          rules: [{ required: false }],
        })(<Input placeholder="请输入备注名称" />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
