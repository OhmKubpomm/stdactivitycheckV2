
'use client';
import Link from 'next/link'
import Image from 'next/image'
import { getServerSession } from 'next-auth'
import React from 'react'
import { Button } from 'antd';
import { authOptions} from '@/app/api/auth/[...nextauth]/route'

const Headers = async () => {
  const session = await getServerSession(authOptions);
  console.log(session)
  return (
    <div className="App">
    <Button type="primary">Button</Button>
  </div>


  )
}

export default Headers