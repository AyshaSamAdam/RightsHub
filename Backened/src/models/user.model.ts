import mongoose, { Document } from "mongoose";

interface IUser extends Document    {
    firstName : string,
    lastName : string,
    email : string,
    password?: string, 
    googleId ?: string,
    authProvider : "email" | "google"
    emailVerified : boolean,
    createdAt : Date,
    updatedAt : Date

}

const userSchema = new mongoose.Schema<IUser>({

      firstName : {
         type : String,
         required : [true, "First Name is required "],
         minlength : [2, "FirstName must be at least 2 characters"],
         maxlength : [50, "FirstName cannot exceed 50 characters"],
         match : [/^[a-zA-Z\s'-]+$/, 'First name contains invalid Characters'],
         trim : true
      },
      
      lastName : {
         type : String,
         required : [true, "Last Name is required "],
         minlength : [2 , "lastName must be atleast 2 characters "],
         maxlength : [50, 'lastName  cannot exceed 50 characters'],
         match : [/^[a-zA-Z\s'-]+$/, 'Last name contains invalid Characters'],
         trim : true
      },
      email : {
        type : String,
        unique : true,
        required : [true, "Email is Required"],
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        minlength : [6, "Email is too short"],
        maxlength : [254, "Email cannot Exceed 254 characters"],
        trim : true,
        lowercase : true
      },
      password : {
        type : String,
        select : false      //  never return by default
      },
      emailVerified : {
        type : Boolean,
        default : false
      },
      googleId : {
        type : String,
        sparse : true,      
        unique : true       // no two documents can have the same value  but it also means no two documents can have  null/undefned
//  problem email users have no google ID i mean people who used register or login form  insted of google OAuth  so if unique true with sparse suppose second email user created mongodb says we already have  a use rwith no google id (unique true) no other user can have no google id bcz one of our user have no google id which is unique  mongoDB says duplicate null values! Error only one user can have no google Id so we use sparse true sparse true fixes this        },
      //  sparse true fixes it by syaing only enforce this uniqueness on documents that actually have this field email user with no google id  -> ignored      google user with google id  -> must be unique 
      },
      authProvider : {
        type : String,
        enum : ["email", "google"],     //  "email"  => signed up with form
        default : "email"                // "google"  => Signed Up / Login In with google button
      }



}, {timestamps : true})


const userModel = mongoose.model("User", userSchema)

export default  userModel