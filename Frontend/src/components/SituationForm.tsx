import {US_STATES} from '../constants/states'
import {CATEGORIES} from '../constants/category'



interface SituationFormProps{
    description : string,
    setDescription : (val : string) => void
    state : string,
    setState : (val :string) => void
    category : string,
    setCategory : (val: string) => void
    isLoading : boolean
    onSubmit : (e: any) => void
}





function SituationForm({description,setDescription, state,setState, category, setCategory,isLoading,onSubmit}: SituationFormProps ) {
  return (
       <>
        
                    <form className="rounded-[24px] border border-[#2F7D5F]/20 bg-[#EDE1CF] p-3 shadow-[0_8px_20px_rgba(45,55,72,0.05)] sm:p-4" onSubmit={onSubmit}>
        
                      <textarea className="min-h-28 w-full rounded-2xl border border-[#2F7D5F]/20 bg-[#F5EBDC] px-3 py-2.5 text-sm text-[#2D3748] outline-none transition focus:border-[#2F7D5F] focus:ring-2 focus:ring-[#2F7D5F]/20" placeholder="Describe Your Situation Here..." required   value={description}  onChange={(e) => setDescription(e.target.value)} />
        
                      <select className="mt-3 w-full rounded-2xl border border-[#2F7D5F]/20 bg-[#F5EBDC] px-3 py-2.5 text-sm text-[#2D3748] outline-none transition focus:border-[#2F7D5F] focus:ring-2 focus:ring-[#2F7D5F]/20" value={state} onChange={(e) => setState(e.target.value)}>
        
                            <option value="" defaultValue={"Select Your State"} disabled>Select Your State</option>
                            {US_STATES.map(s => (<option key={s.code} value={s.code}>{s.name}</option>))}
                      </select>
        
        
                       <select className="mt-3 w-full rounded-2xl border border-[#2F7D5F]/20 bg-[#F5EBDC] px-3 py-2.5 text-sm text-[#2D3748] outline-none transition focus:border-[#2F7D5F] focus:ring-2 focus:ring-[#2F7D5F]/20" value={category} onChange={(e) => setCategory(e.target.value)}>
        
                            <option value="" selected disabled>Select Your Category:</option>
                            {CATEGORIES.map(c => (<option key={c.value} value={c.value}>{c.label}</option>))}
                      </select>
        
                            <button className="mt-4 w-full rounded-2xl bg-[#1E3A3A] px-3 py-2.5 text-sm font-semibold text-[#F5F1E8] transition hover:bg-[#2F5D7A] disabled:cursor-not-allowed disabled:bg-[#1E3A3A]/70" type="submit" disabled={isLoading}> {isLoading ? "Getting Help..." : "Get Help"}</button>
                    </form>
       </>
  )
}

export default SituationForm
