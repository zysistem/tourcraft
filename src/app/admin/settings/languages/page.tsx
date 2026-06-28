'use client'

import { useEffect, useState } from 'react'
import TopBar from '@/components/admin/TopBar'
import { GripVertical, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

const PRESETS = [
  { code: 'en', label: 'English' }, { code: 'es', label: 'Español' },
  { code: 'tr', label: 'Türkçe' }, { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' }, { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' }, { code: 'ar', label: 'العربية' },
  { code: 'zh', label: '中文' }, { code: 'ru', label: 'Русский' },
]

export default function LanguagesSettingsPage() {
  const [languages, setLanguages] = useState<any[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [newLang, setNewLang] = useState({ code: '', label: '' })

  const load = () => {
    fetch('/api/languages').then((r) => r.json()).then(setLanguages)
  }
  useEffect(() => { load() }, [])

  const addLanguage = async () => {
    if (!newLang.code || !newLang.label) return
    await fetch('/api/languages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newLang, isActive: true, order: languages.length }),
    })
    toast.success(`${newLang.label} added`)
    setNewLang({ code: '', label: '' })
    setShowAdd(false)
    load()
  }

  const addPreset = async (preset: typeof PRESETS[0]) => {
    if (languages.find((l) => l.code === preset.code)) {
      toast.error('Language already added')
      return
    }
    await fetch('/api/languages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...preset, isDefault: languages.length === 0, isActive: true, order: languages.length }),
    })
    toast.success(`${preset.label} added`)
    load()
  }

  return (
    <>
      <TopBar title="Settings" showSearch={false} />
      <div className="flex-1 overflow-y-auto p-7">
        <div className="max-w-[840px] animate-tcfade">
          <div className="flex gap-0 mb-[22px] border-b border-line">
            {[['general', 'General'], ['languages', 'Languages'], ['users', 'Users']].map(([slug, label]) => (
              <a key={slug} href={`/admin/settings/${slug}`}
                className={`px-[4px] mr-5 pb-[11px] text-[14px] font-semibold border-b-2 transition-colors ${
                  slug === 'languages' ? 'border-navy text-ink' : 'border-transparent text-muted hover:text-ink'
                }`}>{label}</a>
            ))}
          </div>

          <div className="bg-card border border-line rounded-[14px] p-[24px_26px]">
            <div className="flex items-center justify-between mb-[18px]">
              <h2 className="text-[17px] font-bold">Language management</h2>
              <button onClick={() => setShowAdd(!showAdd)}
                className="h-9 bg-navy text-white rounded-[9px] px-[14px] text-[12.5px] font-semibold hover:bg-navy2 flex items-center gap-2">
                <Plus size={14} />Add language
              </button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 mb-4">
              {PRESETS.filter((p) => !languages.find((l) => l.code === p.code)).map((p) => (
                <button key={p.code} onClick={() => addPreset(p)}
                  className="px-3 py-[6px] border border-dashed border-line rounded-[8px] text-[12px] font-semibold text-muted hover:border-navy hover:text-navy transition-colors">
                  + {p.label}
                </button>
              ))}
            </div>

            {showAdd && (
              <div className="flex gap-3 mb-4 p-4 bg-bg rounded-[10px] border border-line">
                <input value={newLang.code} onChange={(e) => setNewLang({ ...newLang, code: e.target.value })}
                  placeholder="Code (e.g. ja)" className="h-9 border border-line rounded-[8px] px-3 w-24 text-[13px] outline-none focus:border-navy" />
                <input value={newLang.label} onChange={(e) => setNewLang({ ...newLang, label: e.target.value })}
                  placeholder="Label (e.g. 日本語)" className="h-9 border border-line rounded-[8px] px-3 flex-1 text-[13px] outline-none focus:border-navy" />
                <button onClick={addLanguage} className="h-9 bg-navy text-white rounded-[8px] px-3 text-[13px] font-semibold">Add</button>
              </div>
            )}

            <div className="border border-line rounded-[11px] overflow-hidden">
              {languages.map((l) => (
                <div key={l.id} className="flex items-center gap-[14px] px-4 py-[14px] border-b border-line">
                  <GripVertical size={14} className="text-[#b4bac4]" />
                  <span className="font-mono font-bold text-[13px] bg-bg px-[9px] py-1 rounded-[6px]">{l.code}</span>
                  <span className="font-semibold text-[14px] flex-1">{l.label}</span>
                  {l.isDefault && (
                    <span className="bg-gold-soft text-[#7a5826] text-[10px] font-bold px-[9px] py-1 rounded-[6px]">DEFAULT</span>
                  )}
                  <span className={`text-[10px] font-bold px-[9px] py-1 rounded-[6px] ${
                    l.isActive ? 'bg-green-soft text-green' : 'bg-[#f0f1f4] text-faint'
                  }`}>{l.isActive ? 'ACTIVE' : 'OFF'}</span>
                </div>
              ))}
              {languages.length === 0 && (
                <div className="px-4 py-8 text-center text-muted text-[13px]">
                  No languages configured. Add English to get started.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
