'use client'
import React from 'react'
import Form from '../globals/Form'
import Button from '../globals/Button'
import { resetPasswordWithCredentials } from '@/actions/authActions'



const Resetpassword = ({token}) => {
        async function handleResetPassword(formData){
                const password =formData.get('password')
                const res = await resetPasswordWithCredentials({token,password})
                if(res?.msg) alert(res?.msg)
        }
  return (
    <div>
        <Form action={handleResetPassword}>
            <input type="password" name="password" placeholder="password" />
            <Button value="Reset Password" />
            </Form>
    </div>
  )
}

export default Resetpassword