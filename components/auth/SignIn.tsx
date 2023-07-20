'use client'

import React from 'react'
import { SignInOptions, signIn } from 'next-auth/react'

import Link from '@mui/material/Link';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';

import Grid from '@mui/material/Grid';
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import next from 'next/types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { motion } from 'framer-motion';
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

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1 },
    pressed: { scale: 0.95 },
  };
// Schema for form validation
const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});


 const SignIn = ({callbackUrl}: {callbackUrl: string}) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (values: SignInOptions | undefined) => {
    signIn('credentials', { ...values, callbackUrl: `${window.location.origin}/` });
  };



  
  return (

    <Container maxWidth="sm" className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <Paper elevation={3} className="w-full p-8">
      <Typography variant="h4" className="mb-6 text-center">Sign In</Typography>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <TextField
          {...register('username')}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          autoFocus
          className="mb-4"
          //error={!!Error}
          //helperText={Error.username?.message}
        />

        <TextField
          {...register('password')}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          id="password"
          className="mb-4"
         // error={!!Error.password}
         // helperText={Error.password?.message}
        />

<motion.button 
            type="submit" 
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded mb-4"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="pressed"
          >
            Submit
          </motion.button>
      </form>

      <Box sx={{ width: '100%' }} className="mt-4">
          <motion.button 
            className="w-full py-2 px-4 bg-red-500 hover:bg-red-700 text-white font-bold rounded"
            onClick={() => signIn('google',{callbackUrl})}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="pressed"
          >
            Sign In with Google
          </motion.button>
        </Box>
    </Paper>
  </Container> 
     
 
  )
}
export default SignIn