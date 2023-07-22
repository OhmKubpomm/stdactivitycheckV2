
'use server'
import { getServerSession } from 'next-auth'
import * as React from 'react';
import { authOptions} from '@/app/api/auth/[...nextauth]/route'


import SignIn from './auth/SignIn';
import Link from 'next/link';
import SignOut from './auth/SignOut';





const Headers =  async() => {
  const session = await getServerSession(authOptions);

  return (
   <header style={{display:'flex' ,gap:30}}>
   
      <Link href="/">home</Link>
      <Link href="/protected/client">Protectpageclient</Link>
      <Link href="/protected/server">Protectpageserver</Link>
      {
        session
        ?
        <>
        <Link href="/profile/client">Profileclient</Link>
        <Link href="/profile/server">Profileserver</Link> 
        <Link href="/dashboard">Dashboard</Link>
        <SignOut/>
        </>
        : <Link href="/signin">SignIn</Link>
      }

      </header>
  )

  }
  


export default Headers