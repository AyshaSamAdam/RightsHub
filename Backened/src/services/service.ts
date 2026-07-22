import { Resend } from "resend";


const resend = new Resend(process.env.RESEND_API_KEY)

async function sendEmailVerificationOTP(email: string, otp: string) {
    try {


        const result = await resend.emails.send({

            from: 'RightsHub <onboarding@resend.dev>',
            to: email,
            subject: 'Verify Your Email',
            html: `
        
              <h2> Welcome to RightsHub!  </h2>
              <p>Your verification code is :   </p>
              <h1 style="letter-spacing: 4px">  ${otp}  </h1>
              <p>This OTP expires in 10 minutes.   </p>
              <p>If you didn't create an account, ignore this email.    </p>
        
        `
        });



        if (result.error) {
            throw new Error(result.error.message)
        }


        return result
    }
    catch (error:any) {
        
        throw error
    }


}



async function sendPasswordResetToken(email: string, resetToken: string) {


    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    try {

        const result = await resend.emails.send({
            from: 'RightsHub <onboarding@resend.dev>',
            to: email,
            subject: 'Reset Your Password',
            html: `
                     <h2>Password Reset Request  </h2>
                     <p>Click the link below to reset your password :   </p>
                     <a href="${resetLink}"> Reset Password  </a>
                     <p> This link expires in 1 hour </p>
                     <p> If you didn't request this, ignore this email. </p>
                 `
        });

        if (result.error) {
            throw new Error(result.error.message)
        }


        return result


    }
    catch (error:any) {
        
        throw error
    }




}




export { sendEmailVerificationOTP, sendPasswordResetToken }