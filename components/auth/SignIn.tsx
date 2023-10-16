/* eslint-disable no-unused-vars */
/* eslint-disable tailwindcss/migration-from-tailwind-2 */
/* eslint-disable tailwindcss/no-custom-classname */
"use client";

import React, { useState } from "react";
import { SignInOptions, signIn } from "next-auth/react";
import Link from "@mui/material/Link";
import { MailOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";

import { useForm } from "react-hook-form";
import Form from "@/components/globals/Form";
import ButtonLoad from "@/components/globals/ButtonLoad";
import Image from "next/image";
import profilePic from "@/public/Image/undraw_sign_up.svg";
import { Typography, Input, Layout, Tooltip, Modal, message } from "antd";

import { motion } from "framer-motion";
import { forgotPasswordWithCredentials } from "@/actions/authActions";

const SignIn = ({ callbackUrl }: { callbackUrl: string }) => {
  const { register, handleSubmit } = useForm();

  // Add new state for "Remember me"

  const onSubmit = (values: SignInOptions | undefined) => {
    signIn("credentials", {
      ...values,
      callbackUrl: `${window.location.origin}/`,
    });
  };

  async function handleCredentialsLogin(formData: any) {
    const email = formData.get("email");
    const password = formData.get("password");
    await signIn("credentials", { email, password, callbackUrl });
  }

  async function handleForgotPassword(formData: any) {
    const email = formData.get("email");
    console.log({ email });
    const res = await forgotPasswordWithCredentials({ email });
    if (res?.msg) {
      message.success(res?.msg);
    }
    if (res?.error) {
      message.error(res?.error);
    }
  }

  const [value, setValue] = useState("");

  /* ฟังก์ชั่นนี้อยู่ในforgot password */

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { Text } = Typography;

  return (
    <>
      <Layout>
        <div className="bg-white transition-all duration-700 ease-in-out dark:bg-gray-900">
          <div className="flex h-screen justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="hidden bg-cover lg:block lg:w-1/3"
            >
              <div className="flex h-full items-center bg-opacity-40 px-20">
                <div>
                  <motion.h2
                    className="gap-1 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-teal-500 to-orange-500 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl"
                    animate={{ scale: [1, 1.05, 1] }}
                  >
                    Welcome!
                  </motion.h2>

                  <Image
                    src={profilePic}
                    alt="Author's profile picture"
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
              className="mx-auto flex w-full max-w-md items-center space-y-4 px-6 lg:w-2/6"
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              <div className="flex-1">
                <div className="text-center">
                  <div className="mx-auto flex justify-center">
                    <Typography.Title
                      style={{ margin: 10 }}
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Login
                    </Typography.Title>
                  </div>

                  <p className="mt-3 text-gray-500 dark:text-gray-300">
                    Need an account? <Link href="/signup">Register</Link>
                  </p>
                </div>
                {/* sign in with email-pass */}
                <div className="mt-8 space-y-4">
                  <Form
                    action={handleCredentialsLogin}
                    className="mt-8 gap-2 space-y-3"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <Tooltip
                        title="Use you previous register email"
                        placement="right"
                      >
                        <Input
                          size="large"
                          placeholder=" Enter your email"
                          prefix={
                            <MailOutlined className="site-form-item-icon" />
                          }
                          name="email"
                          type="email"
                          required
                        />
                      </Tooltip>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <Tooltip
                        title="Use a mix of letters, numbers, and symbols to create a hard-to-crack password."
                        placement="right"
                      >
                        <Input.Password
                          size="large"
                          placeholder="Enter your password"
                          prefix={
                            <LockOutlined className="site-form-item-icon" />
                          }
                          name="password"
                          type="password"
                          required
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        />
                      </Tooltip>
                    </div>

                    {/* forgot password */}

                    <Modal
                      title="Forgot Password"
                      open={isModalVisible}
                      onCancel={() => setIsModalVisible(false)}
                      footer={null}
                    >
                      <Form action={handleForgotPassword}>
                        <div className="mb-4">
                          <label className="mb-1 block text-sm text-gray-600 dark:text-gray-200">
                            Email Address
                          </label>
                          <Tooltip
                            title="Use you previous register email"
                            placement="right"
                          >
                            <Input
                              size="large"
                              placeholder="Enter your email"
                              prefix={
                                <MailOutlined className="site-form-item-icon" />
                              }
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
                          <ButtonLoad
                            htmlType={undefined}
                            value="Submit"
                            className="w-full rounded-lg bg-blue-500 px-4 py-2 tracking-wide text-white transition-colors duration-300 hover:bg-blue-400 focus:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                          />
                        </motion.div>
                      </Form>
                    </Modal>

                    <Text
                      type="secondary"
                      style={{ textAlign: "right", cursor: "pointer" }}
                    >
                      <Text onClick={() => setIsModalVisible(true)}>
                        Forgot Password?
                      </Text>
                    </Text>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-2"
                    >
                      <ButtonLoad
                        htmlType={undefined}
                        value="Login"
                        className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Login
                      </ButtonLoad>
                    </motion.div>
                  </Form>
                  {/* End sign in with email-pass */}

                  <div className="mt-2 flex items-center justify-between">
                    <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>

                    <p className="text-xs uppercase text-gray-500 hover:underline dark:text-gray-400">
                      or sign in with
                    </p>

                    <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
                  </div>

                  {/* sign in with google */}
                  <ButtonLoad
                    htmlType={undefined}
                    icon={<GoogleOutlined />}
                    value="Login with Google"
                    variant="contained"
                    onClick={() => signIn("google", { callbackUrl })}
                    className="mt-4 inline-flex w-full items-center justify-center rounded bg-white px-4 py-2 font-bold text-black shadow-md transition hover:scale-105 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  ></ButtonLoad>
                  {/* end sign in with google */}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    </>
  );
};
export default SignIn;
