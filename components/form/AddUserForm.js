'use client'
import React,{ useRef } from 'react'
import { createUser } from '@/actions/userActions'
import ButtonLoad from '@/components/globals/ButtonLoad'

import { Form, Input, DatePicker,message,Layout } from 'antd';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Title,Card } from '@tremor/react';


const AddUserForm = () => {
  const router = useRouter()
const { Header, Footer, Sider, Content } = Layout;
  const messageApi = message;
    const formRef =useRef();
    async function handleAction(formData){
      const { name, email, password, Firstname, Lastname, Date, Address, Telephone, image } = formData;

       const res = await createUser({name,email,password,Firstname,Lastname,Date,Address,Telephone,image})
      
       if(res?.msg) {
        message.success(res?.msg)
       }
       if(res?.error){
        message.error(res?.error);
    }
    }
   const onReset = () =>{
   
    formRef.current?.resetFields();
    messageApi.open({
      type: 'success',
      content: 'reset success',
    });
   }
  return (
 
 
   
    <Card className="min-h-screen w-full   flex flex-col glass-container">
    <Form onFinish={handleAction} ref={formRef} className='flex flex-row'>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-row justify-between ">
      <Title className="text-4xl">Add User</Title>
     
        </div>
        <br></br>
        <Form.Item name="name" label="Username" >
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input type="email" placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" label="Password">
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item name="Firstname" label="First Name">
          <Input placeholder="First Name" />
        </Form.Item>
        <Form.Item name="Lastname" label="Last Name">
          <Input placeholder="Last Name" />
        </Form.Item>
        <Form.Item name="Date" label="Date">
          <DatePicker />
        </Form.Item>
        <Form.Item name="Address" label="Address">
          <Input placeholder="Address" />
        </Form.Item>
        <Form.Item name="Telephone" label="Telephone">
          <Input placeholder="Telephone" />
        </Form.Item>
        <Form.Item name="image" label="image" className='flex flex-col'>
          <Input placeholder="image" />
        </Form.Item>
       
        <div className="flex space-x-4">

  <ButtonLoad htmlType="submit" value="Submit" className="bg-blue-500 text-white px-4 py-2 rounded" />
  <ButtonLoad htmlType="button" onClick={onReset} value="Reset" className="bg-blue-300 px-4 py-2 rounded"/>
</div>

      </motion.div>
    </Form>
    <div className="flex space-x-4">
    <ButtonLoad onClick={() => router.back()} value="Go Back" className="bg-gray-300 px-4 py-2 rounded" />
   
    </div>
    </Card>
   
  )
}

export default AddUserForm