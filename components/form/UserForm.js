'use client'
import React,{ useRef } from 'react'
import { createUser } from '@/actions/userActions'
import Button from '../globals/Button'
const UserForm = () => {
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

        await createUser({name,email,password,Firstname,Lastname,Date,Address,Telephone,image})
       formRef.current.reset()
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
        <Button  value="sss"/>
      </form>
   
    
   
  )
}

export default UserForm