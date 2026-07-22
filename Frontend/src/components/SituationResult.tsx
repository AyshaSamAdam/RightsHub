interface SituationResultProps {
    airesponse: string | null,
    resources: any[]
}

function SituationResult({ airesponse, resources }: SituationResultProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border border-[#2F7D5F]/20 bg-gradient-to-br from-[#FFF8EF] via-[#FFFDF8] to-[#ECF7F0] p-6 shadow-[0_10px_28px_rgba(45,55,72,0.06)]">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-[#2F7D5F]" />
          <h2 className="text-lg font-semibold text-[#24313A]">Suggested guidance</h2>
        </div>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#4F5A63]">{airesponse}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {resources.map(r => (
          <div className="flex min-h-[240px] flex-col rounded-[24px] border border-[#C96A4C]/15 bg-[#FFFDF8] p-5 shadow-[0_8px_22px_rgba(45,55,72,0.05)]" key={r._id}>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base font-semibold text-[#24313A]">{r.name}</p>
              {r.isFree && <span className="rounded-full bg-[#2F7D5F]/10 px-2.5 py-1 text-xs font-medium text-[#2F7D5F]">Free</span>}
              {r.isCrisis && <span className="rounded-full bg-[#E63946]/10 px-2.5 py-1 text-xs font-medium text-[#E63946]">Crisis Resource</span>}
            </div>
            <p className="mt-3 flex-1 text-sm leading-6 text-[#4F5A63]">{r.description}</p>

            <div className="mt-4 space-y-1">
              {r.phone && <p className="text-sm font-medium text-[#24313A]">Phone: {r.phone}</p>}
              {r.website && <p className="text-sm font-medium text-[#2F7D5F]">Website: {r.website}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SituationResult
