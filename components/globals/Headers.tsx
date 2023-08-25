
'use server'
import { getServerSession } from 'next-auth'
import * as React from 'react';
import { authOptions} from '@/app/api/auth/[...nextauth]/route'


import SignIn from '../auth/SignIn';
import Link from 'next/link';
import SignOut from '../auth/SignOut';

import { AppBar, Toolbar, IconButton, Button, Box, Typography } from '@mui/material';
import Themebutton from './Themebutton';
import Usernavbar from '../profile/Usernavbar';
import AdminaNavbar from '../profile/AdminNavber';
import MenuResponNav from './MenuResponNav';


const Headers =  async() => {
  const session = await getServerSession(authOptions);

  return (
    <div className="bg-transparent p-0">
    <nav className="flex items-center justify-between flex-wrap p-4">
      <div className="flex items-center flex-shrink-0 text-2xl mr-6">
        <Link href="/" className="text-blue-500 hover:scale-110 hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 hover:text-white transition-all duration-300 ease-in-out">
            <button className="px-4 py-2">StdActivitycheck</button>
         
        </Link>
      </div>
      <div className="block lg:hidden">
      <MenuResponNav/>
    </div>
    <div id="menu-links" className="w-full hidden lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          {session ? (
            <>
              <Link href="/profile/client" className="block mt-4 lg:inline-block lg:mt-0 text-blue-500 hover:text-blue-800 mr-4">Profile Client</Link>
              <Link href="/profile/server" className="block mt-4 lg:inline-block lg:mt-0 text-blue-500 hover:text-blue-800 mr-4">Profile Server</Link>
              <Link href="/dashboard" className="block mt-4 lg:inline-block lg:mt-0 text-blue-500 hover:text-blue-800 mr-4">Dashboard</Link>
              <Link href="/dashboard/cruduser" className="block mt-4 lg:inline-block lg:mt-0 text-blue-500 hover:text-blue-800 mr-4">crud</Link>
              <SignOut user={session?.user} />
            </>
          ) : null}
        </div>
        {!session && (
          <div>
            <Link href="/signin"
             className="text-red-500 border-red-500 border-2 px-4 py-2 inline-block text-sm font-semibold rounded hover:text-red-800">
                Sign In
            </Link>
          </div>
        )}
      </div>
    </nav>
  </div>
  )

}

export default Headers

