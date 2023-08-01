import React from 'react'
import Form from '../globals/Form'
import Button from '../globals/Button'
import { changePasswordWithCredentials } from '@/actions/authActions'
import { message } from 'antd'

const Changepassword = () => {
   
        async function handleChangepassword(formData: { get: (arg0: string) => any }) {
       
            const old_pass = formData.get('old_pass')
            const new_pass = formData.get('new_pass')
           const res = await changePasswordWithCredentials({ old_pass, new_pass })
           if(res?.msg) {
            message.success(res?.msg)
           }
           if(res?.error){
            message.error(res?.error);
        }
          }
         
    

  return (
    <div>
        <h1>Change Password</h1>
  <Form action={handleChangepassword}>
        <input type="password" name="old_pass" placeholder="password" />
        <input type="password" name="new_pass" placeholder="password" />
        <Button value="Change Password" />
        </Form>

    </div>
  
  )
}

export default Changepassword