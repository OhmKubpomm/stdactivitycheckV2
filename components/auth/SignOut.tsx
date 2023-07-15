"use client"
import React from 'react'
import { signOut } from 'next-auth/react'
import { Button } from 'antd'
const SignOut = () => {
  return (
    <>
        <Button onClick={signOut}>sign out</Button>
    </>

  )
}

export default SignOut