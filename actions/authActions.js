'use server'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth/next"
import User from "@/models/Usermodel"
import { redirect } from "next/navigation"
import bcrypt from 'bcrypt'
import { generateToken, verifyToken } from "@/utils/token"
import  sendEmail from "@/utils/sendEmail"


const BASE_URL = process.env.NEXTAUTH_URL;

export async function updateUser({name,image}){
    const seesion =await getServerSession(authOptions)
    if(!session) throw new Error('Unauthorized')
 try{
    const user = await User.findByIdAndUpdate(session?.user?._id,{
        name,image
    },{new:true}).select('-password')
    if(!user) throw new Error('Email not found')

    return {msg:'Update success'}

 }   catch(error){
    redirect(`/errors?error=${error.message}`)
 }
}

export async function signUpWithCredentials(data){
try{

   const user= await User.findOne({email:data.email})
   if(user) throw new Error('Email already exists')
   if(data.password){
      data.password = await bcrypt.hash(data.password,12)
   }


   const token = generateToken({user:data})
  
   await sendEmail({
      to:data.email,
      url:`${BASE_URL}/verify?token=${token}`,
      text:'Verify your email'
   })
   



   return {msg:'signup success please check your email to verify your account'}

}   catch(error){
   return {error : error.message}
}
}

export async function verifyWithCredentials(token){
   try{
      const {user} = verifyToken(token)
      const userExist = await User.findOne({email:user.email})
      if(userExist) return {msg:'Verify success'}
      const newUser = new User(user)

     await newUser.save()
   
      return {msg:'signup success'}
   
   }   catch(error){

      redirect(`/errors?error=${error.message}`)
      
   }
   }

export async function changePasswordWithCredentials({old_pass,new_pass}){
  
  
      try{
         const session = await getServerSession(authOptions);
         if(!session) throw new Error('Unauthorized')
         if(session?.user?.provider !== 'credentials') {
      throw new Error(`This account is signed in with ${session?.user?.provider}. You can't Use this feature`)
         }
         const user = await User.findById(session?.user?._id)
      if(!user) throw new Error('Email not found');


         const compare = await bcrypt.compare(old_pass,user.password)
         if(!compare) throw new Error('Old Password not match')

         const newPass = await bcrypt.hash(new_pass,12);
         await User.findByIdAndUpdate(user._id,{password:newPass})
         
      
         return {msg:'Change password success'}
      
      }   catch(error){
   
         return { error: error.message }
         
      }
      }
export async function forgotPasswordWithCredentials({email}){
  
  
         try{
            const user = await User.findOne({email});
     
            if(user?.provider !== 'credentials') {
         throw new Error(`This account is signed in with ${user?.provider}. You can't Use this feature`)
            }
    
         if(!user) throw new Error('Email not found');
   
   
            const token = generateToken({userId:user._id})
            await sendEmail({
               to:email,
               url:`${BASE_URL}/reset_password?token=${token}`,
               text:'Reset your password'
            })
         
            return {msg:'Success submit Please check your email to reset your password'}
         
         }   catch(error){
      
            return { error: error.message }
            
         }
         }
export async function resetPasswordWithCredentials({token,password}){
   try{
      const {userId} = verifyToken(token);
      const newPass = await bcrypt.hash(password,12);
      await User.findByIdAndUpdate(userId, {password:newPass})
      return {msg:'Reset password success'}
   }
   catch(error){
      return { error: error.message }
   }
}