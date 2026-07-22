import crypto from 'node:crypto'




function generateOTP() : {otp : string , hashedOTP : string}  {
     
    const otp = crypto.randomInt(100000, 999999).toString()      //  generates  a random number between 100000 and 999999 (always 6 digits)  .toString converts number to string 
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex')

    return {otp, hashedOTP}


}

function generateResetToken(): {resetToken : string, hashedResetToken : string} {

    const resetToken = crypto.randomBytes(32).toString('hex')
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    return    {resetToken, hashedResetToken}

}




export {generateOTP, generateResetToken}