import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "../constants/routes"
import { loginApi, registerApi } from "../api/authApi"
import {useAuth } from '../context/AuthContext'

function Register() {

         const navigate = useNavigate()
         const {login} = useAuth()

          const [firstName, setFirstName] =    useState("")
          const [lastName, setLastName] =    useState("")
          const [email, setEmail] =    useState("")
          const [password, setPassword] =    useState("")
          const [showPassword, setShowPassword] =    useState(false)
          const [isloading, setIsloading] =    useState(false)
          const [error, setError] =    useState<string | null>(null)


          const handleSubmit = async (e : any) => {
              e.preventDefault()
              setIsloading(true)
              setError(null)

              try{

                  await registerApi(firstName, lastName, email, password)
                   const loginresponse =   await loginApi(email, password)
                    login(loginresponse.user, loginresponse.accessToken)
                    navigate(ROUTES.VERIFY_EMAIL)
                    


              }
              catch(error :any) {
                      setError(error.response?.data?.message || "Something went wrong")
              }
              finally {
                         setIsloading(false)
              }
 }
  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 py-8 text-[#2D3748] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col overflow-hidden rounded-[32px] border border-[#2D3748]/10 bg-white shadow-sm lg:flex-row">
        <div className="flex flex-1 flex-col justify-center bg-gradient-to-br from-[#2D3748] to-[#4A5568] px-6 py-10 text-white sm:px-10 lg:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#F8F9FA]/70">Rights Hub</p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Know Your Rights</h1>
          <h2 className="mt-3 text-lg text-[#F8F9FA]/80">Find real help, fast.</h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-[#F8F9FA]/80 sm:text-base">
            Create an account to get clear guidance, trusted resources, and calm next steps when life feels overwhelming.
          </p>
          <div className="mt-8 space-y-3 text-sm text-[#F8F9FA]/90">
            <div className="rounded-xl border border-white/10 bg-white/10 p-3">⚖️ Get support tailored to your situation</div>
            <div className="rounded-xl border border-white/10 bg-white/10 p-3">🧭 Move forward with practical next steps</div>
            <div className="rounded-xl border border-white/10 bg-white/10 p-3">💬 Access help that feels clear and human</div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8 lg:px-10">
          <div className="w-full max-w-md">
            <h3 className="text-center text-2xl font-semibold text-[#2D3748]">Create An Account</h3>
            {error && <p className="mx-auto mb-4 mt-4 rounded-lg border border-[#E63946]/20 bg-[#E63946]/10 px-4 py-3 text-sm text-[#E63946]">{error}</p>}
            <form className="mt-4 flex flex-col rounded-2xl border border-[#2D3748]/10 bg-[#F8F9FA] p-6 shadow-sm sm:p-8" onSubmit={handleSubmit}>

              <label className="mb-2 text-sm font-medium text-[#2D3748]">FirstName :</label>
              <input className="mb-4 rounded-lg border border-[#2D3748]/20 bg-white px-4 py-3 text-sm text-[#2D3748] outline-none transition focus:border-[#52B788]" type="text"  placeholder="FirstName" required   value={firstName}    onChange={(e) => {setFirstName(e.target.value)}}   />


              <label className="mb-2 text-sm font-medium text-[#2D3748]">LastName :</label>
              <input className="mb-4 rounded-lg border border-[#2D3748]/20 bg-white px-4 py-3 text-sm text-[#2D3748] outline-none transition focus:border-[#52B788]" type="text"  placeholder="Last Name" required value={lastName} onChange={(e) => {setLastName(e.target.value)}}/>

              <label className="mb-2 text-sm font-medium text-[#2D3748]">Email :</label>
              <input className="mb-4 rounded-lg border border-[#2D3748]/20 bg-white px-4 py-3 text-sm text-[#2D3748] outline-none transition focus:border-[#52B788]" type="email" placeholder="Email" required value={email}   onChange={(e) => {setEmail(e.target.value)}}/>

              <label className="mb-2 text-sm font-medium text-[#2D3748]">Password :</label>
              <div className="relative mb-5">
                <input className="w-full rounded-lg border border-[#2D3748]/20 bg-white px-4 py-3 pr-12 text-sm text-[#2D3748] outline-none transition focus:border-[#52B788]" type={showPassword ? "text" : "password"} placeholder="Password" required value={password} onChange={(e) => {setPassword(e.target.value)}}/>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2D3748]"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>

              <button className="rounded-lg bg-[#52B788] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#46a07a]" type="submit"> {isloading ? "Creating an Account..." : "Submit"} </button>
            </form>
                    
            <p className="mx-auto mt-4 max-w-md text-center text-sm text-[#2D3748]/70">Already have an account ?</p> <span className="mx-auto mt-2 block cursor-pointer text-center text-sm font-semibold text-[#52B788] hover:text-[#46a07a]" onClick={() => navigate(ROUTES.LOGIN)}>Log In</span>

            <h1 className="mt-6 text-center text-sm font-semibold uppercase tracking-[0.2em] text-[#2D3748]/50">OR</h1>

            <button className="mx-auto mt-3 flex w-full items-center justify-center rounded-lg border border-[#2D3748]/20 bg-white px-4 py-3 text-sm font-semibold text-[#2D3748] shadow-sm transition hover:bg-[#F8F9FA]" onClick={() => {
              window.location.href= 'http://localhost:5000/api/auth/google'
            }}>Continue with Google</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
