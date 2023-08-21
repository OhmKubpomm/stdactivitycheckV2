import AddUserForm from '@/components/form/AddUserForm'
import React from 'react'
import { getallUser } from '@/actions/userActions'
import Userlist from '@/components/profile/Userlist'


const cruduserpage =  async() => {
  
  const {allUser}  = await getallUser();
  return (



     <>
  
       

        
     
    


   
   
        <AddUserForm />


        <div>{allUser && <Userlist allUser={allUser} />}</div>

     
     
    
   
   </>

  
  )
}

export default cruduserpage