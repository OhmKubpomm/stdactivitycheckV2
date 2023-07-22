import { Schema,model,models } from "mongoose";

const UserSchema = new Schema({
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
    user_firstname:{
        type:String,
    },
    user_lastname:{
        type:String,
    },
    user_date:{
        type:Date,
    },
    user_telephone:{
        type:String,
    },
    user_address:{
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


UserSchema.pre('save', function(next) {
    if (this.email === null || this.email === undefined) {
      this.email = `default_${Date.now()}`;  // assign a unique default value
    }
    next();
  });

const User= models.User || model('User',UserSchema);
export default User;
