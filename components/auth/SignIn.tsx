'use client'

import React, { useState } from 'react'
import { SignInOptions, signIn } from 'next-auth/react'
import Link from '@mui/material/Link';
import { MailOutlined, LockOutlined, GoogleOutlined ,CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

import { useForm } from "react-hook-form";
import Form from "@/components/globals/Form";
import Button from "@/components/globals/Button";
import Image from "next/image";
import profilePic from "@/components/Image/undraw_sign_up.svg";
import { Typography, Input,Progress,List,Tooltip   } from 'antd';
import GoogleIcon from '@mui/icons-material/Google';

import { motion } from 'framer-motion';
import { forgotPasswordWithCredentials } from '@/actions/authActions';
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






 const SignIn = ({callbackUrl}: {callbackUrl: string}) => {
  const { register, handleSubmit } = useForm();
  

  const onSubmit = (values: SignInOptions | undefined) => {
    signIn('credentials', { ...values, callbackUrl: `${window.location.origin}/` });
  };

async function handleCredentialsLogin(formData: any) {
  const email =formData.get('email')
  const password =formData.get('password')
  await signIn('credentials', { email, password, callbackUrl })
}

async function handleForgotPassword(formData: any) {
  const email =formData.get('email')
  console.log({email})
  const res =await forgotPasswordWithCredentials({email})
  if(res?.msg) alert(res?.msg)
}



const [value, setValue] = useState('');

 

  
  return (
    <>
   <div className="bg-white dark:bg-gray-900 transition-all ease-in-out duration-700">
      <div className="flex justify-center h-screen">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="hidden bg-cover lg:block lg:w-1/3"
        >
          <div className="flex items-center h-full px-20 bg-opacity-40">
            <div>
              <motion.h2 className="text-2xl font-bold text-black sm:text-3xl gap-1" animate={{ scale: [1, 1.05, 1] }}>
                Welcome!
              </motion.h2>

              <Image
                src={profilePic}
                alt="Author's profile picture"
                loading="lazy"
              />
            </div>
          </div>
        </motion.div>

        <motion.div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6 space-y-4" initial={{ x: 100 }} animate={{ x: 0 }} transition={{ type: "spring", stiffness: 120 }}>
          <div className="flex-1">
            <div className="text-center">
              <div className="flex justify-center mx-auto">
                <Typography.Title style={{ margin: 10 }}>
                  Login
                </Typography.Title>
              </div>

              <p className="mt-3 text-gray-500 dark:text-gray-300">
                Need an account? <Link href="/signup">Register</Link>
              </p>
            </div>
            {/* sign in with email-pass */}
            <div className="mt-8 space-y-4">
              <Form action={handleCredentialsLogin}>

                <div className="mb-4">
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-200">
                    Email Address
                  </label>
                  <Tooltip title="Use you previous register email">
                  <Input
                    size="large"
                    placeholder=" Enter your email"
                    prefix={<MailOutlined className="site-form-item-icon" />}
                    name="email"
                    type="email"
                    required
                  />
                  </Tooltip>
                </div>

                <div className="mb-6">
    <label className="block mb-1 text-sm text-gray-600 dark:text-gray-200">
      Password
    </label>
    <Tooltip title="Use a mix of letters, numbers and symbols to create a hard-to-crack password.">
      <Input.Password
        size="large"
        placeholder="Enter your password"
        prefix={<LockOutlined className="site-form-item-icon" />}
        name="password"
        type="password"
        required
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    </Tooltip>
    
  </div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4"
                >
                  <Button
                    value="Login"
                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
           
                  >
                  </Button>
                </motion.div>
              </Form>
                {/*End sign in with email-pass */}

              
                 {/* forget password */}

              <Form action={handleForgotPassword}>

                <div className="mb-4">
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-200">
                    Email Address
                  </label>
                  <Tooltip title="Use you previous register email">
                  <Input
                    size="large"
                    placeholder=" Enter your email"
                    prefix={<MailOutlined className="site-form-item-icon" />}
                    name="email"
                    type="email"
                    required
                  />
                  </Tooltip>
                </div>

                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4"
                >
                  <Button
                    value="Login"
                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
           
                  >
                  </Button>
                </motion.div>
              </Form>
                {/*End sign in with email-pass */}




              {/* sign in with google*/}
              <Button
                value="Login with Google"
                variant="contained"
                onClick={() => signIn('google', { callbackUrl })}
                className="inline-flex items-center justify-center px-4 py-2 bg-white text-black font-bold rounded shadow-md transform transition hover:scale-105 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full mt-4"
              >
                <GoogleOutlined />
              </Button>
               {/*end sign in with google*/}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
</>

 
  )
}
export default SignIn
