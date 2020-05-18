import React, { useCallback, useMemo } from 'react';
import { Layout, Menu } from 'antd';
import './LayoutPage.less';
import { useRouter } from 'next/router'
import { SelectParam } from "antd/lib/menu";

const { Header, Content, Footer } = Layout;


export default function LayoutPage(props) {
  const router = useRouter()

  const handlerSelect = useCallback((e: SelectParam) => {
    router.push(e.key)
  }, [router.push]);
  const selectedKeys = useMemo(() => [router.pathname], [router.pathname])

  return (
    <Layout style={{ height: '100vh' }}>
      <Header className="header">
        <div className="logo">
          kSense
        </div>
        <Menu theme="dark" mode="horizontal" selectedKeys={selectedKeys} onSelect={handlerSelect}>
          <Menu.Item key="/">Data</Menu.Item>
          <Menu.Item key="/settings">Settings</Menu.Item>
        </Menu>
      </Header>
      <Content className={'content'} style={{ margin: '0 16px' }}>
        {props.children}
      </Content>
      <Footer style={{ textAlign: 'center' }}>Created by Baldin Kirill</Footer>
    </Layout>
  );
}

