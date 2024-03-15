"use client";
import React, { useState } from "react";

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
} from "@ant-design/icons";

import { motion } from "framer-motion";

import Link from "next/link";

const AdminaNavbar = () => {
  const [open, setOpen] = useState(true);
  const menus = [
    {
      name: "จัดการข้อมูลผู้ใช้งาน",
      icon: <DashboardOutlined />,
      Link: "/dashboard/cruduser",
    },
    {
      name: "จัดการข้อมูลกิจกรรมนักศึกษา",
      icon: <InboxOutlined />,
      Link: "/dashboard/crudactivityform",
    },
    {
      name: "จัดการข้อมูลแผนที่",
      icon: <UserOutlined />,
      gap: true,
      Link: "/dashboard/crudmap",
    },
    { name: "Schedule", icon: <ScheduleOutlined />, Link: "/" },
    { name: "Search", icon: <SearchOutlined />, Link: "/" },
    { name: "Analytics", icon: <BarChartOutlined />, Link: "/" },
    { name: "Files", icon: <FolderOutlined />, gap: true, Link: "/" },
    { name: "Setting", icon: <SettingOutlined />, Link: "/" },
  ];

  return (
    <section className="flex min-h-screen">
      <motion.div
        style={{ border: "1px solid #ccc", borderRadius: "4px" }}
        className={`text-dark300_light900  flex flex-col transition-all duration-500 ${
          open ? "w-72" : "w-16"
        } px-4`}
      >
        <div className="flex justify-end py-3">
          <MenuFoldOutlined
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <nav className="mt-4 flex flex-1 flex-col gap-4 ">
          {menus?.map((menu, i) => (
            <Link
              href={menu.Link}
              key={i}
              className={`group flex cursor-pointer items-center gap-3.5 rounded-md from-primary-500 to-yellow-500 p-2 text-sm font-medium hover:bg-gradient-to-r hover:text-white
           ${menu?.gap ? "mt-5" : ""}`}
            >
              <div>{menu?.icon}</div>
              <h2
                style={{ transitionDelay: `${i + 2}00ms` }}
                className={`whitespace-pre transition-all duration-200 ${
                  !open && "translate-x-28 overflow-hidden opacity-0"
                }`}
              >
                {menu?.name}
              </h2>
              {!open && (
                <h2 className="absolute left-14 w-0 overflow-hidden whitespace-pre rounded-md  p-0 font-semibold text-gray-900  group-hover:w-fit group-hover:px-2 group-hover:py-1 group-hover:duration-200">
                  {menu?.name}
                </h2>
              )}
            </Link>
          ))}
        </nav>
      </motion.div>
    </section>
  );
};

export default AdminaNavbar;
