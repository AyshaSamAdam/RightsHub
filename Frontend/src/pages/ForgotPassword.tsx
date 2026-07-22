import { useState } from "react"
import { ROUTES } from "../constants/routes"
import  { forgotPasswordApi } from "../api/authApi"
import { useNavigate } from "react-router-dom"
function ForgotPassword() {

      const [email, setEmail] = useState("")
      const [succesMessage, setSuccessMessage] = useState("")
      const [error, setError] = useState<string | null>(null)
      const [isLoading, setIsloading] = useState(false)

      const navigate = useNavigate()

      const handleResent  = async() => {
         try{
              setIsloading(true)
             setError(null)
             await forgotPasswordApi(email)
             setSuccessMessage("If this email exists, you'll receive a reset link shortly")
         
         }
         catch(error: any) {
            setError(error.response?.data?.message || "Something went Wrong Please try Again ")
         }
         finally{
          setIsloading(false)
         }
      }
  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 py-8 text-[#2D3748] sm:px-6 lg:px-8">
      {error && <p className="mx-auto mb-4 max-w-md rounded-lg border border-[#E63946]/20 bg-[#E63946]/10 px-4 py-3 text-sm text-[#E63946]">{error}</p>}
      {succesMessage && <h4 className="mx-auto mb-4 max-w-md rounded-lg border border-[#52B788]/20 bg-[#52B788]/10 px-4 py-3 text-sm text-[#2D3748]">{succesMessage}</h4>}
         <div className="mx-auto flex max-w-md flex-col rounded-2xl border border-[#2D3748]/10 bg-white p-6 shadow-sm sm:p-8">
           <h1 className="text-2xl font-semibold text-[#2D3748]">Reset your password</h1>
           <p className="mt-2 text-sm text-[#2D3748]/70">Enter the email tied to your account and we will help you get back in.</p>
           <input className="mt-5 rounded-lg border border-[#2D3748]/20 bg-[#F8F9FA] px-4 py-3 text-sm text-[#2D3748] outline-none transition focus:border-[#52B788]" type="email"  placeholder="Enter You Email Address"  value={email} onChange={(e) => {setEmail(e.target.value)}}/>
           <button className="mt-4 rounded-lg bg-[#52B788] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#46a07a]" onClick={handleResent}>{isLoading ? "sendingg Reset Link..." : "Send Reset Link?"} </button>
            <button className="mt-3 rounded-lg border border-[#2D3748]/20 bg-white px-4 py-3 text-sm font-semibold text-[#2D3748] transition hover:bg-[#F8F9FA]" onClick={() => navigate(ROUTES.LOGIN)}>Back to Login </button>
         </div>
      
    </div>
  )
}

export default ForgotPassword
