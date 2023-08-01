'use client'
import { Layout, Menu, Avatar, Typography, Divider } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  CalendarOutlined,
  BarChartOutlined,
  FileAddOutlined,
  SettingOutlined,
  LockOutlined,
} from '@ant-design/icons';


const { SubMenu } = Menu;
const { Sider } = Layout;
const { Text } = Typography;

const mockdata = [
  { label: 'Dashboard', icon: <DashboardOutlined /> },
  {
    label: 'Market news',
    icon: <FileTextOutlined />,
    links: [
      { label: 'Overview', link: '/' },
      { label: 'Forecasts', link: '/' },
      { label: 'Outlook', link: '/' },
      { label: 'Real time', link: '/' },
    ],
  },
  {
    label: 'Releases',
    icon: <CalendarOutlined />,
    links: [
      { label: 'Upcoming releases', link: '/' },
      { label: 'Previous releases', link: '/' },
      { label: 'Releases schedule', link: '/' },
    ],
  },
  { label: 'Analytics', icon: <BarChartOutlined /> },
  { label: 'Contracts', icon: <FileAddOutlined /> },
  { label: 'Settings', icon: <SettingOutlined /> },
  {
    label: 'Security',
    icon: <LockOutlined />,
    links: [
      { label: 'Enable 2FA', link: '/' },
      { label: 'Change password', link: '/' },
      { label: 'Recovery codes', link: '/' },
    ],
  },
];



const Usernavbar = () => {
   
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200}>
        <div style={{ padding: '20px', background: '#001529' }}>
          <Text style={{ color: 'white', fontSize: '18px' }}>Logo</Text>
          <Text style={{ color: 'white', float: 'right' }}>v3.1.2</Text>
        </div>
        <Menu theme="dark" mode="inline">
          {mockdata.map((item, index) => {
            if (item.links) {
              return (
                <SubMenu key={index} icon={item.icon} title={item.label}>
                  {item.links.map((link, i) => (
                    <Menu.Item key={i}>{link.label}</Menu.Item>
                  ))}
                </SubMenu>
              );
            } else {
              return (
                <Menu.Item key={index} icon={item.icon}>
                  {item.label}
                </Menu.Item>
              );
            }
          })}
        </Menu>
        <Divider />
        <div style={{ padding: '20px', color: 'white' }}>
          <Avatar
            src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
            style={{ marginBottom: '10px' }}
          />
          <div>Ann Nullpointer</div>
          <div>anullpointer@yahoo.com</div>
        </div>
      </Sider>
    </Layout>
  )
}

export default Usernavbar