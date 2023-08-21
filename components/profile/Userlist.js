import React from 'react'
import Usercard from '@/components/profile/Usercard'
const Userlist = ({allUser}) => {
    return (
        <div>{
                allUser.map((User) => {
                    return <Usercard key={User._id} User={User}/>
                }) 
            }       
                </div>
    )
}

export default Userlist 