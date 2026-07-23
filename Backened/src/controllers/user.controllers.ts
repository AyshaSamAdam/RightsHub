import userModel from "../models/user.model";
import mongoose from "mongoose";
import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { redisClient } from '../config/redis'
import { generateOTP, generateResetToken } from '../utils/otp.utils'
import TokenModel from "../models/Token.model";
import { sendEmailVerificationOTP, sendPasswordResetToken } from "../services/service";
import crypto from 'crypto'
import axios  from "axios";
import {registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, verifyOTPSchema}  from '../validators/auth.validators'
import { safeParse } from "zod";



interface RegisterRequestBody {

    firstName: string
    lastName: string
    email: string
    password: string
}

interface LoginRequestBody {
    email: string
    password: string
}

// CONSTANTS 

//  by default .env se hamare pass jo data atta hai wo string mein atta hai so w econvert it to Number
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10
const OTP_EXPIRY_MINUTES = 10
const OTP_EXPIRY_MS = OTP_EXPIRY_MINUTES * 60 * 1000   
//  OTP EMAIL VERIFICATION EXPIRY TIME We saved it in constant outside controller if in futire we ever wanna change the xpiry time to 15 minutes 



async function registerController(req: Request<{}, {}, RegisterRequestBody>, res: Response) {

    try {
//    safeParse(req.body) means 
  // look at everything user sent in req.body and check if it matches our schema rules(REGISTER SCHEMA), and tell me the result

//   it alsways returns an object 
//  {
//     success : true  or false ,
//     data : { firstName : "john"}
//  }

// Register schema => THE RULES THAT WE DEFINED 
// SAFE PARSE =>     CHECK THESE RULES 
// REQ.BODY => THE DATA USER SENT 

// RESULT >   THE OUTCOME OBJECT (EITHER SUCCESS OR FAIURE )

            const result = registerSchema.safeParse(req.body)


            if (!result.success) {
                return res.status(400).json({
                    message :  result.error.issues[0]?.message  || "validation failed"
                })
            }


            //  why we change req.body to result.data  below bxz 
            // req.body => RAW DAT FROM USER 
            // result.data => CLEANED DATA AFTER ZOD PROCESSING 

//    const { firstName, lastName, email, password } = {req.bdoy}
        const { firstName, lastName, email, password } = result.data

       


        const isEmailAlreadyExist = await userModel.findOne({ email })

        if (isEmailAlreadyExist) {
            return res.status(409).json({
                message: "User with this Email already Exists"
            })
        }



        const hash = await bcrypt.hash(password, SALT_ROUNDS)

        //
        const user = await userModel.create({
            firstName,
            lastName,
            email,
            password: hash
        })

        //  OTP  

        const { otp, hashedOTP } = generateOTP()
        //  after we generate OTP 
        //  delete any existing OTP of this user based on id and type emailverification so the user cant have multiple valid OTP  user can only have one active OTP at a time 

        await TokenModel.deleteMany({
            userId: user._id,
            type: 'emailVerification'
        })


        await TokenModel.create({
            userId: user._id,
            token: hashedOTP,
            type: 'emailVerification',
            expiresAt: new Date(Date.now() + OTP_EXPIRY_MS)
        })


        await sendEmailVerificationOTP(user.email, otp)

        return res.status(201).json({
            message: "Registred Succesfully! Check your email for OTP",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                emailVerified: false
            }
        })


    }
    catch (error: any) {
        if (error instanceof mongoose.Error.ValidationError) {
            const messages = Object.values(error.errors).map((e: any) => e.message)
            return res.status(400).json({ message: messages[0] })
        }

        if (error.code === 11000) {
            return res.status(409).json({
                message: "User with this email already exists"
            })
        }

        
        return res.status(500).json({
            message: 'Error while registering the user'
        })
    }


}


async function loginController(req: Request<{}, {}, LoginRequestBody>, res: Response) {
    try {
        const result = loginSchema.safeParse(req.body)

        if (!result.success) {
            return res.status(400).json({
                message :   result.error.issues[0]?.message  || "validation failed"
            })
        }

        const { email, password } = result.data

        const user = await userModel.findOne(
            { email }
        ).select('+password')
 
       

        if (!user) {
            return res.status(400).json({
                message: "Invalid Email or Password"
            })
        }

         if ( user?.authProvider === "google") {
            return res.status(400).json({
                message : 'This account uses Google login. Please click Continue with Google'
            })
        }

        const isValidPassword = await bcrypt.compare(password, user.password!) // if the user didnt use google Auth then  the !password tells the typescript trust me this exists menaing the password exists bcz in our model its passowrd ?: string  bcz in our user model we said password is optional so typescript might thin its undefined now password is optional might be undefined 
       
        if (!isValidPassword) {
            return res.status(400).json({
                message: "Invalid Email or Password"
            })
        }


        const accessToken = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET_ACESS_KEY as string, { expiresIn: '15m' })



        const refreshToken = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET_REFRESH_KEY as string, { expiresIn: '7d' })


        await redisClient.set(`rightshub:accessToken:${accessToken}`, user._id.toString(), { EX: 15 * 60 })
        await redisClient.set(`rightshub:refreshToken:${refreshToken}`, user._id.toString(), { EX: 7 * 24 * 60 * 60 })



        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            message: "User Logged In succesfully!",
            accessToken,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                emailVerified : user.emailVerified
            }
        })

    }
    catch (error:any) {
        
        return res.status(500).json({
            message: "Error While logging In "
        })

    }


}


async function logOutController(req: Request, res: Response) {
    try {
        const refreshToken = req.cookies.refreshToken
        const accessToken = req.headers.authorization?.split(" ")[1]

        if (!refreshToken) {
            return res.status(200).json({
                message: " User Already Logged Out "
            })
        }
        await redisClient.del(`rightshub:refreshToken:${refreshToken}`)


        if (accessToken) {
            await redisClient.del(`rightshub:accessToken:${accessToken}`)
        }

        res.clearCookie('refreshToken')

        return res.status(200).json({
            message: "User Logged Out Successfully !"
        })

    }
    catch (error:any) {
        
        return res.status(500).json({
            message: "error While Logging Out !"
        })
    }

}

// axios mein request interceptor will call refreshToekn controller when access Token expires in 15 minuestes so yea logicccc behind 

async function refreshTokenController(req: Request, res: Response) {

    try {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) {
            return res.status(401).json({
                message: "User Not Logged In "
            })
        }

        const tokenInRedis = await redisClient.get(`rightshub:refreshToken:${refreshToken}`)

        if (!tokenInRedis) {
            return res.status(401).json({
                message: "User Logged Out"
            })
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_KEY as string) as { id: string }

        const newAccessToken = jwt.sign({
            id: decoded.id
        }, process.env.JWT_SECRET_ACESS_KEY as string, { expiresIn: '15m' })


        await redisClient.set(`rightshub:accessToken:${newAccessToken}`, decoded.id.toString(), { 'EX': 15 * 60 })

        res.status(200).json({
            newAccessToken: newAccessToken
        })

    }
    catch (err:any) {
      
        return res.status(500).json({
            message: "Something went Wrong ", err
        })


    }

}

async function getMeController(req: Request, res: Response) {

    try {
        const userId = req.user?.id

        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            })
        }

        return res.status(200).json({
            message: "User Info",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                emailVerified : user.emailVerified
            }
        })

    }
    catch (error:any) {
       
        return res.status(500).json({
            message: "eror while fetching the User info"
        })
    }

}


async function rsendVerificationOTPController(req: Request, res: Response) {
    //  firts get the user id from req. user . id remember the middleware we added thsi new property call req.user = decoded in whcih we  will have the decoded id so yea get that then check in our databse that if that user exist in our database based on thsi id if not give an errror 404 use rnot found 
    //    now user is find by like if we did find the user in our database with id then check if his email already verified or no cuz remeber in our user.Model we ssiad  emailVerified default false and type boolean  see if it is already vverified or no liek was it true or no 
    try {
        const userId = req.user?.id

        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(404).json({
                message: "User Not Found 404 "
            })
        }

        if (user.emailVerified === true) {
            return res.status(400).json({
                message: "Email already verified "
            })
        }

        const { otp, hashedOTP } = generateOTP()
        //  after we generate OTP 
        //  delete any existing token of this user based on id and type emailverification so the user cant have multiple valid tokens  user can only have one active OTP at a time 

        await TokenModel.deleteMany({
            userId,
            type: 'emailVerification'
        })


        await TokenModel.create({
            userId,
            token: hashedOTP,
            type: 'emailVerification',
            expiresAt: new Date(Date.now() + OTP_EXPIRY_MS)
        })


        await sendEmailVerificationOTP(user.email, otp)

        return res.status(200).json({
            message: "Email OTP sent Succefully"
        })
    }
    catch (error:any) {
       
        return res.status(500).json({
            message: 'Error sending verification OTP'
        })

    }
}


async function verifyOTPController(req: Request, res: Response) {

            try{
                const result = verifyOTPSchema.safeParse(req.body)

                if (!result.success) {
                    return res.status(400).json({
                        message :  result.error.issues[0]?.message  || "validation failed"
                    })
                }
                 const userId = req.user?.id

     const {otp} = result.data

     const hashSubmittedOTP = crypto.createHash('sha256').update(otp).digest('hex')

 

       const token =  await TokenModel.findOne({
                        userId,
                        type : "emailVerification"
            })

            if (!token) {
                return res.status(400).json({
                    message : "No Token Found 404"
                })
            }


            // if the otp is smaller than the new date menaing our time is 3: 10 AND user typed the otp in 3: 15 we gave them the message OTP expred  request a new one 

            if (token.expiresAt < new Date() ) {

                    return res.status(400).json({
                        message : 'OTP has expired, request a new one '
                    })

            }

            if (token.token !== hashSubmittedOTP ) {
                return res.status(400).json({
                    message : "INVALID OTP"
                })
            }

            await userModel.findByIdAndUpdate(
                userId,
                { emailVerified : true}
            )

            await TokenModel.deleteOne({
                _id : token._id
            })


            return res.status(200).json({
                message : 'Email Verified '
            })

                 
            }

            catch(error:any) {
               
                return res.status(500).json({
                    message : "Error While verifying YOUR Email"
                })
            }
                 
}


async function forgotPasswordController(req: Request, res : Response) {
        try {

            const result = forgotPasswordSchema.safeParse(req.body)


            if (!result.success) {
                return res.status(400).json({
                     message :   result.error.issues[0]?.message  || "validation failed"
                })
            }
                  const { email} = result.data

           const user = await userModel.findOne({email})


        //    why not jst simply say useer doesnt exist simply why this long ass message or why this message specifically here we learn about something really important concept which is user enumeration prevention we dont want any hacker to know that this email exist in our system or this email doesnt exist in our system thats why no reset link this is a really sensitive information that we dont want anyone to know at all imagine RightsHub specifically our app is for : people dealing with legal issues domestic violence victims ( if an abuser discovers their victim has an account on a legal rights app: they knwo the victim is seeking help they can target them  leaking who has an account on this specific app could genuinely put people in danger  ( so hacker gets the same exact response for every user fake emial rel email if this email exist in our system u will a get a reset link and tahts how they never know that this person has an account on thsi app))
           if(!user) {
            return res.status(200).json({
                message :"If this email exist in our system, you'll receive a reset link shortly"
            })}

             const  {resetToken, hashedResetToken}  = generateResetToken()

             await TokenModel.deleteMany({
                userId : user._id,
                type : "passwordReset"
             })


             await TokenModel.create({
                 userId : user._id,
                 token : hashedResetToken,
                 type : "passwordReset",
                 expiresAt : new Date(Date.now() + 60 * 60 * 1000)
             })
                 
             
             await sendPasswordResetToken(user.email, resetToken)

     return res.status(200).json({
        message :  " If this email exists in our system, you'll receive a reset link shortly  "
     })

        }
        catch(error:any ) {
            
            return res.status(500).json({
                message : "Error while resetting the password"
            })
        }

}

async function resetPasswordController(req: Request, res : Response) {
    try{
          
        const result = resetPasswordSchema.safeParse(req.body)

        if (!result.success) {
            return res.status(400).json({
                message :   result.error.issues[0]?.message  || "validation failed"
            })
        }
  
    const {resetToken , newPassword} =   result.data



    const hashedSubmittedResetToken = crypto.createHash("sha256").update(resetToken).digest('hex')

    const token = await TokenModel.findOne({
        token : hashedSubmittedResetToken,
        type : "passwordReset"

 })

    if (!token ) {
        return res.status(400).json({
            message : "No Token Found 404"
        })
    }

    if (token.expiresAt < new Date()) {
          return res.status(400).json({
             message : 'Reset Link has expired, request a new one '
        })
    }

     
        const hashNewPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)

        // if(token.token !== hashedSubmittedResetToken) {
        //     return res.status(400).json({
        //         message : "Invalid reset Token"
        //     })
        // }

             await userModel.findByIdAndUpdate(
                token.userId,
                {password : hashNewPassword}
             )


              await TokenModel.deleteOne({
                _id : token._id
            })


            return res.status(200).json({
                message : "Password Ressetted Successfully !"
            })
      
    }
    catch(error:any) {
    
          return res.status(500).json({
                    message : "Error While resetting your password"
         })
    }



}



//                       https://accounts.google.com/o/oauth2/auth
//  this is the Google's OAuth endpoint Its google door that says : Send users here when they want to login with Google 
//                       `&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}` +
//  After user log in with the google, where should Google send them back? 
//                          `&response_type=code` +
//  & means another parameter follows   what should google send back to u? code means send me one-time temporary Code that i can excange for user info 
// I wnat permission to see their email and profile





// THIS RUNS WHEN USER CLICKS ON CONTINUE WITH GOOGLE BUTTON 
//  ALL T DOES IS SEND USER TO GOOGLE'S LOGIN PAGE 




async function googleRedirectController(req : Request, res : Response) {
   
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth` +
    `?client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}` +      //  BCZ OF THIS URL SPECIFICALLY THIS HITS CONTROLLER 2 GOOGLECALLBACKCONTROLLER BCZ CHECK THIS CONTROLLER ROUTE IT THIS URL WE SAYING REDIRECT USER TO THIS URL SO WHEN THEY ARE ON THIS URL WHICH CONTRLLER GONNA RUN ON THIS ROUTE CONTROLLLER 2 
    `&response_type=code` +
    `&scope=email%20profile`
    
    res.redirect(googleAuthUrl)
    
}


// THIS  RUNS AUTOMATICALLY WHEN GOOGLE SENDS THE USER BACK TO UR APP 
// THE USER BROWSER HITS                 GET  /API/AUTH/GOOGLE/CALLBACK?CODE=4/0AX4XFWH
// THIS CONTROLLER RECEIVES THIS REQUEST 

async function googleCallBackController(req: Request, res : Response) {
      try{
         // when  the user is back on our app google send a code in url like '/api/auth/google/callback?code=4/0AX4XfWh...
      const code = req.query.code as string

      const {data} = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret:process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri:process.env.GOOGLE_REDIRECT_URI,
            grant_type: 'authorization_code'
        }
      )


 
     const { data : googleUser} = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', 
        {
            headers : {
                Authorization : `Bearer ${data.access_token}`
            }
        }  
    )

        // CHECK IF SOMEONE IN USERMODEL IS CREATED WITH GOOGLE ID MENAING CHECK IN OUR DB IF SOMEONE HAS LOGGED IN WITH GOOGLE USING THIS GOOGLE ID BEFORE  IF NOT WE CREATE ONE 

        // BUT ALSO CHECK THAT THAT USER MIGHT BE LOGING IN WITH GOOGLE THE FIRST TIME BUT HAS CREATED AN ACC BEFORE WITH EMAIL AND PASSWORD IF YES TELL THEM THHAT THEY USED LOGIN FORM SO SIGN IN WITH THAT DONT USE CONTINUE WITH GOOGLE CUZ TAHTS NOT HOW U SIGNED IN
     let finalUser = await userModel.findOne({googleId : googleUser.id})

    //   its his first time trying continue with google in our app then we create them inside if block but we dont save the result anywhere  user is still null so thats why above it we declare a variable finalUser where we save that user we jsut cretae din our if block 
    
    //  Logic behind this code that if user already has an account that was made with email and password and then tries to do login with google 
    //  show them error taht u have created an account with login not continue with google if we find that email when he tries to do the contine with google and we find that email 
    //  we see taht email exite dbefore and was made with login register then we show error 

    if (!finalUser) {

        const existingEmailUser = await userModel.findOne({
            email : googleUser.email
        })

                if (existingEmailUser) {
                    return res.redirect(`${process.env.FRONTEND_URL}/login?error=email_exists`)
                }

              finalUser =     await userModel.create({
                   firstName : googleUser.given_name,
                   lastName : googleUser.family_name,
                   email : googleUser.email,
                   googleId : googleUser.id,
                   emailVerified : googleUser.verified_email,
                   authProvider : 'google'
                  })
     }

    
        const accessToken = jwt.sign({
            id:  finalUser._id
        }, process.env.JWT_SECRET_ACESS_KEY as string, { expiresIn: '15m' })



        const refreshToken = jwt.sign({
             id:  finalUser._id
        }, process.env.JWT_SECRET_REFRESH_KEY as string, { expiresIn: '7d' })


        await redisClient.set(`rightshub:accessToken:${accessToken}`, finalUser._id.toString(), { EX: 15 * 60 })
        await redisClient.set(`rightshub:refreshToken:${refreshToken}`,  finalUser._id.toString(), { EX: 7 * 24 * 60 * 60 })

       res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
    

        res.redirect(`${process.env.FRONTEND_URL}/dashboard?accessToken=${accessToken}`)
      }
      catch(error:any) {
        
        res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`)
      }

}







export { registerController, loginController, logOutController, refreshTokenController, getMeController, rsendVerificationOTPController, verifyOTPController, forgotPasswordController, resetPasswordController, googleRedirectController, googleCallBackController }