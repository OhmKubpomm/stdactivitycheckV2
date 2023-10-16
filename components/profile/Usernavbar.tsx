/* eslint-disable tailwindcss/no-custom-classname */
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

import Link from "next/link";
import { motion } from "framer-motion";

const Usernavbar = () => {
  const [open, setOpen] = useState(true);
  const menus = [
    { name: "ตรวจสอบกิจกรรม", icon: <DashboardOutlined />, Link: "/profile" },
    { name: "Inbox", icon: <InboxOutlined />, Link: "/" },
    { name: "Accounts", icon: <UserOutlined />, gap: true, Link: "/" },
    { name: "Schedule", icon: <ScheduleOutlined />, Link: "/" },
    { name: "Search", icon: <SearchOutlined />, Link: "/" },
    { name: "Analytics", icon: <BarChartOutlined />, Link: "/" },
    { name: "Files", icon: <FolderOutlined />, gap: true, Link: "/" },
    { name: "Setting", icon: <SettingOutlined />, Link: "/" },
  ];

  return (
    <section className="flex gap-6">
      <motion.div
        className={`text-gray flex min-h-screen flex-col bg-[#D4DFE1] transition-all duration-500 ${
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
        <nav className="mt-4 flex flex-1 flex-col gap-4">
          {menus?.map((menu, i) => (
            <Link
              href={menu.Link}
              key={i}
              className={`group flex cursor-pointer items-center gap-3.5 rounded-md p-2 text-sm font-medium hover:bg-red-200 hover:text-blue-600
         ${menu?.gap ? "mt-5" : ""}`}
            >
              <div>{menu?.icon}</div>
              <h2
                style={{ transitionDelay: `${i + 3}00ms` }}
                className={`whitespace-pre transition-all duration-500 ${
                  !open && "translate-x-28 overflow-hidden opacity-0"
                }`}
              >
                {menu?.name}
              </h2>
              {!open && (
                <h2 className="absolute left-14 w-0 overflow-hidden whitespace-pre rounded-md bg-white p-0 font-medium text-gray-900 drop-shadow-lg group-hover:w-fit group-hover:px-2 group-hover:py-1 group-hover:duration-300">
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

export default Usernavbar;
