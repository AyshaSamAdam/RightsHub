// CUSTOM REDIS SLIDING WINDOW RATE LIMITER 
import {Request, Response, NextFunction } from "express";
import { redisClient } from "../config/redis";


// WINDOW MS HOW LONG THE WINDOW IS FOR LOGIN/Register/ForgotPassword ( 15 * 60 * 1000 = 9000000MS ( 15 MIN)  )

function createRateLimiter(maxRequest : number, windowMs : number, message : string) {

     return async (req : Request, res : Response, next : NextFunction) => {

                try {
                const ip = req.ip
                const key = `rightshub:ratelimit:${ip}:${req.path}`
               const now = Date.now()   
               const windowStart = now - windowMs


            //    okay so if the time is 9:00 pm ( Date.now () )
            //  so minus 9: 00pm - 15 minutes which will be 8:45 pm 
            // so i m saying anything before 8:45 ignore it 


//  DEELET EVERYTHING BEFORE 8:45 PM

             await  redisClient.zRemRangeByScore(key, '-inf' ,windowStart)
    

// COUNT WHAT'S LEFT ( 8:45PM TO 9:00PM)  HOW MANY ATTEMPS ARE LEFT 

              const  requestCount = await redisClient.zCard(key)

 //   5 OR MORE ? BLOCK

             if (requestCount >= maxRequest) {
                return res.status(429).json({
                    message : message
                })
             }
//  LESS THAN 5 RECORD AND ALLOW

                  await redisClient.zAdd(key,  {
                    score : now,
                    value : now.toString()
                  })

                 await redisClient.expire(key, Math.ceil(windowMs / 1000))  
                  next()

     }

                catch(error:any) {
                    
                     next()
                }
     }
     
}

// max 5 attempts  , 15 minutes    
export const loginLimiter = createRateLimiter(5,15 * 60 * 1000, "Too many login attempts.Please try again in 15 minutes.")
//  max 5 attempts in  1 hour 
export const registerLimiter = createRateLimiter(5, 60 * 60 * 1000, "Too many registration attempts.Please try again in 1 hour")
//    max 3 attempts in 1 hour 
export const forgotPasswordLimiter = createRateLimiter(3, 60 * 60 * 1000, "Too many password reset attempts. Please try again in 1 hour")
//  max 5 attempts 15 minutes 
export const verifyOTPLimiter = createRateLimiter(5, 15 * 60 * 1000, "TOO many OTP attempts. Please request a new code ")

