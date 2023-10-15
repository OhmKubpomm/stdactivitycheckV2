/* eslint-disable tailwindcss/migration-from-tailwind-2 */
"use client";
import * as React from "react";
import { signOut } from "next-auth/react";
import { Avatar } from "antd";

import { Menu } from "@headlessui/react";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/solid";

const SignOut = ({ User }) => {
  return (
    <div className="inline-block w-full text-left lg:w-auto">
      <Menu>
        {({ open }) => (
          <>
            <span className="w-full rounded-md shadow-sm lg:w-auto">
              <Menu.Button className="inline-flex w-full items-center justify-between rounded-md px-4 py-2 text-sm font-medium hover:bg-opacity-80  md:justify-center">
                {User?.image ? (
                  <Avatar
                    shape="square"
                    size="medium"
                    src={User?.image}
                    style={{ width: "48px", height: "48px" }}
                    className="mr-2"
                  />
                ) : (
                  <Avatar
                    shape="square"
                    size="medium"
                    src={null}
                    icon={<span>U</span>}
                    className="mr-2"
                  />
                )}
                {User?.name}
                <ChevronDownIcon
                  className="-mr-1 ml-2 h-5 w-5"
                  aria-hidden="true"
                />
              </Menu.Button>
            </span>
            <Menu.Items
              className={`origin-top-right transition duration-100 ease-out${
                open
                  ? "visible scale-100 opacity-100"
                  : "invisible scale-95 opacity-0"
              } absolute right-0 z-50 mt-2 w-56 rounded-md border border-gray-300 bg-white shadow-lg`}
            >
              <div
                className="w-full py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <div className="px-4 py-2 text-sm font-bold">
                  ส่วนนี้คือส่วนนำSettings
                </div>

                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/"
                      className={`block px-4 py-2 text-sm ${
                        active ? "bg-blue-500 text-white" : "text-gray-900"
                      }`}
                    >
                      Account settings
                    </Link>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/"
                      className={`block px-4 py-2 text-sm ${
                        active ? "bg-blue-500 text-white" : "text-gray-900"
                      }`}
                    >
                      Change account
                    </Link>
                  )}
                </Menu.Item>

                <button onClick={signOut} className="block px-4 py-2 text-sm">
                  Logout
                </button>

                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href={`/user/${User._id}`}
                      className={`block px-4 py-2 text-sm ${
                        active ? "bg-blue-500 text-white" : "text-gray-900"
                      }`}
                    >
                      ข้อมูลเดี่ยว
                    </Link>
                  )}
                </Menu.Item>

                <div className="my-2 border-t"></div>

                <div className="px-4 py-2 text-sm font-bold">Danger zone</div>

                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/"
                      className={`block px-4 py-2 text-sm ${
                        active ? "bg-blue-500 text-white" : "text-gray-900"
                      }`}
                    >
                      Pause subscription
                    </Link>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/"
                      className={`block px-4 py-2 text-sm ${
                        active ? "bg-blue-500 text-white" : "text-gray-900"
                      }`}
                    >
                      Delete account
                    </Link>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </>
        )}
      </Menu>
    </div>
  );
};
export default SignOut;
