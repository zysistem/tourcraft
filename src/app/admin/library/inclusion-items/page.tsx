'use client'

import { useEffect, useState } from 'react'
import TopBar from '@/components/admin/TopBar'
import { Plus, Trash2, Check, X } from 'lucide-react'
import { getLang } from '@/lib/i18n'
import toast from 'react-hot-toast'

export default function InclusionItemsPage() {
  const [items, setItems] = useState<any[]>([])
  const [modal, setModal] = useState<any>(null)
  const [form, setForm] = useState({ labelEn: '', labelEs: '', icon: '', type: 'included' })

  const load = () => fetch('/api/library/inclusion-items').then((r) => r.json()).then(setItems)
  useEffect(() => { load() }, [])

  const openModal = (item?: any) => {
    setForm(item ? {
      labelEn: getLang(item.labels, 'en'), labelEs: getLang(item.labels, 'es'),
      icon: item.icon || '', type: item.defaultType || 'included'
    } : { labelEn: '', labelEs: '', icon: '', type: 'included' })
    setModal(item || {})
  }

  const save = async () => {
    const url = modal?.id ? `/api/library/inclusion-items/${modal.id}` : '/api/library/inclusion-items'
    await fetch(url, {
      method: modal?.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ labels: { en: form.labelEn, es: form.labelEs }, icon: form.icon, defaultType: form.type }),
    })
    toast.success('Saved!'); setModal(null); load()
  }

  const del = async (id: string) => {
    if (!confirm('Delete?')) return
    await fetch(`/api/library/inclusion-items/${id}`, { method: 'DELETE' })
    toast.success('Deleted'); load()
  }

  return (
    <>
      <TopBar title="Library" showSearch={false} />
      <div className="flex-1 overflow-y-auto p-7">
        <div className="max-w-[1080px]">
          <div className="flex gap-0 mb-5 border-b border-line">
            {[['visit-points', 'Visit Points'], ['accommodations', 'Accommodations'], ['airlines', 'Airlines'], ['inclusion-items', 'Inclusion Items'], ['cancellation-policies', 'Cancellation Policies']].map(([slug, label]) => (
              <a key={slug} href={`/admin/library/${slug}`}
                className={`px-[4px] mr-[18px] pb-[11px] text-[13.5px] font-semibold border-b-2 transition-colors ${slug === 'inclusion-items' ? 'border-navy text-ink' : 'border-transparent text-muted hover:text-ink'}`}>
                {label}
              </a>
            ))}
          </div>
          <div className="flex justify-end mb-4">
            <button onClick={() => openModal()} className="h-10 bg-navy text-white rounded-[9px] px-4 text-[13px] font-semibold flex items-center gap-2">
              <Plus size={15} />Add item
            </button>
          </div>
          <div className="bg-card border border-line rounded-[13px] overflow-hidden">
            {items.map((r) => (
              <div key={r.id} className="flex items-center gap-[14px] px-[18px] py-[15px] border-b border-line group">
                <div className={`w-10 h-10 rounded-[9px] flex items-center justify-center text-[13px] flex-none ${r.defaultType === 'included' ? 'bg-green-soft text-green' : 'bg-red-soft text-red'}`}>
                  {r.defaultType === 'included' ? <Check size={16} /> : <X size={16} />}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[14px]">{getLang(r.labels, 'en')}</div>
                  <div className="text-[12px] text-muted">{getLang(r.labels, 'es') && `ES: ${getLang(r.labels, 'es')}`}</div>
                </div>
                <span className={`text-[11px] font-bold px-[9px] py-1 rounded-[6px] ${r.defaultType === 'included' ? 'bg-green-soft text-green' : 'bg-red-soft text-red'}`}>
                  {r.defaultType === 'included' ? 'Included' : 'Excluded'}
                </span>
                <button onClick={() => openModal(r)} className="text-gold text-[12.5px] font-semibold opacity-0 group-hover:opacity-100">Edit</button>
                <button onClick={() => del(r.id)} className="text-faint hover:text-red opacity-0 group-hover:opacity-100 ml-1"><Trash2 size={14} /></button>
              </div>
            ))}
            {items.length === 0 && <div className="p-10 text-center text-muted text-[13px]">No inclusion items yet.</div>}
          </div>
        </div>
      </div>
      {modal !== null && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-[16px] w-full max-w-[440px] shadow-xl p-6">
            <h2 className="font-bold text-[17px] mb-4">{modal.id ? 'Edit' : 'Add'} Inclusion Item</h2>
            <div className="space-y-3">
              <input value={form.labelEn} onChange={(e) => setForm({ ...form, labelEn: e.target.value })} placeholder="Label (English)" className="w-full h-10 border border-line rounded-[9px] px-3 text-[13px] outline-none focus:border-navy" />
              <input value={form.labelEs} onChange={(e) => setForm({ ...form, labelEs: e.target.value })} placeholder="Label (Español)" className="w-full h-10 border border-line rounded-[9px] px-3 text-[13px] outline-none focus:border-navy" />
              <div className="flex gap-3">
                <button onClick={() => setForm({ ...form, type: 'included' })} className={`flex-1 h-10 rounded-[9px] text-[13px] font-semibold border transition-colors ${form.type === 'included' ? 'bg-green text-white border-green' : 'border-line hover:bg-bg'}`}>✓ Included</button>
                <button onClick={() => setForm({ ...form, type: 'excluded' })} className={`flex-1 h-10 rounded-[9px] text-[13px] font-semibold border transition-colors ${form.type === 'excluded' ? 'bg-red text-white border-red' : 'border-line hover:bg-bg'}`}>✕ Excluded</button>
              </div>
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
