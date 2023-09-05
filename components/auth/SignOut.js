"use client"
import * as React from 'react';
import { signOut } from 'next-auth/react'

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
            <Menu.Button className="inline-flex justify-between w-full px-4 py-2 text-sm font-medium text-black bg-opacity-60 backdrop-blur rounded-md hover:bg-opacity-80 focus:outline-none lg:justify-center">
              {User?.name}
              <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1 lg:-mr-1" aria-hidden="true" />
            </Menu.Button>
          </span>
          <div
            className={`${
              open ? 'block' : 'hidden'
            } z-50 mt-2 w-full lg:w-56 rounded-md shadow-lg bg-[rgba(255,255,255,0.1)] backdrop-blur-md ring-1 ring-black ring-opacity-5 lg:absolute`}
          >
            <div className="py-1 w-full" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <div className="px-4 py-2 text-gray-700 text-sm font-bold">ส่วนนี้คือส่วนนำSettings</div>
              <Menu.Item>
                <Link href="/" className="block px-4 py-2 text-sm text-gray-700">Account settings</Link>
              </Menu.Item>
              <Menu.Item>
                <Link href="/" className="block px-4 py-2 text-sm text-gray-700">Change account</Link>
              </Menu.Item>
              <button onClick={signOut} className="block px-4 py-2 text-sm text-gray-700">Logout</button>
              <Link href={`/user/${User._id}`} className="block px-4 py-2 text-sm text-gray-700">ข้อมูลเดี่ยว</Link>
              <div className="border-t my-2"></div>
              <div className="px-4 py-2 text-gray-700 text-sm font-bold">Danger zone</div>
              <Menu.Item>
                <Link href="/" className="block px-4 py-2 text-sm text-gray-700">Pause subscription</Link>
              </Menu.Item>
              <Menu.Item>
                <Link href="/" className="block px-4 py-2 text-sm text-gray-700">Delete account</Link>
              </Menu.Item>
            </div>
          </div>
        </>
      )}
    </Menu>
  </div>
  
  

  )
}
export default SignOut

