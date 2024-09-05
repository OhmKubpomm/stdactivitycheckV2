/* eslint-disable camelcase */
import React from "react";
import Form from "../globals/Form";
import ButtonLoad from "@/components/globals/ButtonLoad";
import { changePasswordWithCredentials } from "@/actions/authActions";
import { message } from "antd";

const Changepassword = () => {
  async function handleChangepassword(formData: {
    get: (arg0: string) => any;
  }) {
    const oldPass = formData.get("oldPass");
    const newPass = formData.get("newPass");
    const res = await changePasswordWithCredentials({ oldPass, newPass });
    if (res?.msg) {
      message.success(res?.msg);
    }
  }

  return (
    <div>
      <h1>Change Password</h1>
      <Form action={handleChangepassword}>
        <input type="password" name="oldPass" placeholder="password" />
        <input type="password" name="newPass" placeholder="password" />
        <ButtonLoad value="Change Password" htmlType={undefined} />
      </Form>
    </div>
  );
};

export default Changepassword;
