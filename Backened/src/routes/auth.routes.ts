import express from 'express'

const authRouter = express.Router();

import {registerController, loginController, logOutController, refreshTokenController, getMeController, rsendVerificationOTPController, verifyOTPController, forgotPasswordController, resetPasswordController, googleRedirectController, googleCallBackController} from '../controllers/user.controllers'
import protect from '../middleware/auth.middleware';

import {loginLimiter, registerLimiter, forgotPasswordLimiter, verifyOTPLimiter} from '../middleware/rateLimiter.middleware'

// register verify rate limiteracl
// loginLimiter   rate limiter 

authRouter.post("/register",registerLimiter, registerController)
authRouter.post("/login", loginLimiter,  loginController)
authRouter.post("/logout", logOutController)
authRouter.post("/refresh-token", refreshTokenController)
authRouter.get("/me", protect, getMeController)
authRouter.post("/resend-verification-otp", protect, rsendVerificationOTPController)
authRouter.post("/verify-otp", protect, verifyOTPLimiter, verifyOTPController)
authRouter.post("/forgot-password", forgotPasswordLimiter, forgotPasswordController)
authRouter.post("/reset-password", resetPasswordController)

//  Redirects user to Google No controller needed, justa a redirect
// this route just redirects the uer when user click the contine with google button it takes the user to that continue with google page nothing else this is what thsi route does nothing else 
authRouter.get("/google", googleRedirectController)

// Google redirects user back here  this runs when the google sends user back to ur app
authRouter.get("/google/callback", googleCallBackController)



export default authRouter
