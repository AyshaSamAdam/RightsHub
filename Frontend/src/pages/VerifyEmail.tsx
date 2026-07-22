import { useState } from "react"
import { resendOTPApi, verifyOTPApi } from "../api/authApi"
import {  useNavigate } from "react-router-dom"
import { ROUTES } from "../constants/routes"
import { useQueryClient } from "@tanstack/react-query"


function VerifyEmail() {

       const navigate = useNavigate()
       
    const queryClient = useQueryClient();
       
          const [otp , setOtp] =     useState("")
          const [resendMessage, setResendMessage] =     useState<string | null>(null)
          const [resendLoading, setResendLoading] =     useState(false)
          const [error, setError] =     useState<string | null>(null)
          const [isloading, setIsloading] =  useState(false)
          const [isVerified, setIsVerified] = useState(false)
          

        const handleVerify = async() => {
            if (isVerified)  return setIsVerified(true)
            try{
                   setIsloading(true)
                    setError(null)
                 await verifyOTPApi(otp)
                 queryClient.setQueryData(['me'], (old :any) => ({
                  ...old,
                  user : {
                    ...old?.user,
                    emailVerified : true
                  }
                 }))
                 navigate(ROUTES.DASHBOARD)
            }
            catch(error: any) { 
              setError(error.response?.data?.message || "InValid OTP")
                setIsVerified(false)

            }
            finally{
                     setIsloading(false)
            }

        }

        const handleResend = async () => {
                   try{
                    setResendLoading(true)
                      setError(null)
                     await resendOTPApi()
                   setResendMessage("New OTP sent to Your Email !")
                   }
                   catch(error : any) {
                    setError(error.response?.data?.message || "Failed to Resend OTP")
                   }
                   finally{
                    setResendLoading(false)

                   }
        }




  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 py-8 text-[#2D3748] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-[32px] border border-[#2D3748]/10 bg-white shadow-sm lg:flex-row">
        <div className="flex flex-1 flex-col justify-center bg-gradient-to-br from-[#2D3748] to-[#4A5568] px-6 py-10 text-white sm:px-10 lg:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#F8F9FA]/70">Almost there</p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Verify your email</h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-[#F8F9FA]/80 sm:text-base">
            One more step and you’ll be ready to access help, resources, and clear next steps.
          </p>
          <div className="mt-8 space-y-3 text-sm text-[#F8F9FA]/90">
            <div className="rounded-xl border border-white/10 bg-white/10 p-3">📧 We send a short code to your inbox</div>
            <div className="rounded-xl border border-white/10 bg-white/10 p-3">🔒 Keep your account secure and verified</div>
            <div className="rounded-xl border border-white/10 bg-white/10 p-3">✨ Continue to your dashboard once it’s confirmed</div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 lg:px-10">
          <div className="w-full max-w-md">
            {error && <p className="mb-4 rounded-lg border border-[#E63946]/20 bg-[#E63946]/10 px-4 py-3 text-sm text-[#E63946]">{error}</p>}
            {resendMessage && <h3 className="mb-4 rounded-lg border border-[#52B788]/20 bg-[#52B788]/10 px-4 py-3 text-sm text-[#2D3748]"> {resendMessage}</h3>}
            <div className="rounded-2xl border border-[#2D3748]/10 bg-[#F8F9FA] p-6 shadow-sm sm:p-8">
               <h2 className="text-2xl font-semibold text-[#2D3748]">Enter the code</h2>
               <p className="mt-2 text-sm text-[#2D3748]/70">We sent a 6-digit code to your email. Enter it below to continue.</p>

                <input className="mt-5 w-full rounded-lg border border-[#2D3748]/20 bg-white px-4 py-3 text-sm text-[#2D3748] outline-none transition focus:border-[#52B788]" type="text" maxLength={6} placeholder="Enter OTP " value={otp}  onChange={(e) => setOtp(e.target.value)} />
                <button className="mt-4 w-full rounded-lg bg-[#52B788] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#46a07a]" onClick={handleVerify}>{isloading ? "Verifying OTP..." : "Verify Email" }</button>
                <button className="mt-3 w-full rounded-lg border border-[#2D3748]/20 bg-white px-4 py-3 text-sm font-semibold text-[#2D3748] transition hover:bg-[#F8F9FA]" onClick={handleResend}>{resendLoading ? "Sending OTP Again..." : "Resend OTP"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
