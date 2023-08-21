'use client'
import React,{ useRef } from 'react'
import { createUser } from '@/actions/userActions'
import ButtonLoad from '../globals/ButtonLoad'
import { message } from 'antd'
const EditUserForm = () => {
    const formRef =useRef()
    async function handleAction(formData){
        const name =formData.get('name') 
        const email =formData.get('email')
        const password =formData.get('password')
        const Firstname =formData.get('Firstname')
        const Lastname =formData.get('Lastname')
        const Date =formData.get('Date')
        const Address =formData.get('Address')
        const Telephone =formData.get('Telephone')
        const image =formData.get('image')


       const res = await createUser({name,email,password,Firstname,Lastname,Date,Address,Telephone,image})
       formRef.current.reset()
       if(res?.msg) {
        message.success(res?.msg)
       }
       if(res?.error){
        message.error(res?.error);
    }
    }
   
  return (

    <form action={handleAction} ref={formRef}>
        <input type="text" name="name"/>username
        <input type="text" name="email"/>email
        <input type="text" name="password"/>pass
        <input type="text" name="Firstname"/>firstname
        <input type="text" name="Lastname"/>email
        <input type="text" name="Date"/>date
        <input type="text" name="Address"/>address
        <input type="text" name="Telephone"/>telephone
        <input type="text" name="image"/>image
        <ButtonLoad  value="sss"/>
      </form>
   
    
   
  )
}

export default EditUserForm