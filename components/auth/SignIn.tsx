'use client'

import React from 'react'
import { signIn } from 'next-auth/react'
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';
import next from 'next/types';


function Copyright(props: any) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

 const SignIn = () => {

  return (
    <>
              <button 
              onClick={() => signIn('google',{callbackUrl:"/"})}
       
              >
                Sign In</button>
     
      </>
 
  )
}
export default SignIn