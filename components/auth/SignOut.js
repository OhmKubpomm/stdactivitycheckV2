"use client"
import * as React from 'react';
import { signOut } from 'next-auth/react'

import { Menu } from '@headlessui/react';
import Link from 'next/link'
import { ChevronDownIcon } from '@heroicons/react/solid';

const SignOut = ({ user }) => {





  return (
    <div className=" inline-block text-left">
  <Menu>
    {({ open }) => (
      <>
        <span className="rounded-md shadow-sm">
          <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none">
           {user?.name}
            <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
          </Menu.Button>
        </span>
        <div
          className={`${
            open ? 'block' : 'hidden'
          } z-50 absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5`}
        >
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <div className="px-4 py-2 text-gray-700 text-sm font-bold">ส่วนนี้คือส่วนนำSettings</div>
            <Menu.Item>
              <Link href="/" className="block px-4 py-2 text-sm text-gray-700">Account settings</Link>
            </Menu.Item>
            <Menu.Item>
              <Link href="/" className="block px-4 py-2 text-sm text-gray-700">Change account</Link>
            </Menu.Item>
            <button onClick={signOut}   className="block px-4 py-2 text-sm text-gray-700">Logout
  </button>
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

