'use client'

import { useTourWizardStore } from '@/store/tourWizardStore'
import { Trash2, Star } from 'lucide-react'
import MultiLangInput from '../MultiLangInput'

export default function Step4Pricing() {
  const store = useTourWizardStore()

  return (
    <div className="animate-tcfade">
      <div className="text-[11px] font-bold text-gold tracking-[0.1em] uppercase">Step 4 of 7</div>
      <h2 className="text-[20px] font-bold mt-1 mb-[18px]">Pricing &amp; payment</h2>

      <div className="border border-line rounded-[11px] overflow-hidden">
        <div className="grid grid-cols-[2fr_1.1fr_0.9fr_2fr_80px] gap-[10px] px-4 py-[11px] bg-bg border-b border-line text-[11.5px] font-semibold text-faint uppercase tracking-[0.05em]">
          <div>Option</div><div>Price / person</div><div>Currency</div><div>Notes</div><div />
        </div>

        {store.priceTable.map((row) => (
          <div key={row.id} className="grid grid-cols-[2fr_1.1fr_0.9fr_2fr_80px] gap-[10px] px-4 py-[10px] border-b border-line items-center">
            <input value={row.option} onChange={(e) => store.updatePriceRow(row.id, { option: e.target.value })}
              placeholder="e.g. Double occupancy"
              className="h-9 border border-line rounded-[7px] px-[10px] text-[13px] font-medium outline-none focus:border-navy" />
            <input value={row.pricePerPerson} onChange={(e) => store.updatePriceRow(row.id, { pricePerPerson: e.target.value })}
              placeholder="2,450"
              className="h-9 border border-line rounded-[7px] px-[10px] text-[13px] font-medium outline-none focus:border-navy" />
            <input value={row.currency} onChange={(e) => store.updatePriceRow(row.id, { currency: e.target.value })}
              placeholder="EUR"
              className="h-9 border border-line rounded-[7px] px-[10px] text-[13px] font-medium outline-none focus:border-navy" />
            <input value={row.notes} onChange={(e) => store.updatePriceRow(row.id, { notes: e.target.value })}
              placeholder="Per person, sharing"
              className="h-9 border border-line rounded-[7px] px-[10px] text-[13px] outline-none focus:border-navy" />
            <div className="flex items-center gap-2">
              <button type="button" title="Recommended"
                onClick={() => store.updatePriceRow(row.id, { recommended: !row.recommended })}
                className={`text-[15px] transition-colors ${row.recommended ? 'text-gold' : 'text-[#d4d8df]'}`}>
                <Star size={15} fill={row.recommended ? 'currentColor' : 'none'} />
              </button>
              <button type="button" onClick={() => store.removePriceRow(row.id)}
                className="text-red hover:opacity-70">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}

        <button type="button" onClick={store.addPriceRow}
          className="px-4 py-[11px] text-gold font-semibold text-[13px] hover:bg-bg w-full text-left transition-colors">
          + Add pricing row
        </button>
      </div>

      <div className="mt-5">
        <div className="text-[13px] font-semibold mb-[9px]">Payment options &amp; deposit</div>
        <MultiLangInput
          languages={store.languages}
          values={store.paymentOptions}
          onChange={(v) => store.setField('paymentOptions', v)}
          multiline
          rows={4}
          placeholder="e.g. Deposit of 25% to confirm. Balance due 30 days before departure…"
        />
      </div>
    </div>
  )
}
