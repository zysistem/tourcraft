'use client'

import { useEffect, useState } from 'react'
import { useTourWizardStore } from '@/store/tourWizardStore'
import { getLang } from '@/lib/i18n'

export default function Step6Cancellation() {
  const store = useTourWizardStore()
  const [policies, setPolicies] = useState<any[]>([])
  const lang = store.languages[0] || 'en'

  useEffect(() => {
    fetch('/api/library/cancellation-policies')
      .then((r) => r.json())
      .then(setPolicies)
  }, [])

  const toggle = (id: string) => {
    if (store.selectedPolicyIds.includes(id)) {
      store.setField('selectedPolicyIds', store.selectedPolicyIds.filter((p) => p !== id))
    } else {
      store.setField('selectedPolicyIds', [...store.selectedPolicyIds, id])
    }
  }

  const addPolicy = async () => {
    const title = prompt('Policy title (English):')
    if (!title) return
    const content = prompt('Policy content (English):')
    if (!content) return
    const res = await fetch('/api/library/cancellation-policies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titles: { en: title }, contents: { en: content }, isDefault: false }),
    })
    const newPolicy = await res.json()
    setPolicies((prev) => [...prev, newPolicy])
    store.setField('selectedPolicyIds', [...store.selectedPolicyIds, newPolicy.id])
  }

  return (
    <div className="animate-tcfade">
      <div className="text-[11px] font-bold text-gold tracking-[0.1em] uppercase">Step 6 of 7</div>
      <h2 className="text-[20px] font-bold mt-1 mb-[18px]">Cancellation policy</h2>

      {policies.length === 0 ? (
        <div className="text-center py-8 text-muted text-[13px]">
          No cancellation policies in library yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {policies.map((pol) => {
            const on = store.selectedPolicyIds.includes(pol.id)
            return (
              <div key={pol.id} onClick={() => toggle(pol.id)}
                className={`border rounded-[11px] px-[17px] py-[15px] cursor-pointer flex items-start gap-[13px] transition-colors ${
                  on ? 'border-[#c3ccdd] bg-navy-soft' : 'border-line hover:bg-bg'
                }`}>
                <span className={`w-5 h-5 rounded-[6px] flex items-center justify-center text-[13px] text-white font-black flex-none mt-[1px] ${
                  on ? 'bg-navy border-navy' : 'bg-white border border-[#d4d8df]'
                }`}>{on ? '✓' : ''}</span>
                <div className="flex-1">
                  <div className="font-semibold text-[14px]">{getLang(pol.titles, lang)}</div>
                  <div className="text-[12.5px] text-muted mt-1 leading-[1.55]">{getLang(pol.contents, lang)}</div>
                </div>
                {pol.isDefault && (
                  <span className="bg-gold-soft text-[#7a5826] text-[9.5px] font-bold px-2 py-1 rounded-[5px] tracking-[0.05em]">DEFAULT</span>
                )}
              </div>
            )
          })}
        </div>
      )}

      <button type="button" onClick={addPolicy}
        className="mt-4 h-10 border border-dashed border-[#c7cdd6] bg-card rounded-[10px] px-4 text-[13px] font-semibold text-navy hover:bg-bg transition-colors">
        + Add new policy (multilingual rich text)
      </button>
    </div>
  )
}
