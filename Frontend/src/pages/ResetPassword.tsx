import { useState } from "react"
import { useParams } from "react-router-dom"
import { resetPasswordApi } from "../api/authApi"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../constants/routes"


function ResetPassword() {

  
        const {token} = useParams()
        const naviagte = useNavigate()



        const [newPassword, setNewPassword] = useState("")
        const [confirmNewPassword, setConfirmNewPassword] = useState("")
        const [showNewPassword, setShowNewPassword] = useState(false)
        const [showConfirmPassword, setShowConfirmPassword] = useState(false)
        const [error, setError] = useState<string | null>(null)
        const [isloading, setIsloading] = useState(false)


        const handleSubmit = async(e : any) => {
         try{
           e.preventDefault()
          setIsloading(true)
          setError(null)

          if (newPassword !== confirmNewPassword) {
               setError("Passwords Don't Match")
                return  // stop here dont go further other wise it would call api even tho passwords fdont match
          }
          // token bcz we are extractin token form url and it can be undefined so !token tells typescript trust me it exists 
           await  resetPasswordApi(token!, newPassword )
           naviagte(ROUTES.LOGIN + '?message=Password reset successfully! Plese Login.')
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
      
      <form className="mx-auto flex max-w-md flex-col rounded-2xl border border-[#2D3748]/10 bg-white p-6 shadow-sm sm:p-8" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-semibold text-[#2D3748]">Set a new password</h1>
        <p className="mt-2 text-sm text-[#2D3748]/70">Choose a strong password to secure your account.</p>
        <div className="relative mt-5">
          <input className="w-full rounded-lg border border-[#2D3748]/20 bg-[#F8F9FA] px-4 py-3 pr-12 text-sm text-[#2D3748] outline-none transition focus:border-[#52B788]" type={showNewPassword ? "text" : "password"} placeholder="Enter Your New password.." required value={newPassword}  onChange={(e) => setNewPassword(e.target.value)} />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2D3748]" onClick={() => setShowNewPassword((prev) => !prev)} aria-label="Toggle password visibility">{showNewPassword ? "🙈" : "👁"}</button>
        </div>
        <div className="relative mt-4">
          <input className="w-full rounded-lg border border-[#2D3748]/20 bg-[#F8F9FA] px-4 py-3 pr-12 text-sm text-[#2D3748] outline-none transition focus:border-[#52B788]" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm New password" required value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2D3748]" onClick={() => setShowConfirmPassword((prev) => !prev)} aria-label="Toggle password visibility">{showConfirmPassword ? "🙈" : "👁"}</button>
        </div>
          <button className="mt-5 rounded-lg bg-[#52B788] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#46a07a]" type="submit">{isloading ? "Submitting" : "submit" }</button>
      </form>
    </div>
  )
}

export default ResetPassword
