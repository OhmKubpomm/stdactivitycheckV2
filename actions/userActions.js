'use server'
import connectdatabase from "@/utils/connectdatabase"
import User from "@/models/Usermodel"
import { revalidatePath } from "next/cache";
import bcrypt from 'bcrypt'
connectdatabase();
export async function createUser(data){
    try{
        // Hash the password first
        const hashedPassword = await bcrypt.hash(data.password, 12);
        
        // Create a new User object with the hashed password
        const newUser = new User({
            ...data,
            password: hashedPassword
        });
      
         
        await newUser.save();
        revalidatePath("/") // ใช้ในการ refresh หน้าเว็บ
        return {...newUser._doc,_id:newUser._id.toString()},{msg:'เพิ่มข้อมูลสำเร็จ'};
         
    } catch(error){
        return { error: error.message }
    }
}
export async function getallUser(searchParams){
  const search = searchParams.search || '';

  const limit =searchParams.limit *1|| 5;
  const page =searchParams.page *1|| 1;
  const skip =searchParams.skip *1|| limit * (page - 1);
    try{
        const allUser = await User.find({name:{$regex:search}})

        .limit(limit).skip(skip)

        const count =await User.find({name:{$regex:search}}).count()
        const totalPage = Math.ceil(count/limit)

      
      
 
       const newData =allUser.map(User =>(
        {
        ...User._doc,
        _id: User._doc._id.toString()
       
       }
       ))
    
         return{allUser:newData,count,totalPage}
    } catch(error){
        return { error: error.message }
    }
}

export async function updateUser({name,email,password,Firstname,Lastname,Date,Address,Telephone,image,id }){
    try{
        const user = await User.findByIdAndUpdate(id, {name,email,password,Firstname,Lastname,Date,Address,Telephone,image}, {new:true});
      
        revalidatePath("/")
    
        return {...user._doc, _id:user._id.toString(),msg:'แก้ไขข้อมูลสำเร็จ'}
        
        
    } 
    catch(error){
        return { error: error.message }
    }
}


export async function deleteUser(userId){
    try{
        const user = await User.findByIdAndDelete(userId,{new:true})
        revalidatePath("/")
   
    return {...user._doc, _id:user._id.toString()}
  }  catch(error){
            return { error: error.message }
        }
    }

export async function getoneUser(userId){
    try{
        const user = await User.findById(userId);
        return {...user._doc, _id:user._doc._id.toString()};
    }
    catch(error){
        return { error: error.message }
    }
}
