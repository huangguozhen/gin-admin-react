import React from 'react';
import { Form, Input, Radio, Select, Modal } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { TableListItem } from '../data';

const FormItem = Form.Item;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: TableListItem) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const { modalVisible, form, onSubmit: handleAdd, onCancel } = props;
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
      title="创建产品"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="产品名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入至少二个字符的产品名称！', min: 2 }],
        })(<Input placeholder="请输入您的产品名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="节点类型">
        {form.getFieldDecorator('node_type', {
          rules: [{ required: true, message: '节点类型不能为空！' }],
          initialValue: 1,
        })(
          <Radio.Group buttonStyle="solid">
            <Radio.Button value={1}>直连设备</Radio.Button>
            {/* <Radio.Button value="3">网关子设备</Radio.Button> */}
            <Radio.Button value={2}>网关设备</Radio.Button>
          </Radio.Group>,
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="联网方式">
        {form.getFieldDecorator('net_type', {
          rules: [{ required: true, message: '联网方式不能为空！' }],
          initialValue: 3,
        })(
          <Select style={{ width: '100%' }}>
            <Select.Option value={3}>WiFi</Select.Option>
            <Select.Option value={6}>蜂窝(2G/3G/4G/5G)</Select.Option>
            <Select.Option value={7}>以太网</Select.Option>
            {/* <Select.Option value={9}>LoRaWAN</Select.Option> */}
            <Select.Option value={8}>其他</Select.Option>
          </Select>,
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="数据格式">
        {form.getFieldDecorator('data_format', {
          rules: [{ required: true, message: '数据格式不能为空！' }],
          initialValue: 1,
        })(
          <Select style={{ width: '100%' }}>
          <Select.Option value={1}>标准格式</Select.Option>
          <Select.Option value={2}>透传/自定义</Select.Option>
        </Select>,)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="产品描述">
        {form.getFieldDecorator('description')(
          <Input.TextArea 
            rows={3}
            placeholder="请输入产品描述" 
          />
        )}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
