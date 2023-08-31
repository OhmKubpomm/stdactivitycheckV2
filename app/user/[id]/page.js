'use server'
import { getoneUser } from '@/actions/userActions'
import EditUserForm from '@/components/form/EditUserForm';
import UsercardOne from '@/components/profile/UsercardOne';
import React from 'react'

import Userlist from '@/components/profile/Userlist';
import Usercard from '@/components/profile/Usercard';
const GetoneuserDetails   = async  ({params:{id}, searchParams})  => {
    const User =await getoneUser(id);

  return (
    <div>
      {User &&<UsercardOne User={User} />}
    
    </div>
  )
  
}

export default GetoneuserDetails