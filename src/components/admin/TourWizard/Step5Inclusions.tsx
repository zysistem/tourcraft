'use client'

import { useEffect, useState } from 'react'
import { useTourWizardStore } from '@/store/tourWizardStore'
import { getLang } from '@/lib/i18n'
import { Check, X } from 'lucide-react'

export default function Step5Inclusions() {
  const store = useTourWizardStore()
  const [items, setItems] = useState<any[]>([])
  const lang = store.languages[0] || 'en'

  useEffect(() => {
    fetch('/api/library/inclusion-items')
      .then((r) => r.json())
      .then(setItems)
  }, [])

  const toggleIncluded = (id: string) => {
    if (store.includedItemIds.includes(id)) {
      store.setField('includedItemIds', store.includedItemIds.filter((i) => i !== id))
    } else {
      store.setField('includedItemIds', [...store.includedItemIds, id])
      store.setField('excludedItemIds', store.excludedItemIds.filter((i) => i !== id))
    }
  }

  const toggleExcluded = (id: string) => {
    if (store.excludedItemIds.includes(id)) {
      store.setField('excludedItemIds', store.excludedItemIds.filter((i) => i !== id))
    } else {
      store.setField('excludedItemIds', [...store.excludedItemIds, id])
      store.setField('includedItemIds', store.includedItemIds.filter((i) => i !== id))
    }
  }

  const addCustomItem = async (type: 'included' | 'excluded') => {
    const label = prompt(`New ${type} item (English label):`)
    if (!label) return
    const res = await fetch('/api/library/inclusion-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ labels: { en: label }, defaultType: type }),
    })
    const newItem = await res.json()
    setItems((prev) => [...prev, newItem])
    if (type === 'included') {
      store.setField('includedItemIds', [...store.includedItemIds, newItem.id])
    } else {
      store.setField('excludedItemIds', [...store.excludedItemIds, newItem.id])
    }
  }

  return (
    <div className="animate-tcfade">
      <div className="text-[11px] font-bold text-gold tracking-[0.1em] uppercase">Step 5 of 7</div>
      <h2 className="text-[20px] font-bold mt-1 mb-[18px]">Inclusions &amp; exclusions</h2>

      <div className="grid grid-cols-2 gap-[18px]">
        {/* Included */}
        <div className="border border-[#cdeede] rounded-[12px] overflow-hidden">
          <div className="bg-green-soft px-4 py-3 font-bold text-[13.5px] text-[#1f6f4d] flex items-center gap-2">
            <Check size={16} strokeWidth={2.4} />What's included
          </div>
          {items.filter((i) => i.defaultType === 'included' || store.includedItemIds.includes(i.id)).map((item) => {
            const on = store.includedItemIds.includes(item.id)
            return (
              <div key={item.id} onClick={() => toggleIncluded(item.id)}
                className="flex items-center gap-[11px] px-4 py-[11px] border-b border-line cursor-pointer hover:bg-bg">
                <span className={`w-5 h-5 rounded-[6px] flex items-center justify-center text-[13px] text-white font-black flex-none ${
                  on ? 'bg-green border-green' : 'bg-white border border-[#d4d8df]'
                }`}>{on ? '✓' : ''}</span>
                <span className={`text-[13.5px] ${on ? 'text-ink font-medium' : 'text-faint'}`}>
                  {getLang(item.labels, lang)}
                </span>
              </div>
            )
          })}
          <button type="button" onClick={() => addCustomItem('included')}
            className="px-4 py-[11px] text-green font-semibold text-[13px] hover:bg-bg w-full text-left">
            + Add custom item
          </button>
        </div>

        {/* Excluded */}
        <div className="border border-[#f0d6d1] rounded-[12px] overflow-hidden">
          <div className="bg-red-soft px-4 py-3 font-bold text-[13.5px] text-[#9e3d33] flex items-center gap-2">
            <X size={16} strokeWidth={2.4} />Not included
          </div>
          {items.filter((i) => i.defaultType === 'excluded' || store.excludedItemIds.includes(i.id)).map((item) => {
            const on = store.excludedItemIds.includes(item.id)
            return (
              <div key={item.id} onClick={() => toggleExcluded(item.id)}
                className="flex items-center gap-[11px] px-4 py-[11px] border-b border-line cursor-pointer hover:bg-bg">
                <span className={`w-5 h-5 rounded-[6px] flex items-center justify-center text-[13px] text-white font-black flex-none ${
                  on ? 'bg-red border-red' : 'bg-white border border-[#d4d8df]'
                }`}>{on ? '✓' : ''}</span>
                <span className={`text-[13.5px] ${on ? 'text-ink font-medium' : 'text-faint'}`}>
                  {getLang(item.labels, lang)}
                </span>
              </div>
            )
          })}
          <button type="button" onClick={() => addCustomItem('excluded')}
            className="px-4 py-[11px] text-red font-semibold text-[13px] hover:bg-bg w-full text-left">
            + Add custom item
          </button>
        </div>
      </div>
    </div>
  )
}
