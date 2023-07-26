"use client";
import { signUpWithCredentials } from "@/actions/authActions";
import React, { useState } from "react";
import Image from "next/image";
import profilePic from "@/components/Image/undraw_sign_up.svg";
import { motion } from "framer-motion";
import { Typography, Input } from 'antd';
import { MailOutlined, UserOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import Link from "next/link";
import Form from "@/components/globals/Form";
import Button from "@/components/globals/Button";

const SignUp = () => {
 

  async function handleSignupcredential(formData) {
    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')
    const res = await signUpWithCredentials({ name, email, password })
    if(res?.msg) alert(res?.msg)
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="flex justify-center h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="hidden bg-cover lg:block lg:w-1/3"
        >
          <div className="flex items-center h-full px-20  bg-opacity-40">
            <div>
              <motion.h2 className="text-2xl font-bold text-black sm:text-3xl gap-1" animate={{ scale: [1, 1.05, 1] }}>
                สวัสดี ยินดีต้อนรับ!
              </motion.h2>

              <Image
                src={profilePic}
                alt="Picture of the author"
                loading="lazy"
              />

            </div>
          </div>
        </motion.div>

        <motion.div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6" initial={{ x: 100 }} animate={{ x: 0 }} transition={{ type: "spring", stiffness: 120 }}>
          <div className="flex-1">
            <div className="text-center">
              <div className="flex justify-center mx-auto">
                <Typography.Title style={{ margin: 10 }}>
                  สมัครผู้ใช้งาน
                </Typography.Title>
              </div>

              <p className="mt-3 text-gray-500 dark:text-gray-300">
                มีบัญชีอยู่แล้ว? <Link href="/signin">เข้าสู่ระบบ</Link>
              </p>
            </div>

            <div className="mt-8">

              <Form action={handleSignupcredential}>
                <div className="mb-4">
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-200">
                    ชื่อผู้ใช้งาน
                  </label>
                  <Input
                    size="large"
                    placeholder="กรุณาใส่ชื่อผู้ใช้งาน"
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    name="name"
                    type="text"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-200">
                    ที่อยู่ อีเมล
                  </label>
                  <Input
                    size="large"
                    placeholder=" กรุณาใส่อีเมล"
                    prefix={<MailOutlined className="site-form-item-icon" />}
                    name="email"
                    type="email"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-200">
                    รหัสผ่าน
                  </label>
                  <Input
                    size="large"
                    placeholder=" กรุณาใส่รหัสผ่าน"
                    prefix={<EyeInvisibleOutlined className="site-form-item-icon" />}
                    name="password"
                    type="password"
                  />
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4"
                >
                  <Button
                   value="สมัครสมาชิก"
                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  >
                   
                  </Button>
                </motion.div>
              </Form>
        
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default SignUp;
