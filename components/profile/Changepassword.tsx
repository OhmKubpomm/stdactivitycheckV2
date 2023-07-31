import React from 'react'
import Form from '../globals/Form'
import Button from '../globals/Button'
import { changePasswordWithCredentials } from '@/actions/authActions'

const Changepassword = () => {
   
        async function handleChangepassword(formData: { get: (arg0: string) => any }) {
            const old_pass = formData.get('old_pass')
            const new_pass = formData.get('new_pass')
           const res = await changePasswordWithCredentials({ old_pass, new_pass })
           if(res?.msg) alert(res?.msg)
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