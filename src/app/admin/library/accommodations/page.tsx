'use client'

import { useEffect, useState } from 'react'
import TopBar from '@/components/admin/TopBar'
import { Plus, Trash2, Star } from 'lucide-react'
import { getLang } from '@/lib/i18n'
import toast from 'react-hot-toast'

function AccModal({ item, onClose, onSaved }: { item?: any; onClose: () => void; onSaved: () => void }) {
  const [names, setNames] = useState<Record<string, string>>(item?.names || {})
  const [address, setAddress] = useState(item?.address || '')
  const [stars, setStars] = useState(item?.stars || 0)
  const [lang, setLang] = useState('en')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    const url = item ? `/api/library/accommodations/${item.id}` : '/api/library/accommodations'
    await fetch(url, {
      method: item ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ names, address, stars }),
    })
    setSaving(false)
    toast.success(item ? 'Updated!' : 'Created!')
    onSaved(); onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-[16px] w-full max-w-[480px] shadow-xl">
        <div className="px-6 py-5 border-b border-line flex items-center justify-between">
          <h2 className="font-bold text-[17px]">{item ? 'Edit' : 'Add'} Accommodation</h2>
          <button onClick={onClose} className="text-faint hover:text-ink text-xl">✕</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="flex gap-2 mb-3">
            {['en', 'es', 'tr'].map((l) => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-3 py-[5px] rounded-[7px] text-[12px] font-bold ${lang === l ? 'bg-navy text-white' : 'bg-bg text-muted'}`}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <div>
            <label className="text-[12.5px] font-semibold block mb-2">Name ({lang.toUpperCase()})</label>
            <input value={names[lang] || ''} onChange={(e) => setNames({ ...names, [lang]: e.target.value })}
              className="w-full h-10 border border-line rounded-[9px] px-3 text-[13px] outline-none focus:border-navy" />
          </div>
          <div>
            <label className="text-[12.5px] font-semibold block mb-2">Address / Location</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)}
              className="w-full h-10 border border-line rounded-[9px] px-3 text-[13px] outline-none focus:border-navy" />
          </div>
          <div>
            <label className="text-[12.5px] font-semibold block mb-2">Stars</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setStars(n)}
                  className={`text-[20px] transition-colors ${n <= stars ? 'text-gold' : 'text-[#d4d8df]'}`}>★</button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-line flex justify-end gap-3">
          <button onClick={onClose} className="h-10 border border-line rounded-[9px] px-4 text-[13px] font-semibold hover:bg-bg">Cancel</button>
          <button onClick={save} disabled={saving}
            className="h-10 bg-navy text-white rounded-[9px] px-5 text-[13px] font-semibold hover:bg-navy2 disabled:opacity-60">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AccommodationsPage() {
  const [items, setItems] = useState<any[]>([])
  const [modal, setModal] = useState<any>(null)

  const load = () => fetch('/api/library/accommodations').then((r) => r.json()).then(setItems)
  useEffect(() => { load() }, [])

  const del = async (id: string) => {
    if (!confirm('Delete?')) return
    await fetch(`/api/library/accommodations/${id}`, { method: 'DELETE' })
    toast.success('Deleted')
    load()
  }

  return (
    <>
      <TopBar title="Library" showSearch={false} />
      <div className="flex-1 overflow-y-auto p-7">
        <div className="max-w-[1080px]">
          <div className="flex gap-0 mb-5 border-b border-line">
            {[['visit-points', 'Visit Points'], ['accommodations', 'Accommodations'], ['airlines', 'Airlines'], ['inclusion-items', 'Inclusion Items'], ['cancellation-policies', 'Cancellation Policies']].map(([slug, label]) => (
              <a key={slug} href={`/admin/library/${slug}`}
                className={`px-[4px] mr-[18px] pb-[11px] text-[13.5px] font-semibold border-b-2 transition-colors ${slug === 'accommodations' ? 'border-navy text-ink' : 'border-transparent text-muted hover:text-ink'}`}>
                {label}
              </a>
            ))}
          </div>
          <div className="flex justify-end mb-4">
            <button onClick={() => setModal({})} className="h-10 bg-navy text-white rounded-[9px] px-4 text-[13px] font-semibold flex items-center gap-2">
              <Plus size={15} />Add accommodation
            </button>
          </div>
          <div className="bg-card border border-line rounded-[13px] overflow-hidden">
            {items.map((r) => (
              <div key={r.id} className="flex items-center gap-[14px] px-[18px] py-[15px] border-b border-line group">
                <div className="w-10 h-10 rounded-[9px] bg-navy-soft flex items-center justify-center text-navy font-bold text-[13px] flex-none">
                  {(getLang(r.names, 'en') || 'H').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[14px]">{getLang(r.names, 'en')}</div>
                  <div className="text-[12px] text-muted mt-[2px]">{r.address}</div>
                </div>
                <span className="text-gold text-[13px]">{'★'.repeat(r.stars)}</span>
                <button onClick={() => setModal(r)} className="text-gold text-[12.5px] font-semibold opacity-0 group-hover:opacity-100">Edit</button>
                <button onClick={() => del(r.id)} className="text-faint hover:text-red opacity-0 group-hover:opacity-100 ml-1"><Trash2 size={14} /></button>
              </div>
            ))}
            {items.length === 0 && (
              <div className="p-10 text-center text-muted text-[13px]">
                No accommodations yet. <button onClick={() => setModal({})} className="text-gold font-semibold">Add one →</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {modal !== null && <AccModal item={modal.id ? modal : undefined} onClose={() => setModal(null)} onSaved={load} />}
    </>
  )
}
