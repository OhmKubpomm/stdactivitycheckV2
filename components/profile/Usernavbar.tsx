'use client'
import { useState } from 'react';
import { Layout, Menu, Avatar, Button } from 'antd';
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  HomeOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import ContentUser from './ContentUser';

const { Sider } = Layout;
const { SubMenu } = Menu;

const Usernavbar = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout>
      <Sider width={200} className="site-layout-background" collapsible collapsed={collapsed} onCollapse={toggleCollapsed}>
        {!collapsed && (
          <div>
            <div className="logo" style={{ height: '32px', background: 'rgba(255, 255, 255, 0.2)', margin: '16px' }}>
              <a href="#">
                <img className="w-auto h-6 sm:h-7" src="https://merakiui.com/images/full-logo.svg" alt="" />
              </a>
            </div>
            <div className="flex flex-col items-center mt-6 -mx-2">
              <Avatar
                size={64}
                src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
              />
              <h4 className="mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200">John Doe</h4>
              <p className="mx-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">john@example.com</p>
            </div>
          </div>
        )}
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}>
          <Menu.Item key="1" icon={<HomeOutlined />}>Dashboard</Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>Accounts</Menu.Item>
          <Menu.Item key="3" icon={<LaptopOutlined />}>Tickets</Menu.Item>
          <Menu.Item key="4" icon={<SettingOutlined />}>Settings</Menu.Item>
        </Menu>
      </Sider>
      <ContentUser />
    </Layout>
    
    
  );
};

export default Usernavbar;
