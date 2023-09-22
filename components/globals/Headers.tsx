
'use server'
import { getServerSession } from 'next-auth'
import * as React from 'react';
import { authOptions} from '@/app/api/auth/[...nextauth]/route'



import Link from 'next/link';
import SignOut from '../auth/SignOut';


import Themebutton from './Themebutton';

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
                
                </>
              ) : (
                <>
                  {/* Links for Users */}
                 
                </>
              )}
               <div className="flex items-center space-x-4">
                <div>
                  <Themebutton />
                </div>
                <div>
                <SignOut User={session?.user} />
                </div>
              </div>
              
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

