import dotenv  from "dotenv"
import mongoose from "mongoose"
import ResourceModel from "../models/resource.model"
dotenv.config()





// This is a JS array containing all the organisation objects {} we wanna add
// each object {} = one resoource document that wil be saved to MONGODB
//  like a shoppin list of organisations to add tp teh database
const resources = [
    //  CRISIS AND GENERAL
    {
         name :"211 Helpline",
         description : "Free 24/7 service connecting people to local food, housing, employment, health and legal resources",
         phone : "211",
         website : "211.org",
         category : "general",
         type : "hotline",
         isNational :true,
         states : [] ,
         isCrisis : true,
         isFree : true
    },
    {
        name : "Legal Services Corporation",
        description : "Find free civil legal aid near you.Helps low-income Americans with housing, family, consumer and employment issues. ",
        website : 'lsc.gov/find-legal-aid',
        category : "general",
        type : "nonprofit",
        isNational : true,
        states : [],
        isCrisis : false,
        isFree : true
    },
    //  DOMESTIC VIOLENCE 
     {
    name: "National Domestic Violence Hotline",
    description: "24/7 confidential crisis support, safety planning and local shelter referrals for DV survivors",
    phone: "1-800-799-7233",
    website: "thehotline.org",
    category: "domesticViolence",
    type: "hotline",
    isNational: true,
    states: [],
    isCrisis: true,
    isFree: true
},
{
    name: "RAINN - Sexual Assault Hotline",
    description: "24/7 confidential support for sexual assault survivors. Connects to local crisis centers",
    phone: "1-800-656-4673",
    website: "rainn.org",
    category: "domesticViolence",
    type: "hotline",
    isNational: true,
    states: [],
    isCrisis: true,
    isFree: true
},
//  TENANT RIGHT
{
    name: "HUD Housing Counseling",
    description: "Free housing counseling for renters facing eviction, discrimination or unsafe living conditions",
    phone: "1-800-569-4287",
    website: "hud.gov/findacounselor",
    category: "tenantRights",
    type: "government",
    isNational: true,
    states: [],
    isCrisis: false,
    isFree: true
},
{
    name: "National Housing Law Project",
    description: "Legal resources and advocacy for low-income tenants facing eviction and housing discrimination",
    website: "nhlp.org",
    category: "tenantRights",
    type: "nonprofit",
    isNational: true,
    states: [],
    isCrisis: false,
    isFree: true
},
//  EMPloyment 
{
    name: "US Department of Labor",
    description: "File complaints about unpaid wages, overtime violations, workplace safety and labor law violations",
    phone: "1-866-487-9243",
    website: "dol.gov",
    category: "employment",
    type: "government",
    isNational: true,
    states: [],
    isCrisis: false,
    isFree: true
},
{
    name: "Equal Employment Opportunity Commission",
    description: "File workplace discrimination complaints based on race, gender, age, religion or disability",
    phone: "1-800-669-4000",
    website: "eeoc.gov",
    category: "employment",
    type: "government",
    isNational: true,
    states: [],
    isCrisis: false,
    isFree: true
},
//  CONSUMER RIGHTS 
{
    name: "Consumer Financial Protection Bureau",
    description: "File complaints about banks, debt collectors, credit cards, mortgages and predatory lenders",
    phone: "1-855-411-2372",
    website: "consumerfinance.gov",
    category: "consumerRights",
    type: "government",
    isNational: true,
    states: [],
    isCrisis: false,
    isFree: true
},
{
    name: "Federal Trade Commission",
    description: "Report scams, fraud, identity theft and unfair business practices",
    phone: "1-877-382-4357",
    website: "ftc.gov/complaint",
    category: "consumerRights",
    type: "government",
    isNational: true,
    states: [],
    isCrisis: false,
    isFree: true
},
// IMMIGRATION 
{
    name: "USCIS Contact Center",
    description: "Official immigration services helpline for case status, applications and immigration questions",
    phone: "1-800-375-5283",
    website: "uscis.gov",
    category: "immigration",
    type: "government",
    isNational: true,
    states: [],
    isCrisis: false,
    isFree: true
},
{
    name: "National Immigration Law Center",
    description: "Legal resources and advocacy protecting rights of low-income immigrants",
    website: "nilc.org",
    category: "immigration",
    type: "nonprofit",
    isNational: true,
    states: [],
    isCrisis: false,
    isFree: true
},
//  FAMILY LAW
{
    name: "Childhelp National Child Abuse Hotline",
    description: "24/7 crisis intervention for child abuse victims and those concerned about a child's safety",
    phone: "1-800-422-4453",
    website: "childhelp.org",
    category: "familyLaw",
    type: "hotline",
    isNational: true,
    states: [],
    isCrisis: true,
    isFree: true
},
{
    name: "National Domestic Violence Hotline - Family",
    description: "Support for family law issues involving domestic violence including custody and protective orders",
    phone: "1-800-799-7233",
    website: " ",
    category: "familyLaw",
    type: "hotline",
    isNational: true,
    states: [],
    isCrisis: false,
    isFree: true
},
//  CRIMINAL 
{
    name: "National Legal Aid and Defender Association",
    description: "Find public defenders and free criminal legal representation for those who cannot afford an attorney",
    website: "nlada.org",
    category: "criminal",
    type: "nonprofit",
    isNational: true,
    states: [],
    isCrisis: false,
    isFree: true
},
{
    name: "Innocence Project",
    description: "Legal help for wrongfully convicted people. DNA testing and post-conviction legal assistance",
    website: "innocenceproject.org",
    category: "criminal",
    type: "nonprofit",
    isNational: true,
    states: [],
    isCrisis: false,
    isFree: true
},
]



async function seedResources() {
     try{
        await mongoose.connect(process.env.MONGO_URI as string)   // bcz typecsript doesnt know for sure  mongo_uri exists in .env
        console.log("Connected to DB from SEED ")

        //  delete all existing resoirces first 
        // why 
        // if u run the seed file twice 
        // without this : 32 resources (duplictes !)
        // with this always exactly 16 resources 
        // {} means match everything = delete all clean slate before inserting fresh data 
         await ResourceModel.deleteMany({})
         console.log("Cleared Exisiting resources")



          // insert all of our organization at once 
         await ResourceModel.insertMany(resources)
         console.log(`Seeded ${resources.length} resources`)

         process.exit(0) //  tells node js we re done close everything 0 = success  (no errors )
     }
      
     catch(error ) {
         console.log("Seeding Failed ", error)
         process.exit(1)
     }
}


seedResources() 