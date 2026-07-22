import { z } from 'zod'

export const registerSchema = z.object({

           firstName: z.string().trim().min(2, "First Name must be atleast 2 characters ")
           .max(50, "FirstName cannot exceed 50 characters")
           .regex(/^[a-zA-Z\s'-]+$/, "First name contains invalid characters"),


              lastName : z.string().trim().min(2, "lastName must be atleast 2 characters")
              .max(50, "lastName cannot exceed 50 characters")
              .regex(/^[a-zA-Z\s'-]+$/, "Last name contains invalid characters"),




              email : z.string().trim().toLowerCase().email("Please enter a  Valid email")
              .min(6, "Email is too short")
              .max(254, "Email cannot Exceed 254 characters"),


             password :  z.string()
             .min(6, "Password must be at least 6 charcters ")
             .max(12, "Password cannot exceed 12 characters ")


})


export const loginSchema = z.object({
      email : z.string()
      .trim().toLowerCase()
      .email("Invalid Email or Password")
      .min(6, "email is too short")
      .max(254,  "Email cannot Exceed 254 characters"),

    //    for login specifiaccly min/max on password isnt necessary 
    // what if someone type s a 5- charcater password, its just wrong 
    // the error should be " invalid email or password " not "password too short "
    //    you dont want to help the attackers figure out password length requirements during login 


      password : z.string()
       .min(1, "Password is required")


})



export const forgotPasswordSchema = z.object({
    email : z.string()
    .trim()
    .toLowerCase()
     .email ("please enter a valid email ")
    .min(6, "Email is too short")
    .max(254, "Email cannot Exceed 254 characters")
})



export const resetPasswordSchema = z.object({
             resetToken : z.string(),

             newPassword : z.string()
              .min(6, "Password must be atleast 6 charcters ")
              .max(12, "Password cannot exceed 12 characters ")

})



export const verifyOTPSchema = z.object({
      otp : z.string().length(6, "OTP Must be 6 digits")


})








//                           REQUIRED  TRUE IN zOD 
//  Z.STRING() IN ZOD MEANS THAT THIS FIELD MUST EXIST REQUIRED() MUST BE A STRING CANNOT BE UNDEFINED OR NULL  SO THATS WHY WE DONT MENTION REQUIRED TRUE IN ZOD VALIDATION AS WE DO IN MONGOD DATRABASE )


                            //    UNIQUE 

// UNIQUE     nOT  ZOD THING 
// UNIQUE TRUE MEANS NO TWO USERS CAN HAVE THE SAME EMAIL IN THE DATABASE

// ZOD CANNOT CHECK THIS WHY ? BECAUSE ZOD RUNS BEFORE TOUCHING THE DATABASE IT HAS NO IDEAS WHATS ALREADY STORED IN MONGOdB 

// UNIQUE IS ONLY ENFORCED AT THE DATABASE LEVEL (MONGOOSE/MONGODB)


// YOUR MONGOOSE SCHEMA  ALREADY HANDLES THIS EMAIL : { UNIQUE : TRUE }

// ZOD DOESNT NEED TO WORRY ABOUT IT 





//                              EMAILL
  
// YOUR MONGOOSE SCHEMA HAS MATCH : [/38+$/+jJS434989, "VALID EMIAL"]
// IN ZOD .EMAIL("PLEASE ENTER  A VALID EMAIL ")

// .EMIAL IS A  BUILTIN ZOD VALIDATOR MORE THOROUGH THAN YOUR REGEX NO NEE DTO WRITE THE REGEX YOURSELF 

// SO ZOD REPLACES THE MONGOOSE MATCH WITH A  BETTERVERSION 




