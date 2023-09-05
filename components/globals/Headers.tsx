
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
    <nav className="flex items-center justify-between flex-wrap p-4 ">
      <div className="flex items-center flex-shrink-0 text-2xl mr-6">
        <Link href="/" >
         
          <button className="px-4 py-2 glass-button hover:text-blue-800">StdActivitycheck</button>
        </Link>
      </div>
      <div className="block lg:hidden">
        <MenuResponNav />
      </div>
      <div id="menu-links" className="w-full hidden lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          {session ? (
            <>
              {session.user.role === 'admin' ? (
                <>
                  {/* Links for Admin */}
                  <Link href="/dashboard" className="block mt-4 lg:inline-block lg:mt-0  hover:text-blue-800 mr-4 ">Dashboard</Link>
                  <Link href="/dashboard/cruduser" className="block mt-4 lg:inline-block lg:mt-0  hover:text-blue-800 mr-4">Crud</Link>
                </>
              ) : (
                <>
                  {/* Links for Users */}
                  <Link href="/profile/client" className="block mt-4 lg:inline-block lg:mt-0  hover:text-blue-800 mr-4">Profile Client</Link>
                </>
              )}
              <SignOut User={session?.user} />
            </>
          ) : null}
        </div>
        {!session && (
          <div>
            
            <Link href="/signin"
              className="inline-block text-sm font-semibold rounded hover:text-red-800 text-red-500 border-red-500 border-2 px-4 py-2">
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

