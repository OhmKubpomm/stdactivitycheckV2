"use client";
import { signUpWithCredentials } from "@/actions/authActions";
import React, { useState } from "react";
import Image from "next/image";
import profilePic from "@/public/Image/undraw_sign_up.svg";
import { motion } from "framer-motion";
import { Typography, Input, List, Tooltip, Progress, message,Layout } from "antd";
import {
  MailOutlined,
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

import Link from "next/link";
import Form from "@/components/globals/Form";
import ButtonLoad from "@/components/globals/ButtonLoad";

const SignUp = () => {
  const { Text } = Typography;

  const requirements = [
    { re: /[0-9]/, label: "Includes number" },
    { re: /[a-z]/, label: "Includes lowercase letter" },
    { re: /[A-Z]/, label: "Includes uppercase letter" },
    { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
  ];

  function getStrength(password) {
    let multiplier = password.length > 5 ? 0 : 1;

    requirements.forEach((requirement) => {
      if (!requirement.re.test(password)) {
        multiplier += 1;
      }
    });

    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
  }
  const [value, setValue] = useState("");

  const strength = getStrength(value);
  const checks = requirements.map((requirement, index) => (
    <List.Item key={index}>
      {requirement.re.test(value) ? (
        <CheckCircleOutlined style={{ color: "green" }} />
      ) : (
        <CloseCircleOutlined style={{ color: "red" }} />
      )}
      <Text className="ml-2 text-sm text-gray-600 dark:text-gray-200">
        {requirement.label}
      </Text>
    </List.Item>
  ));

  const progressStatus = value.length > 0 ? "active" : "normal";

  async function handleSignupcredential(formData) {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const res = await signUpWithCredentials({ name, email, password });
    if (res?.msg) {
      message.success(res?.msg);
    }
    if (res?.error) {
      message.error(res?.error);
    }
  }

  return (
    <Layout>

   
    <div className="bg-white dark:bg-gray-900 transition-all ease-in-out duration-700">
      <div className="flex justify-center h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="hidden bg-cover lg:block lg:w-1/3"
        >
          <div className="flex items-center h-full px-20  bg-opacity-40">
            <div>
              <motion.h2
                className="text-2xl font-bold bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-teal-500 to-orange-500 text-transparent bg-clip-text sm:text-3xl gap-1"
                animate={{ scale: [1, 1.05, 1] }}
              >
                สวัสดี ยินดีต้อนรับ!
              </motion.h2>

              <Image
                src={profilePic}
                alt="Picture of the author"
               
                loading="lazy"
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
                width={200}
                height={100}
              
               
                quality={60}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6 space-y-4 "
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <div className="flex-1">
            <div className="text-center">
              <div className="flex justify-center mx-auto">
                <p style={{ margin: 10 }} className="font-bold text-2xl">
                  สมัครผู้ใช้งาน
                </p>
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
                  <Tooltip title="Use a mix of letters, numbers and symbols to create a hard-to-crack password.">
                    <Input.Password
                      size="large"
                      placeholder="Enter your password"
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      name="password"
                      type="password"
                      required
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </Tooltip>
                  <Progress
                    percent={strength}
                    status={progressStatus}
                    showInfo={false}
                    strokeColor={{
                      "0%": "#108ee9",
                      "100%": "#87d068",
                    }}
                    className="my-3"
                  />
                  <List split={false}>
                    <List.Item>
                      {value.length > 5 ? (
                        <CheckCircleOutlined style={{ color: "green" }} />
                      ) : (
                        <CloseCircleOutlined style={{ color: "red" }} />
                      )}
                      <Text className="ml-2 text-sm text-gray-600 dark:text-gray-200">
                        Has at least 6 characters
                      </Text>
                    </List.Item>
                    {checks}
                  </List>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4"
                >
                  <ButtonLoad
                    value="สมัครสมาชิก"
                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  ></ButtonLoad>
                </motion.div>
              </Form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    </Layout>
  );
};
export default SignUp;
