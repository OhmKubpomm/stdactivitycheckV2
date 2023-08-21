"use client";
import React from "react";
import Form from "../globals/Form";
import ButtonLoad from "../globals/ButtonLoad";
import { resetPasswordWithCredentials } from "@/actions/authActions";
import { message } from "antd";

const Resetpassword = ({ token }) => {
  async function handleResetPassword(formData) {
    const password = formData.get("password");
    const res = await resetPasswordWithCredentials({ token, password });
    if (res?.msg) {
      message.success(res?.msg);
    }
    if (res?.error) {
      message.error(res?.error);
    }
  }
  return (
    <div>
      <Form action={handleResetPassword}>
        <input type="password" name="password" placeholder="password" />
        <ButtonLoad value="Reset Password" />
      </Form>
    </div>
  );
};

export default Resetpassword;
