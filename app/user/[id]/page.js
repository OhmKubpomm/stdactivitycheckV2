
import { getoneUser } from '@/actions/userActions'
import Usercard from '@/components/profile/Usercard';
import React from 'react'

const GetoneuserDetails   = async  ({params:{id}, searchParams}) => {
    const user =await getoneUser(id);
  return (
    <div>{user && <Usercard user={user} />}
    </div>
  )
}

export default GetoneuserDetails