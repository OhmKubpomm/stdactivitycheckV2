
"use server"
import { getServerSession } from 'next-auth'
import * as React from 'react';
import { authOptions} from '@/app/api/auth/[...nextauth]/route'
import type { BadgeProps } from 'antd';
import { Badge, Calendar } from 'antd';
import type { Dayjs } from 'dayjs';
import type { CellRenderInfo } from 'rc-picker/lib/interface';
import SignIn from './auth/SignIn';
import Link from 'next/link';
import SignOut from './auth/SignOut';





const Headers =  async() => {
  const session = await getServerSession(authOptions);
  
  console.log(session)
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
        : <Link href="/Signin">SignIn</Link>
      }

      </header>
  )

  }
  


export default Headers