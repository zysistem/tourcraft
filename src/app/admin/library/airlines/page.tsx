'use client'

import { useEffect, useState } from 'react'
import TopBar from '@/components/admin/TopBar'
import { Plus, Trash2 } from 'lucide-react'
import { getLang } from '@/lib/i18n'
import toast from 'react-hot-toast'

export default function AirlinesPage() {
  const [items, setItems] = useState<any[]>([])
  const [modal, setModal] = useState<any>(null)
  const [form, setForm] = useState({ nameEn: '', iataCode: '' })

  const load = () => fetch('/api/library/airlines').then((r) => r.json()).then(setItems)
  useEffect(() => { load() }, [])

  const save = async () => {
    const url = modal?.id ? `/api/library/airlines/${modal.id}` : '/api/library/airlines'
    await fetch(url, {
      method: modal?.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ names: { en: form.nameEn }, iataCode: form.iataCode }),
    })
    toast.success('Saved!')
    setModal(null)
    load()
  }

  const openModal = (item?: any) => {
    setForm(item ? { nameEn: getLang(item.names, 'en'), iataCode: item.iataCode || '' } : { nameEn: '', iataCode: '' })
    setModal(item || {})
  }

  return (
    <>
      <TopBar title="Library" showSearch={false} />
      <div className="flex-1 overflow-y-auto p-7">
        <div className="max-w-[1080px]">
          <div className="flex gap-0 mb-5 border-b border-line">
            {[['visit-points', 'Visit Points'], ['accommodations', 'Accommodations'], ['airlines', 'Airlines'], ['inclusion-items', 'Inclusion Items'], ['cancellation-policies', 'Cancellation Policies']].map(([slug, label]) => (
              <a key={slug} href={`/admin/library/${slug}`}
                className={`px-[4px] mr-[18px] pb-[11px] text-[13.5px] font-semibold border-b-2 transition-colors ${slug === 'airlines' ? 'border-navy text-ink' : 'border-transparent text-muted hover:text-ink'}`}>
                {label}
              </a>
            ))}
          </div>
          <div className="flex justify-end mb-4">
            <button onClick={() => openModal()} className="h-10 bg-navy text-white rounded-[9px] px-4 text-[13px] font-semibold flex items-center gap-2">
              <Plus size={15} />Add airline
            </button>
          </div>
          <div className="bg-card border border-line rounded-[13px] overflow-hidden">
            {items.map((r) => (
              <div key={r.id} className="flex items-center gap-[14px] px-[18px] py-[15px] border-b border-line group">
                <div className="w-10 h-10 rounded-[9px] bg-navy-soft flex items-center justify-center text-navy font-bold text-[13px] flex-none">
                  {r.iataCode || getLang(r.names, 'en').slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1"><div className="font-semibold text-[14px]">{getLang(r.names, 'en')}</div>
                  <div className="text-[12px] text-muted">IATA: {r.iataCode || '—'}</div></div>
                <span className="bg-green-soft text-green text-[11px] font-bold px-[9px] py-1 rounded-[6px]">Active</span>
                <button onClick={() => openModal(r)} className="text-gold text-[12.5px] font-semibold opacity-0 group-hover:opacity-100">Edit</button>
              </div>
            ))}
            {items.length === 0 && <div className="p-10 text-center text-muted text-[13px]">No airlines yet.</div>}
          </div>
        </div>
      </div>
      {modal !== null && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-[16px] w-full max-w-[400px] shadow-xl p-6">
            <h2 className="font-bold text-[17px] mb-4">{modal.id ? 'Edit' : 'Add'} Airline</h2>
            <div className="space-y-3">
              <input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                placeholder="Airline name (English)"
                className="w-full h-10 border border-line rounded-[9px] px-3 text-[13px] outline-none focus:border-navy" />
              <input value={form.iataCode} onChange={(e) => setForm({ ...form, iataCode: e.target.value.toUpperCase() })}
                placeholder="IATA code (e.g. TK)"
                className="w-full h-10 border border-line rounded-[9px] px-3 text-[13px] outline-none focus:border-navy font-mono" />
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setModal(null)} className="h-10 border border-line rounded-[9px] px-4 text-[13px] font-semibold hover:bg-bg">Cancel</button>
              <button onClick={save} className="h-10 bg-navy text-white rounded-[9px] px-5 text-[13px] font-semibold">Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
