"use client"
import * as React from 'react';
import { signOut } from 'next-auth/react'
import { Avatar } from 'antd';


import { Menu } from '@headlessui/react';
import Link from 'next/link'
import { ChevronDownIcon } from '@heroicons/react/solid';

const SignOut = ({ User }) => {





  return (
    <div className="inline-block text-left w-full lg:w-auto">
    <Menu>
      {({ open }) => (
        <>
          <span className="rounded-md shadow-sm w-full lg:w-auto">
          <Menu.Button className="inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md hover:bg-opacity-80  md:justify-center">
                { User?.image ? (
                    <Avatar shape="square" size="medium" src={User?.image} style={{ width: '48px', height: '48px' }} className="mr-2" />
                  ) : (
                    <Avatar shape="square" size="medium" src={null} icon={<span>U</span>} className="mr-2" /> 
                  )}
                {User?.name}
                <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
              </Menu.Button>
          </span>
          <Menu.Items
              className={`transition ease-out duration-100 transform origin-top-right ${
                open ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'
              } absolute right-0 w-56 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-50`}
            >
              <div className="py-1 w-full" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <div className="px-4 py-2 text-sm font-bold">ส่วนนี้คือส่วนนำSettings</div>
                
                <Menu.Item>
                  {({ active }) => (
                    <Link href="/" className={`block px-4 py-2 text-sm ${active ? 'bg-blue-500 text-white' : 'text-gray-900'}`}>
                      Account settings
                    </Link>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <Link href="/" className={`block px-4 py-2 text-sm ${active ? 'bg-blue-500 text-white' : 'text-gray-900'}`}>
                      Change account
                    </Link>
                  )}
                </Menu.Item>

                <button onClick={signOut} className="block px-4 py-2 text-sm">Logout</button>

                <Menu.Item>
                  {({ active }) => (
                    <Link href={`/user/${User._id}`} className={`block px-4 py-2 text-sm ${active ? 'bg-blue-500 text-white' : 'text-gray-900'}`}>
                      ข้อมูลเดี่ยว
                    </Link>
                  )}
                </Menu.Item>

                <div className="border-t my-2"></div>

                <div className="px-4 py-2 text-sm font-bold">Danger zone</div>

                <Menu.Item>
                  {({ active }) => (
                    <Link href="/" className={`block px-4 py-2 text-sm ${active ? 'bg-blue-500 text-white' : 'text-gray-900'}`}>
                      Pause subscription
                    </Link>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <Link href="/" className={`block px-4 py-2 text-sm ${active ? 'bg-blue-500 text-white' : 'text-gray-900'}`}>
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
  )
}
export default SignOut

