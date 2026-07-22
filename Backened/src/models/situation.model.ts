import mongoose, { Document, Types } from "mongoose";



interface ISituation extends Document {
      userId :Types.ObjectId,
      description : string,
      state : string,
      category : "tenantRights" | "employment" | 
              "domesticViolence" | "consumerRights" | 
              "immigration" | "familyLaw" | 
              "criminal" | "general",
      aiResponse : string,
      resources : Types.ObjectId[],
     createdAt : Date,
     updatedAt : Date
}


const situationSchema = new mongoose.Schema<ISituation>({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
     description : {
        type : String,
        required : true,
     },
     state : {
          type : String,
          required : true,
     },
     category : {
            type : String,
            required : true,
            enum : ["tenantRights", "employment", "domesticViolence", "consumerRights", "immigration", "familyLaw", "criminal", "general" ],
     },
     aiResponse : {
           type : String,
          required : true,
     }, 
     resources : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "Resource",
        default : []
     }

}, {timestamps : true})


const situationModel =  mongoose.model("Situation",situationSchema )
export default situationModel