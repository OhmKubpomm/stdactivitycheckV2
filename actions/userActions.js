'use server'
import connectdatabase from "@/utils/connectdatabase"
import User from "@/models/Usermodel"
import { revalidatePath } from "next/cache";
connectdatabase();
export async function createUser(data){
    try{
        const newUser = new User(data);
        
        await newUser.save();
        revalidatePath("/") // ใช้ในการ refresh หน้าเว็บ
        return {...newUser._doc,_id:newUser._id.toString()},{msg:'เพิ่มข้อมูลสำเร็จ'};
         
    } catch(error){
        return { error: error.message }
    }
}
export async function getallUser(){
    try{
        const allUser = await User.find();
 
       const newData =allUser.map(User =>(
        {
        ...User._doc,
        _id: User._doc._id.toString()
       
       }
       ))
    
         return{allUser:newData}
    } catch(error){
        return { error: error.message }
    }
}