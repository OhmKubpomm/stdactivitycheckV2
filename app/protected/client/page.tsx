
'use client'
import {useSession} from 'next-auth/react'

const Protectpageclient = () => {
  const {data:session} = useSession()
  console.log(session);
  return (
    <div>Protectpageclient
        <p>{session?.user?.name}</p>
    </div>
  
  )
}
export default Protectpageclient