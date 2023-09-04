"use client";
import React, { useRef } from "react";
import { updateUser } from "@/actions/userActions";
import ButtonLoad from "../globals/ButtonLoad";
import { useMyContext } from "@/context/provider";
import { useRouter, useSearchParams } from "next/navigation";
import { Form, Input, message } from "antd";
import { Title, Card } from "@tremor/react";
const EditUserForm = () => {

  
  
  const router = useRouter();
  const { editUser } = useMyContext();
  
  const formRef = useRef();
  async function handleAction(formData) {
    const { name, email, password, Firstname, Lastname, Date, Address, Telephone, image } = formData;

    const res = await updateUser({
      name,
      email,
      password,
      Firstname,
      Lastname,
      Date,
      Address,
      Telephone,
      image,
      id: editUser._id,
    });

 
    if (res?.msg) {
      message.success(res?.msg);
    }
    if (res?.error) {
      message.error(res?.error);
    }
  }

  return (
    <>
      <Card className="gap-2"> 
        <Title className="text-2xl font-semibold mb-4">แก้ไขข้อมูล User</Title>
        <Form
          onFinish={handleAction}
          ref={formRef}
          className="flex flex-col space-y-4 p-6 overflow-y-auto"
        >
    
          <div className="space-y-4">
            <Form.Item name="name" label="Username" >
              <Input
                type="text"
                name="name"
                defaultValue={editUser?.name}
                className="border rounded "
              />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input
                type="email"
                name="email"
                defaultValue={editUser?.email}
                className="border rounded"
              />
            </Form.Item>
            <Form.Item name="password" label="Password">
              <Input
                type="password"
                name="password"
                defaultValue={editUser?.password}
                className="border rounded"
              />
            </Form.Item>
          </div>

        
          <div className="flex space-x-4">
            <Form.Item name="Firstname" label="Firstname">
              <Input
                type="text"
                name="Firstname"
                defaultValue={editUser?.Firstname}
                className="border rounded w-full"
              />
            </Form.Item>
            <Form.Item name="Lastname" label="Lastname">
              <Input
                type="text"
                name="Lastname"
                defaultValue={editUser?.Lastname}
                className="border rounded w-full"
              />
            </Form.Item>
          </div>

         
          <div className="space-y-4">
            <Form.Item name="Date" label="Date">
              <Input
                type="date"
                name="Date"
                defaultValue={editUser?.Date}
                className="border rounded"
              />
            </Form.Item>
            <Form.Item name="Address" label="Address">
              <Input
                type="textarea"
                name="Address"
                defaultValue={editUser?.Address}
                className="border rounded"
              />
            </Form.Item>
            <Form.Item name="Telephone" label="Telephone">
              <Input
                type="tel"
                name="Telephone"
                defaultValue={editUser?.Telephone}
                className="border rounded"
              />
            </Form.Item>
            <Form.Item name="image" label="Image">
              <Input
                type="url"
                name="image"
                defaultValue={editUser?.image}
                className="border rounded"
              />
            </Form.Item>

            
          </div>

          <div className="flex space-x-4">
           
            <ButtonLoad
            htmlType="submit"
              value="Submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
           
            />
          </div>
        </Form>
        <ButtonLoad
              onClick={() => router.back()}
              value="go back"
              className="bg-gray-300 px-4 py-2 rounded"
            />
      </Card>
    </>
  );
};

export default EditUserForm;
