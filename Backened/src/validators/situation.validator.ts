import {z} from 'zod'



export const situationSchema= z.object({
    description : z.string().min(10, "Please Describe Your situation in atleast 10 characters"),
    state : z.string().length(2, "Please provide a valid 2-letter state code"),
    category : z.enum(["tenantRights", "employment", "domesticViolence", "consumerRights", "immigration", "familyLaw", "criminal", "general" ] 
        , {error : () => ({
            message : "Please select a valid category"
        })})

})