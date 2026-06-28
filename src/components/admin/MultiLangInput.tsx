'use client'

import { useState } from 'react'

interface MultiLangInputProps {
  languages: string[]
  values: Record<string, string>
  onChange: (values: Record<string, string>) => void
  placeholder?: string
  multiline?: boolean
  rows?: number
  label?: string
}

const LANG_LABELS: Record<string, string> = {
  en: 'EN', es: 'ES', tr: 'TR', fr: 'FR', de: 'DE',
  it: 'IT', pt: 'PT', ar: 'AR', zh: 'ZH', ru: 'RU',
}

export default function MultiLangInput({
  languages,
  values,
  onChange,
  placeholder,
  multiline = false,
  rows = 4,
  label,
}: MultiLangInputProps) {
  const [activeLang, setActiveLang] = useState(languages[0] || 'en')

  const hasMissing = (lang: string) => !values[lang] || values[lang].trim() === ''

  const update = (lang: string, val: string) => {
    onChange({ ...values, [lang]: val })
  }

  return (
    <div>
      {label && <div className="text-[12.5px] font-semibold mb-[7px]">{label}</div>}
      <div className="flex gap-[6px] mb-3">
        {languages.map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => setActiveLang(lang)}
            className={`flex items-center gap-[6px] px-[13px] py-[6px] rounded-[8px] text-[12.5px] font-semibold transition-colors ${
              activeLang === lang ? 'bg-navy text-white' : 'bg-bg text-muted hover:text-ink'
            }`}>
            {LANG_LABELS[lang] || lang.toUpperCase()}
            {hasMissing(lang) && lang !== activeLang && (
              <span className="w-[6px] h-[6px] rounded-full bg-amber flex-none" />
            )}
          </button>
        ))}
      </div>
      {multiline ? (
        <textarea
          value={values[activeLang] || ''}
          onChange={(e) => update(activeLang, e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full border border-line rounded-[9px] px-[13px] py-[10px] text-[14px] font-normal outline-none focus:border-navy transition-colors resize-vertical"
        />
      ) : (
        <input
          type="text"
          value={values[activeLang] || ''}
          onChange={(e) => update(activeLang, e.target.value)}
          placeholder={placeholder}
          className="w-full h-[42px] border border-line rounded-[9px] px-[13px] text-[14px] outline-none focus:border-navy transition-colors"
        />
      )}
      <div className="text-[11.5px] text-faint mt-[6px]">
        Editing <strong>{activeLang.toUpperCase()}</strong> — switch tabs to enter other languages.
      </div>
    </div>
  )
}
