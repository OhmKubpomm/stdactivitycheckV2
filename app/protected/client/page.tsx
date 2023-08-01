
'use client'
import Usernavbar from '@/components/profile/Usernavbar';
import {useSession} from 'next-auth/react'

const Protectpageclient = () => {
  const {data:session} = useSession()
  console.log(session);
  return (
  <Usernavbar/>
  
  )
}
export default Protectpageclient