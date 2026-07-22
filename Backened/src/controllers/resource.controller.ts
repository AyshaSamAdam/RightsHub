import { Request, Response } from "express"
import {redisClient}  from '../config/redis'
import ResourceModel from "../models/resource.model"



async function getResourcesController(req :Request, res:Response) {
    try{
         const {category, state} = req.query


        //  const cachedKey = the name of what we are storing in redis 
        const cachedKey = `rightshub:resources:${category || 'all'}:${state || "all"}`


        // before Going To MongoDB hey Redis do u have a container labeled 'rightshub:resources:tenantRights:CA'
        const cached = await redisClient.get(cachedKey)

        //cached = whats inside the container 
        // all the matching resources(as text)  null if container doesnt exist
         
        // IF YES  exists
        if (cached){
               return res.json(JSON.parse(cached))   //JSON.parse(cached ) redis stores text  json.parse converts text back to js ojects we acn use
        }

        //  If NOT exists in REDIS (cache miss) It needs to ask MONGODB instead
        // mongoDb query = a Filter for the databse 
        // show me only documents taht match these conditions 

        const query : any = {}
        // start with empty filter match everything 

//  query is simple object empty {}
// query = {}
// after this line 
//  if (category) query.category = category
// query = {category : 'tenantRights'}
        if (category) query.category = category




// query = {category : 'tenantRights', $or : [{isNational : true} , {state : state}]}
        if (state) query.$or = [
            {isNational : true},
            {states : state}
        ]


        //  serach the resources collection return all documents matching our filter state / category

        const resources = await ResourceModel.find(query)

        // WE GOT RESULTS FROM MONGODB NOW SAVE TO REDIS SO NEXT TIME WE DON'T NEED MONGODB 
                    //  the label     converts to js object to text agian cuz redis only stores text expires in 1 hour after 1 hour redis delets thsi automatically next request goes to mongoDB agian gets fresh data in case we added new resources 
        await redisClient.set(cachedKey, JSON.stringify(resources), {EX : 60 * 60})

        return res.status(200).json({
            message : "Resources Fetched!",
            resources
        })


    }
    catch(error: any) {
        
        return res.status(500).json({
            message: "eror while fetching the resources !"
        })

    }
}



export default getResourcesController














// User selects: Tenant Rights + California
// Clicks Get Help

// BACKEND:
// 1. category = "tenantRights", state = "CA"
// 2. cacheKey = "rightshub:resources:tenantRights:CA"
// 3. Check Redis → EMPTY (first time)
// 4. Query MongoDB:
//    "find resources where category = tenantRights
//     AND (isNational = true OR states has CA)"
// 5. MongoDB returns: [HUD Housing, National Housing Law...]
// 6. Save to Redis with label + 1 hour expiry
// 7. Return resources to frontend

// NEXT USER asks same thing:
// 1. cacheKey = "rightshub:resources:tenantRights:CA"
// 2. Check Redis → FOUND! (saved from last time)
// 3. Return immediately
// 4. MongoDB never touched 