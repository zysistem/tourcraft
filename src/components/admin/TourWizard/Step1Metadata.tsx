'use client'

import { useEffect } from 'react'
import { useTourWizardStore, generateDaysFromRange } from '@/store/tourWizardStore'
import MultiLangInput from '../MultiLangInput'
import { CheckCircle, Upload } from 'lucide-react'

const AVAILABLE_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
]

export default function Step1Metadata() {
  const store = useTourWizardStore()

  const set = (field: string, val: any) => store.setField(field, val)

  const toggleLang = (code: string) => {
    const langs = store.languages.includes(code)
      ? store.languages.filter((l) => l !== code)
      : [...store.languages, code]
    set('languages', langs)
  }

  // Auto-generate days when dates change
  useEffect(() => {
    if (store.startDate && store.endDate) {
      const existingCount = store.days.length
      const newDays = generateDaysFromRange(store.startDate, store.endDate)
      // Only regenerate if count changes to avoid resetting content
      if (newDays.length !== existingCount) {
        store.setDays(newDays)
      }
    }
  }, [store.startDate, store.endDate])

  const dayCount = store.startDate && store.endDate
    ? generateDaysFromRange(store.startDate, store.endDate).length
    : 0

  return (
    <div className="animate-tcfade">
      <div className="text-[11px] font-bold text-gold tracking-[0.1em] uppercase">Step 1 of 7</div>
      <h2 className="text-[20px] font-bold mt-1 mb-[22px]">Tour metadata</h2>

      <div className="grid grid-cols-2 gap-[18px_22px]">
        <label className="block">
          <span className="text-[12.5px] font-semibold">Client full name *</span>
          <input value={store.clientName} onChange={(e) => set('clientName', e.target.value)}
            placeholder="e.g. Familia Rodríguez"
            className="w-full h-[42px] border border-line rounded-[9px] px-[13px] mt-[7px] text-[14px] outline-none focus:border-navy transition-colors" />
        </label>

        <label className="block">
          <span className="text-[12.5px] font-semibold">Number of passengers *</span>
          <input type="number" min={1} value={store.paxCount} onChange={(e) => set('paxCount', parseInt(e.target.value) || 1)}
            className="w-full h-[42px] border border-line rounded-[9px] px-[13px] mt-[7px] text-[14px] outline-none focus:border-navy transition-colors" />
        </label>

        <label className="block">
          <span className="text-[12.5px] font-semibold">Client email</span>
          <input type="email" value={store.clientEmail} onChange={(e) => set('clientEmail', e.target.value)}
            placeholder="client@email.com"
            className="w-full h-[42px] border border-line rounded-[9px] px-[13px] mt-[7px] text-[14px] outline-none focus:border-navy transition-colors" />
        </label>

        <label className="block">
          <span className="text-[12.5px] font-semibold">Client phone</span>
          <input value={store.clientPhone} onChange={(e) => set('clientPhone', e.target.value)}
            placeholder="+1 234 567 890"
            className="w-full h-[42px] border border-line rounded-[9px] px-[13px] mt-[7px] text-[14px] outline-none focus:border-navy transition-colors" />
        </label>
      </div>

      {/* Tour title multilingual */}
      <div className="mt-[22px] pt-[20px] border-t border-line">
        <MultiLangInput
          label="Tour title — per language"
          languages={store.languages}
          values={store.titles}
          onChange={(v) => set('titles', v)}
          placeholder="e.g. Cappadocia & Istanbul Discovery"
        />
      </div>

      <div className="grid grid-cols-2 gap-[18px_22px] mt-[22px]">
        <label className="block">
          <span className="text-[12.5px] font-semibold">Destination / country</span>
          <input value={store.destination} onChange={(e) => set('destination', e.target.value)}
            placeholder="e.g. Türkiye — Istanbul & Cappadocia"
            className="w-full h-[42px] border border-line rounded-[9px] px-[13px] mt-[7px] text-[14px] outline-none focus:border-navy transition-colors" />
        </label>

        <div>
          <span className="text-[12.5px] font-semibold">Languages for this tour *</span>
          <div className="flex gap-2 mt-[7px] flex-wrap">
            {AVAILABLE_LANGUAGES.map(({ code, label }) => {
              const selected = store.languages.includes(code)
              return (
                <button key={code} type="button" onClick={() => toggleLang(code)}
                  className={`px-3 py-2 rounded-[8px] text-[12.5px] font-semibold flex items-center gap-[6px] transition-colors ${
                    selected ? 'bg-navy text-white' : 'border border-dashed border-line text-muted hover:border-navy hover:text-navy'
                  }`}>
                  {selected && <span className="opacity-60 text-xs">✕</span>}
                  {label}
                </button>
              )
            })}
          </div>
          <div className="text-[11.5px] text-gold mt-[7px] font-semibold">
            This determines every multilingual field below.
          </div>
        </div>

        <label className="block">
          <span className="text-[12.5px] font-semibold">Prepared by</span>
          <input value={store.preparedBy} onChange={(e) => set('preparedBy', e.target.value)}
            className="w-full h-[42px] border border-line rounded-[9px] px-[13px] mt-[7px] text-[14px] outline-none bg-bg" />
        </label>

        <label className="block">
          <span className="text-[12.5px] font-semibold">Preparation date</span>
          <input type="date" value={store.preparedDate} onChange={(e) => set('preparedDate', e.target.value)}
            className="w-full h-[42px] border border-line rounded-[9px] px-[13px] mt-[7px] text-[14px] outline-none focus:border-navy transition-colors" />
        </label>

        <label className="block">
          <span className="text-[12.5px] font-semibold">Tour start date *</span>
          <input type="date" value={store.startDate} onChange={(e) => set('startDate', e.target.value)}
            className="w-full h-[42px] border border-line rounded-[9px] px-[13px] mt-[7px] text-[14px] outline-none focus:border-navy transition-colors" />
        </label>

        <label className="block">
          <span className="text-[12.5px] font-semibold">Tour end date *</span>
          <input type="date" value={store.endDate} onChange={(e) => set('endDate', e.target.value)}
            className="w-full h-[42px] border border-line rounded-[9px] px-[13px] mt-[7px] text-[14px] outline-none focus:border-navy transition-colors" />
        </label>
      </div>

      {dayCount > 0 && (
        <div className="bg-green-soft border border-green/30 rounded-[10px] px-[15px] py-[12px] mt-[18px] text-[12.5px] text-[#1f6f4d] font-semibold flex items-center gap-2">
          <CheckCircle size={16} />
          {dayCount} tour days will be auto-generated.
        </div>
      )}

      {/* Cover photo */}
      <div className="mt-5">
        <span className="text-[12.5px] font-semibold">Cover photo</span>
        <div className="mt-2 h-[140px] border-[1.5px] border-dashed border-[#c7cdd6] rounded-[11px] bg-[repeating-linear-gradient(135deg,#eef0f3,#eef0f3_10px,#f5f6f8_10px,#f5f6f8_20px)] flex flex-col items-center justify-center gap-[6px] text-faint cursor-pointer hover:border-navy transition-colors">
          <Upload size={22} />
          <span className="text-[12px] font-mono tracking-wider">DROP COVER PHOTO · 1600×900</span>
          {store.coverPhotoUrl && <span className="text-[11px] text-green">{store.coverPhotoUrl}</span>}
        </div>
      </div>
    </div>
  )
}
