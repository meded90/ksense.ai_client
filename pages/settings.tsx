import React from 'react';
import { Button, Form, Input, Typography, notification } from 'antd';
import { useStores } from "../stores/stores";

const { Title } = Typography

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Settings = () => {
  const [form] = Form.useForm();
  const { settingsStore } = useStores()

  const onFinish = values => {
    console.log('Success:', values);
    Object.assign(settingsStore, values);
    notification.success({
      message: 'Settings saved',
    });
  }

  const onReset = () => {
    form.resetFields();
  };

  return <div>
    <Title>Settings</Title>
    <Form
      {...layout}
      form={form}
      name="basic"
      initialValues={settingsStore}
      onFinish={onFinish}
    >
      <Form.Item
        label="Project id"
        name="projectId"
        rules={[{ required: true, message: 'Please input your Project id!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Token"
        name="token"
        rules={[{ required: true, message: 'Please input your Token!' }]}
      >
        <Input />
      </Form.Item>


      <Form.Item {...tailLayout}>
        <Button htmlType="button" onClick={onReset}>
          Reset
        </Button> {' '}
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  </div>;
};

export default Settings
