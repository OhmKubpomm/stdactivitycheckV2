import { Schema,model,models,mongoose } from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    
    },
    image:{
        type:String,
    },
    Firstname:{
        type:String,
    },
    Lastname:{
        type:String,
    },
    Date:{
        type:String,
    },
    Telephone:{
        type:String,
    },
    Address:{
        type:String,
    },
    role:{
        type:String,
        default:'user',
    },
    provider:{
        type:String,
        default:'credentials',
    },
},{timestamps:true});


const User = mongoose.models.users || mongoose.model('users', UserSchema);

export default User;
