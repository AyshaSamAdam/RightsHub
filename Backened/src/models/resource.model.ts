import mongoose, { Document } from "mongoose";


interface IResource extends Document {

       name : string, 
       description : string,
       phone ?: string,
       website ?: string,
       category : "tenantRights" | "employment" | "domesticViolence"| "consumerRights" | "immigration" | "familyLaw"| "criminal"| "general",
       type : "hotline" | "legalAid" | "government" | "nonprofit",
       isNational : boolean ,
       states : Array<string>,
       isCrisis :boolean ,
       isFree : boolean,

}

const resourceSchema = new mongoose.Schema<IResource>({
      name : {
        type : String,
        required : true ,
      },
      description : {
         type : String,
         required : true
      },
      phone : {
        type :String,
        required : false,
      },
      website : {
        type :String,
        required : false,
      },
      category :{
        type : String,
        enum : ["tenantRights", "employment", "domesticViolence", "consumerRights", "immigration", "familyLaw", "criminal", "general" ],
        required : true
      },
      type : {
        type : String,
        enum : ["hotline", "legalAid", "government", "nonprofit"],
        required : true
      }, 
      isNational : {
        type : Boolean,
        required : true,
        default : false    // most resources are state specified 
      }, 
      states : {
        type : [String],
        default : []   // user give California so [CA]
 
      },
      isCrisis : {
        type : Boolean,
        default : false
      },
      isFree : {
        type : Boolean,
        default : false
      }   
}, {timestamps : true })

const   ResourceModel = mongoose.model("Resource", resourceSchema )

export default ResourceModel 