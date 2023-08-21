'use client'
import React,{ useState } from 'react';
import { Layout, Tooltip,Avatar,Button,Typography  } from 'antd';
import {
  DashboardOutlined,
  InboxOutlined,
  UserOutlined,
  ScheduleOutlined,
  SearchOutlined,
  BarChartOutlined,
  FolderOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import ContentUser from './ContentUser';
import Link from 'next/link';

const { Title } = Typography;


const Usernavbar = () => {
  const [open, setOpen] = useState(true);
  const menus = [
    { name: "Dashboard", icon: <DashboardOutlined />,Link:"/profile" },
    { name: "Inbox", icon: <InboxOutlined />,Link:"/" },
    { name: "Accounts", icon: <UserOutlined />, gap:true ,Link:"/" },
    { name: "Schedule", icon: <ScheduleOutlined /> ,Link:"/"},
    { name: "Search", icon: <SearchOutlined /> ,Link:"/"},
    { name: "Analytics", icon: <BarChartOutlined /> ,Link:"/"},
    { name: "Files", icon: <FolderOutlined />,gap:true ,Link:"/"},
    { name: "Setting", icon: <SettingOutlined /> ,Link:"/" },  
  ];
const bottomMenus = [
    { name: "Avatar", icon: <Avatar icon={<UserOutlined />} /> ,Link:"/" },
    { name: "Logout", icon: <LogoutOutlined />, gap:false,Link:"/" },
   
  ];

  return (
   
      <section className="flex gap-6">
         <Layout>
        <div
          className={`bg-[#fdfdfd] min-h-screen ${
            open ? "w-72" : "w-16"
          } duration-500 text-gray px-4 flex flex-col`}
        >
          <div className="py-3 flex justify-end">
            <MenuFoldOutlined
              size={26}
              className="cursor-pointer"
              onClick={() => setOpen(!open)}
            />
          </div>
          <div className="flex-1 mt-4 flex flex-col gap-4 relative ">
            {menus?.map((menu, i) => (
              <Link href={menu.Link} key={i}>
                <div
                  className={` ${
                    menu?.gap && "mt-5"
                  } group flex items-center text-sm   gap-3.5 font-medium p-2 hover:bg-gray-200 rounded-md cursor-pointer`}
                >
                  <div>{menu?.icon}</div>
                  <h2
                    style={{
                      transitionDelay: `${i + 3}00ms`,
                    }}
                    className={`whitespace-pre duration-500 ${
                      !open && "opacity-0 translate-x-28 overflow-hidden"
                    }`}
                  >
                    {menu?.name}
                  </h2>
                  <h2
                    className={`${
                      open && "hidden"
                    } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                  >
                    {menu?.name}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
          
          <Title level={5}>Account</Title>
          <div className="mb-4 flex flex-col gap-4">
           
           
        
            {bottomMenus?.map((menu, i) => (
              <Link href={menu.Link} key={i}>
                <div
                  className={` ${
                    menu?.gap && "mt-5 bottom-0 "
                  } group flex items-center text-sm   gap-3.5 font-medium p-2 hover:bg-gray-200 rounded-md cursor-pointer`}
                >
                  <div>{menu?.icon}</div>
                  <h2
                    style={{
                      transitionDelay: `${i + 3}00ms`,
                    }}
                    className={`whitespace-pre duration-500 ${
                      !open && "opacity-0 translate-x-28 overflow-hidden"
                    }`}
                  >
                    {menu?.name}
                  </h2>
                  <h2
                    className={`${
                      open && "hidden"
                    } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                  >
                    {menu?.name}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        </div>

        </Layout>
      </section>
   
  
  );
};

export default Usernavbar;
