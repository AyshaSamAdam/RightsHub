import { Request, Response } from "express";
import {situationSchema} from '../validators/situation.validator'
import ResourceModel from "../models/resource.model";
import {generateLegalEducation} from '../services/ai.service'
import situationModel from "../models/situation.model";


async function situationController(req: Request, res:Response) {

        try {
               // situationSchema =te rulesw we defined 
        // safeParse =  means look at everything user sent check these rules tthat we defined in schema check if tit matches 
        // reqbody = everything user sent 
        // result = always returns an object 
        // {success : true or false  , data : {}}
           const result = situationSchema.safeParse(req.body)

           if (!result.success) {
            return res.status(400).json({
                message : result.error.issues[0]?.message || "Validation Failed"
            }) }


            const {description, state, category} = result.data
//  from ptotrct middleware
            const userId = req.user?.id
    
            // Fetch relevant resources : as query as getResourcesController 


           
            const query : any = {}

            if (category) query.category = category
            if(state) query.$or = [
                {isNational : true},
                {states : state}
            ]


       const resources = await ResourceModel.find(query)

        const aiResponse =   await  generateLegalEducation(description,state, category, resources)


          const situation =  await situationModel.create({
            userId,
            description,
            state,
            category,
            aiResponse,
            resources : resources.map(r => r._id)
         })

         return res.status(201).json({
            message :"Situation Created Succesfully!",
            aiResponse,
            resources,
            situationId : situation._id
         })


        }
        catch(error : any) {
            
            return res.status(500).json({
                message : "Error creating situation"
            })
        }


}


async function getUserSituationController(req: Request, res: Response) {

          try{
               const userId  = req.user?.id
                                                         // createdAt = -1 means 
                                                         // -1 = descending (newest first)
                                                         //  1 = ascending (oldest first)
             const situations = await situationModel.find({userId}).sort({createdAt : -1})
       

             return res.status(200).json({
                message : ' User Situation fetched succesfully !',
                situations

             })

          }
          catch(error) {
            
            return res.status(500).json({
                message : "Error while fetching the situations "
            })
          }
                        
}


export   {situationController,  getUserSituationController}



