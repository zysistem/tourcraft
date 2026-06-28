'use client'

import { useTourWizardStore } from '@/store/tourWizardStore'
import MultiLangInput from '../MultiLangInput'

export default function Step3Description() {
  const store = useTourWizardStore()

  return (
    <div className="animate-tcfade">
      <div className="text-[11px] font-bold text-gold tracking-[0.1em] uppercase">Step 3 of 7</div>
      <h2 className="text-[20px] font-bold mt-1 mb-[6px]">Tour description</h2>
      <p className="text-[13px] text-muted mb-[18px]">
        A general summary shown at the top of the public page and PDF. One version per selected language.
      </p>

      <MultiLangInput
        languages={store.languages}
        values={store.descriptionBlock}
        onChange={(v) => store.setField('descriptionBlock', v)}
        multiline
        rows={10}
        placeholder="Describe the overall tour experience…"
      />
    </div>
  )
}
