import SituationResult from '../components/SituationResult'


import { useLocation } from "react-router-dom"
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import { useEffect } from 'react'

function Result() {
    //  this is How react routetr passes adta between pages 

    const navigate = useNavigate()
    const location = useLocation()

    //  WHAT IF USER NAVIGATES TO /RESULTS PAGE DIRECTLY WITHOUT GOING THROUGH A FORM ?
    // LOCATION.STATE WOULD BE NULL -> CRASH  
            useEffect(() => {
             if (!location.state) {
                 navigate(ROUTES.DASHBOARD)
                 }
            }, [])


     if (!location.state) {
        return null
    }
    const {aiResponse, resources} = location.state




  return (
    <div className="min-h-screen bg-[#E8E3D8] px-3 py-5 text-[#2D3748] sm:px-4 lg:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-3 rounded-[24px] border border-[#1E3A3A]/20 bg-gradient-to-r from-[#1E3A3A] via-[#2F5D7A] to-[#4B6B6B] p-4 shadow-[0_10px_24px_rgba(45,55,72,0.07)] sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#F5F1E8]">Your results</p>
              <h1 className="mt-2 text-xl font-semibold text-[#F5F1E8]">A practical next step is ready</h1>
            </div>
            <button className="rounded-full border border-[#F5F1E8]/20 bg-[#F5F1E8] px-3.5 py-2 text-sm font-semibold text-[#1E3A3A] transition hover:bg-[#C94A3B] hover:text-white" onClick={() => navigate(ROUTES.DASHBOARD)}>Back to Dashboard</button>
          </div>
        </div>
        <SituationResult airesponse={aiResponse} resources={resources} />
      </div>
    </div>
  )
}

export default Result
