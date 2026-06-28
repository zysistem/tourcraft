'use client'

import { useEffect, useState } from 'react'
import TopBar from '@/components/admin/TopBar'
import toast from 'react-hot-toast'

const COLORS = ['#1B2A4A', '#0f5132', '#6b2737', '#2b3a55', '#1a1a1a']

export default function GeneralSettingsPage() {
  const [settings, setSettings] = useState<any>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then(setSettings)
  }, [])

  const set = (k: string, v: string) => setSettings((s: any) => ({ ...s, [k]: v }))

  const save = async () => {
    setSaving(true)
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    toast.success('Settings saved!')
    setSaving(false)
  }

  return (
    <>
      <TopBar title="Settings" showSearch={false} />
      <div className="flex-1 overflow-y-auto p-7">
        <div className="max-w-[840px] animate-tcfade">
          {/* Settings sub-tabs */}
          <div className="flex gap-0 mb-[22px] border-b border-line">
            {[['general', 'General'], ['languages', 'Languages'], ['users', 'Users']].map(([slug, label]) => (
              <a key={slug} href={`/admin/settings/${slug}`}
                className={`px-[4px] mr-5 pb-[11px] text-[14px] font-semibold border-b-2 transition-colors ${
                  slug === 'general' ? 'border-navy text-ink' : 'border-transparent text-muted hover:text-ink'
                }`}>{label}</a>
            ))}
          </div>

          <div className="bg-card border border-line rounded-[14px] p-[24px_26px]">
            <h2 className="text-[17px] font-bold mb-5">General settings</h2>

            {/* Logo */}
            <div className="flex gap-[18px] items-center mb-[22px] pb-[22px] border-b border-line">
              <div className="w-[72px] h-[72px] rounded-[14px] flex items-center justify-center text-[#3a2a14] font-black text-[30px]"
                style={{ background: `linear-gradient(135deg, ${settings.primaryColor || '#b08147'}, #cda06a)` }}>
                {settings.companyName?.[0] || 'T'}
              </div>
              <div>
                <div className="font-semibold text-[14px]">Company logo</div>
                <div className="text-[12px] text-muted mt-[3px]">PNG or SVG, min 240×240</div>
                <button className="mt-2 h-8 border border-line bg-card rounded-[8px] px-3 text-[12px] font-semibold hover:bg-bg">
                  Upload new
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-[18px_22px]">
              {[
                ['companyName', 'Company name', 'TourCraft'],
                ['companyWebsite', 'Website', 'yourcompany.com'],
                ['companyPhone', 'Phone', '+1 234 567 890'],
                ['companyAddress', 'Address', '123 Main St, City'],
                ['defaultCurrency', 'Default currency', 'EUR (€)'],
                ['timezone', 'Timezone', 'UTC'],
              ].map(([key, label, placeholder]) => (
                <label key={key} className="block">
                  <span className="text-[12.5px] font-semibold">{label}</span>
                  <input value={settings[key] || ''} onChange={(e) => set(key, e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-[42px] border border-line rounded-[9px] px-[13px] mt-[7px] text-[14px] outline-none focus:border-navy" />
                </label>
              ))}
            </div>

            {/* Brand color */}
            <div className="mt-[22px]">
              <span className="text-[12.5px] font-semibold">Primary brand color</span>
              <div className="flex gap-[10px] mt-[9px]">
                {COLORS.map((c) => (
                  <button key={c} onClick={() => set('primaryColor', c)}
                    className="w-[34px] h-[34px] rounded-[8px] transition-all"
                    style={{
                      background: c,
                      outline: settings.primaryColor === c ? `2px solid ${c}` : 'none',
                      outlineOffset: '2px',
                    }} />
                ))}
              </div>
            </div>

            <button onClick={save} disabled={saving}
              className="mt-6 h-[42px] bg-navy text-white rounded-[10px] px-[22px] text-[13.5px] font-semibold hover:bg-navy2 disabled:opacity-60">
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
