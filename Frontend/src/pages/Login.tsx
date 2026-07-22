import { useState } from "react"
import { loginApi } from "../api/authApi"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../constants/routes"
import { useSearchParams } from "react-router-dom"

function Login() {
      const [searchParams] = useSearchParams()
      const succesMessage = searchParams.get('message')
      const errorParams = searchParams.get("error")

          const {login} = useAuth()
          const navigate = useNavigate()

         const [email, setEmail] = useState("")
         const [password, setPassword] = useState("")
         const [showPassword, setShowPassword] = useState(false)
         const [error, setError] = useState<string | null>(null)
         const [isloading, setIsLoading] = useState(false)


         const handleSubmit = async (e: any) => {
          e.preventDefault()
          setError(null)
          setIsLoading(true)

          try{

           const loginResponse  =    await loginApi(email, password)
          
           login(loginResponse.user, loginResponse.accessToken)
           
           navigate(ROUTES.DASHBOARD)
         


          }
          catch(error : any){
            
            setError(error.response?.data?.message || "Something went Wrong")
          }
          finally{
             setIsLoading(false)
          }

         }
  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 py-8 text-[#2D3748] sm:px-6 lg:px-8">
      {error && <p className="mx-auto mb-4 max-w-md rounded-lg border border-[#E63946]/20 bg-[#E63946]/10 px-4 py-3 text-sm text-[#E63946]"> {error}</p>}
      {errorParams === "email_exists" && (
        <p className="mx-auto mb-4 max-w-md rounded-lg border border-[#52B788]/20 bg-[#52B788]/10 px-4 py-3 text-sm text-[#2D3748]">Thsi email is registered with email/password. Please Login normally.</p>
      )}

      {errorParams === "google_auth_failed" && (
        <p className="mx-auto mb-4 max-w-md rounded-lg border border-[#E63946]/20 bg-[#E63946]/10 px-4 py-3 text-sm text-[#E63946]">Google login Failed. Please try again.</p>
      )}
      {succesMessage && <p className="mx-auto mb-4 max-w-md rounded-lg border border-[#52B788]/20 bg-[#52B788]/10 px-4 py-3 text-sm text-[#2D3748]">{succesMessage}</p>}
        <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col rounded-2xl border border-[#2D3748]/10 bg-white p-6 shadow-sm sm:p-8" >
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-[#2D3748]">Welcome back</h1>
            <p className="mt-2 text-sm text-[#2D3748]/70">Sign in to continue to Rights Hub</p>
          </div>
          <label className="mb-2 text-sm font-medium text-[#2D3748]">Email</label>
          <input className="mb-4 rounded-lg border border-[#2D3748]/20 bg-[#F8F9FA] px-4 py-3 text-sm text-[#2D3748] outline-none ring-0 transition focus:border-[#52B788]" type="email" placeholder="Enter Your Email"  required value={email} onChange={(e) => setEmail(e.target.value)}/>

          <label className="mb-2 text-sm font-medium text-[#2D3748]">Password</label>
          <div className="relative mb-5">
            <input className="w-full rounded-lg border border-[#2D3748]/20 bg-[#F8F9FA] px-4 py-3 pr-12 text-sm text-[#2D3748] outline-none transition focus:border-[#52B788]" type={showPassword ? "text" : "password"}  placeholder="Enter Your Password" required value={password} onChange={(e) => {setPassword(e.target.value)}} />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2D3748]"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
           <button className="rounded-lg bg-[#52B788] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#46a07a]" type="submit">{isloading ? "logging you In " : "Log In " }</button>
         </form>
          <p className="mx-auto mt-4 max-w-md cursor-pointer text-center text-sm font-medium text-[#52B788] hover:text-[#46a07a]" onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}>Forgot Password? </p>
          
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-[#2D3748]/70">Don't Have an Account ? <span className="cursor-pointer font-semibold text-[#52B788] hover:text-[#46a07a]" onClick={() => navigate(ROUTES.REGISTER)}>Sign Up</span></p>

          <h1 className="mt-6 text-center text-sm font-semibold uppercase tracking-[0.2em] text-[#2D3748]/50">OR</h1>
          <button className="mx-auto mt-3 flex w-full max-w-md items-center justify-center rounded-lg border border-[#2D3748]/20 bg-white px-4 py-3 text-sm font-semibold text-[#2D3748] shadow-sm transition hover:bg-[#F8F9FA]" onClick={() => {
            window.location.href = 'http://localhost:5000/api/auth/google'
          }}>
            Continue With Google
          </button>
    </div>
  )
}

export default Login
