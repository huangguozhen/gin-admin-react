import { Form, Input, Select } from 'antd';
import React, { PureComponent } from 'react';

const FormItem = Form.Item;
const EditableContext = React.createContext({});

interface EditableRowProps {
  form: any;
  index: any;
}

export interface EditableCellProps {
  editable: any;
  dataIndex: any;
  title: any;
  record: any;
  index: any;
  handleSave: any;
}

const EditableRow = (params: EditableRowProps) => {
  const { form, index, ...props } = params;
  return (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
  );
};

export const EditableFormRow = Form.create()(EditableRow);

export class EditableCell extends PureComponent<EditableCellProps> {
  private form: any;

  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error: any, values: any) => {
      if (error) {
        return;
      }
      handleSave({ ...record, ...values });
    });
  };

  renderFormItem = (dataIndex: any, title: any, record: any) => {
    if (dataIndex === 'method') {
      return (
        <FormItem style={{ margin: 0 }}>
          {this.form.getFieldDecorator(dataIndex, {
            rules: [
              {
                required: true,
                message: `请选择${title}`,
              },
            ],
            initialValue: record[dataIndex],
          })(
            <Select
              style={{ width: '100%' }}
              onBlur={() => {
                this.save();
              }}
            >
              <Select.Option key="get" value="GET">GET</Select.Option>
              <Select.Option key="post" value="POST">POST</Select.Option>
              <Select.Option key="put" value="PUT">PUT</Select.Option>
              <Select.Option key="delete" value="DELETE">DELETE</Select.Option>
              <Select.Option key="patch" value="PATCH">PATCH</Select.Option>
              <Select.Option key="head" value="HEAD">HEAD</Select.Option>
              <Select.Option key="options" value="OPTIONS">OPTIONS</Select.Option>
            </Select>,
          )}
        </FormItem>
      );
    }

    return (
      <FormItem style={{ margin: 0 }}>
        {this.form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `请输入${title}`,
            },
          ],
          initialValue: record[dataIndex],
        })(
          <Input
            onBlur={() => {
              this.save();
            }}
            style={{ width: '100%' }}
          />,
        )}
      </FormItem>
    );
  };

  render() {
    const { editable, dataIndex, title, record, index, handleSave, ...restProps } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form: any) => {
              this.form = form;
              return this.renderFormItem(dataIndex, title, record);
            }}
          </EditableContext.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    );
  }
}
