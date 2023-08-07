'use server'
import connectdatabase from "@/utils/connectdatabase"
import User from "@/models/Usermodel"
connectdatabase();
export async function createUser(data){
    try{
        const newUser = new User(data);
        await newUser.save();
        return {...newUser._doc,_id:newUser._id.toString()};
    } catch{error}{
        throw new Error(error.message)
    }
}