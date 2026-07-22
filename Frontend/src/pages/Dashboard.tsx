import { useEffect, useState } from "react"
import { ROUTES } from "../constants/routes"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import {setAccessToken} from '../utils/axios'
import { getMeApi } from "../api/authApi"
import {createSituationApi} from '../api/situationApi'
import SituationForm  from '../components/SituationForm'
import {getUserSituationApi} from '../api/situationApi'




function Dashboard() {


    const {user, logout} = useAuth()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    


        const [description, setDescription] = useState("")
        const [state, setState] = useState("")
        const [category, setCategory] = useState("")
        const [situation, setSituation] =  useState<any[]>([])   // thsi si fr recent Situations section we need to fetch user's past situations when dashoard laodsso wwe need to add thsi to useEEffcet so whenn teh dashBoard loads useeffect runs first we know thatso lets do it 
        const [isLoading, setIsloading] =  useState(false)
        const [error, setError] =  useState<string | null>(null)

     
   useEffect(() =>{
      
        const params = new URLSearchParams(window.location.search)
        const googleToken = params.get('accessToken')

        if (googleToken) {
          setAccessToken(googleToken)
          window.history.replaceState({}, '', '/dashboard')

            getMeApi().then((data) => {
              queryClient.setQueryData(['me'], data)
            })
        }
        // fetch user recents situations 
      //  DASHBOARD WILL HAVE ALL THE ERCENT SITUATIONS OF USER RIGHT ? SO WE KNOW USEEFFECT FUBCTIONN RUNS FIIRS THING WHEN DASHBOARD LOADS SHOW ALL USER RECENT SITUATIONS 
         const fetchSituations = async () => {
          try{
              const data = await getUserSituationApi()
               setSituation(data.situations)
          }
          catch(error : any) {
           
          }

         }

                fetchSituations()
          
   }, [])

      

    async  function handleSubmit (e:any) {
          try{
             e.preventDefault()
         setIsloading(true)
         setError(null)
        const response = await createSituationApi(description,state,category)
         setDescription("")
         navigate(ROUTES.RESULTS, {
          state : {
             aiResponse : response.aiResponse,
             resources : response.resources
          }
         })
          }
          catch(error : any) {
            setError(error.response?.data?.message || "Error Try Again ")
          }
           finally {
            setIsloading(false)
           }

      }


  const handleLogout =  async() => {
    
      logout()
       navigate(ROUTES.LOGIN)
        
       
     
  } 
  return (
    <div className="min-h-screen bg-[#E8E3D8] px-3 py-5 text-[#2D3748] sm:px-4 lg:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-3">
        <div className="rounded-[24px] border border-[#1E3A3A]/20 bg-gradient-to-r from-[#1E3A3A] via-[#2F5D7A] to-[#4B6B6B] p-4 shadow-[0_10px_24px_rgba(45,55,72,0.08)] sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex rounded-full bg-[#F5F1E8] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#1E3A3A]">Rights Hub</div>
              <h1 className="mt-2 text-xl font-semibold text-[#F5F1E8]">Welcome {user?.firstName}!</h1>
              <p className="mt-1 text-sm leading-5 text-[#E9E0CF]">Tell us what happened. We'll tell you exactly what to do about it.</p>
            </div>
            <button className="rounded-full border border-[#F5F1E8]/20 bg-[#F5F1E8] px-3.5 py-2 text-sm font-semibold text-[#1E3A3A] transition hover:bg-[#C94A3B] hover:text-white" onClick={handleLogout}>Log Out</button>
          </div>
        </div>

        {error && <p className="rounded-2xl border border-[#E63946]/20 bg-[#FFF1EF] px-3 py-2 text-sm font-medium text-[#C94A3B]">{error}</p>}

        <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-[#2F7D5F]/20 bg-gradient-to-br from-[#F2E8DA] via-[#EADCC5] to-[#D6E6DA] p-4 shadow-[0_8px_20px_rgba(45,55,72,0.06)] sm:p-5">
            <div className="pb-2">
              <h2 className="text-base font-semibold text-[#24313A]">Describe your situation</h2>
              <p className="mt-1 text-sm text-[#5C6670]">A short, clear description helps us point you in the right direction.</p>
            </div>
            <div className="mt-2">
              <SituationForm 
                description={description}
                setDescription={setDescription}
                state={state}
                setState={setState}
                category={category}
                setCategory={setCategory}
                onSubmit={handleSubmit} 
                isLoading={isLoading}
              />
            </div>
          </div>

          <div className="rounded-[24px] border border-[#2F5D7A]/20 bg-gradient-to-br from-[#F3F6F9] via-[#E8EEF4] to-[#DDE7EE] p-4 shadow-[0_8px_20px_rgba(45,55,72,0.06)] sm:p-5">
            <div className="pb-2">
              <h2 className="text-base font-semibold text-[#24313A]">Recent requests</h2>
              <p className="mt-1 text-sm text-[#5C6670]">Your recent submissions stay here so you can come back anytime.</p>
            </div>
            {situation.length > 0 && (
              <div className="mt-2 space-y-2">
                {situation.map(s => (
                  <div className="rounded-2xl border border-[#2F7D5F]/15 bg-[#FFFDF8] p-3 shadow-sm" key={s._id}>
                    <p className="text-sm font-medium text-[#2D3748]">{s.description.substring(0,50)}.....</p>
                    <p className="mt-1 text-xs text-[#5C6670]">{s.state} - {s.category}</p>
                    <p className="mt-2 text-xs font-semibold text-[#44525D]">{new Date(s.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )}

export default Dashboard





