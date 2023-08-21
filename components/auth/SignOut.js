"use client"
import * as React from 'react';
import { signOut } from 'next-auth/react'
import { Button } from 'antd'

import { Menu, MenuItem } from '@mui/material'
const SignOut = ({ user }) => {





  return (
    <>

        <p>{user?.name}</p>
      <Button onClick={signOut} >signOut</Button>
    
    </>
  )
}
export default SignOut

