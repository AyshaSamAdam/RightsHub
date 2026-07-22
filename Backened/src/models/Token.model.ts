import mongoose, { Document, Types } from "mongoose";



interface IToken extends Document {
    userId : Types.ObjectId,    //  which user this belongs to   
    token : string,  // the hashed otp or reset token
    type : "emailVerification" | "passwordReset",
    expiresAt :  Date     // when this token or otp dies
 
}



const tokenSchema = new mongoose.Schema<IToken>({
      userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
      },
      token : {
        type: String,
        required : true
      },
      type : {
        type : String,
        required : true,
        enum : ["emailVerification", "passwordReset"]
      },
      expiresAt : {
        type : Date,
        required : true,
        index : {expires : 0}        // TTL delets expires token   automatically tells mongoDB automatically delete this document when the current time passes ExpiresAt  this means that the expired tokens  delete themselvs automatically  u never need to manually delete them 

      }
}, {timestamps : true })


const TokenModel  = mongoose.model("Token", tokenSchema)


export default TokenModel