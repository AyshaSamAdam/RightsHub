import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
    apiKey : process.env.ANTHROPIC_API_KEY
})


 async function generateLegalEducation(description: string, state : string, category : string, resources : any[]) {

  
  return `based on your situation in ${state} here is the genaral info about yout rights `


// Claude reads TEXT not Javascript arrays  as resources is [] of objects checks seed file  We need to convert our array into a readable format Claude undertands 

// BEFORE CONVERSION
// {name : "HUD HOUSING", phone :"1-800-567-5843"}
// {name : "National Housing Law", website : "nhlp.org"}

// AFTER CONVERSION
// HUDD Housing : 1-800-567-5843
// NATIONAL HOUSING LAW : setHeapSnapshotNearHeapLimit.org


  const resourceList = resources.map(r => `-${r.name}: ${r.phone || ''} ${r.website || ''}`).join('\n')  // .map gives u an array but Claude reads TEXT, not arrays .join(/n) joins all items into one  string with a new line between each 
    

    const prompt = `You are a legal rights educator for RightsHub, 
        an educational platform helping Americans understand their rights.

        SITUATION:
        A person in ${state} is dealing with a ${category} issue.
        Their description: "${description}"

        VERIFIED RESOURCES AVAILABLE:
        ${resourceList}

        YOUR TASK:
        1. Provide general educational information about their rights 
        in ${state} related to ${category}
        2. Explain what laws generally protect them in this situation
        3. Suggest general steps they can take
        4. Reference ONLY the organizations listed above - never invent names or numbers
        5. Keep language simple - assume no legal knowledge

        STRICT RULES:
        - Never give specific legal advice for their exact situation
        - Never say "you will win" or guarantee outcomes
        - Never invent laws, statute numbers, or organizations
        - Always recommend consulting a real lawyer for their specific case
        - If situation involves immediate danger, mention crisis resources first

        END YOUR RESPONSE WITH THIS EXACT DISCLAIMER:
        "⚠️ This information is for educational purposes only and is not legal advice. 
        Every situation is unique. Please contact one of the resources above or 
        consult a licensed attorney in ${state} for guidance specific to your situation."
        `




    const response = await client.messages.create({
        model : "claude-haiku-4-5",
        max_tokens : 1024,
        messages : [
           {
             role : 'user',
            content : prompt
           }
        ]
         
    })    



  const text = (response.content[0] as any).text 
  return text


 } 


 export {generateLegalEducation}