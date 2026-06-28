'use client'

import { useEffect, useState } from 'react'
import TopBar from '@/components/admin/TopBar'
import { Plus, Trash2 } from 'lucide-react'
import { getLang } from '@/lib/i18n'
import toast from 'react-hot-toast'

export default function CancellationPoliciesPage() {
  const [items, setItems] = useState<any[]>([])
  const [modal, setModal] = useState<any>(null)
  const [form, setForm] = useState({ titleEn: '', titleEs: '', contentEn: '', contentEs: '', isDefault: false })

  const load = () => fetch('/api/library/cancellation-policies').then((r) => r.json()).then(setItems)
  useEffect(() => { load() }, [])

  const openModal = (item?: any) => {
    setForm(item ? {
      titleEn: getLang(item.titles, 'en'), titleEs: getLang(item.titles, 'es'),
      contentEn: getLang(item.contents, 'en'), contentEs: getLang(item.contents, 'es'),
      isDefault: item.isDefault || false,
    } : { titleEn: '', titleEs: '', contentEn: '', contentEs: '', isDefault: false })
    setModal(item || {})
  }

  const save = async () => {
    const url = modal?.id ? `/api/library/cancellation-policies/${modal.id}` : '/api/library/cancellation-policies'
    await fetch(url, {
      method: modal?.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titles: { en: form.titleEn, es: form.titleEs },
        contents: { en: form.contentEn, es: form.contentEs },
        isDefault: form.isDefault,
      }),
    })
    toast.success('Saved!'); setModal(null); load()
  }

  const del = async (id: string) => {
    if (!confirm('Delete?')) return
    await fetch(`/api/library/cancellation-policies/${id}`, { method: 'DELETE' })
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
                className={`px-[4px] mr-[18px] pb-[11px] text-[13.5px] font-semibold border-b-2 transition-colors ${slug === 'cancellation-policies' ? 'border-navy text-ink' : 'border-transparent text-muted hover:text-ink'}`}>
                {label}
              </a>
            ))}
          </div>
          <div className="flex justify-end mb-4">
            <button onClick={() => openModal()} className="h-10 bg-navy text-white rounded-[9px] px-4 text-[13px] font-semibold flex items-center gap-2">
              <Plus size={15} />Add policy
            </button>
          </div>
          <div className="bg-card border border-line rounded-[13px] overflow-hidden">
            {items.map((r) => (
              <div key={r.id} className="flex items-start gap-[14px] px-[18px] py-[15px] border-b border-line group">
                <div className="w-10 h-10 rounded-[9px] bg-navy-soft flex items-center justify-center text-navy font-bold flex-none">§</div>
                <div className="flex-1">
                  <div className="font-semibold text-[14px]">{getLang(r.titles, 'en')}</div>
                  <div className="text-[12px] text-muted mt-1 line-clamp-2">{getLang(r.contents, 'en')}</div>
                </div>
                {r.isDefault && <span className="bg-gold-soft text-[#7a5826] text-[11px] font-bold px-[9px] py-1 rounded-[6px]">Default</span>}
                <button onClick={() => openModal(r)} className="text-gold text-[12.5px] font-semibold opacity-0 group-hover:opacity-100 mt-[2px]">Edit</button>
                <button onClick={() => del(r.id)} className="text-faint hover:text-red opacity-0 group-hover:opacity-100 mt-[2px]"><Trash2 size={14} /></button>
              </div>
            ))}
            {items.length === 0 && <div className="p-10 text-center text-muted text-[13px]">No policies yet.</div>}
          </div>
        </div>
      </div>
      {modal !== null && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-[16px] w-full max-w-[560px] shadow-xl p-6">
            <h2 className="font-bold text-[17px] mb-4">{modal.id ? 'Edit' : 'Add'} Policy</h2>
            <div className="space-y-3">
              <input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} placeholder="Title (English)" className="w-full h-10 border border-line rounded-[9px] px-3 text-[13px] outline-none focus:border-navy" />
              <input value={form.titleEs} onChange={(e) => setForm({ ...form, titleEs: e.target.value })} placeholder="Title (Español)" className="w-full h-10 border border-line rounded-[9px] px-3 text-[13px] outline-none focus:border-navy" />
              <textarea value={form.contentEn} onChange={(e) => setForm({ ...form, contentEn: e.target.value })} rows={3} placeholder="Content (English)" className="w-full border border-line rounded-[9px] px-3 py-2 text-[13px] outline-none focus:border-navy resize-none" />
              <textarea value={form.contentEs} onChange={(e) => setForm({ ...form, contentEs: e.target.value })} rows={3} placeholder="Content (Español)" className="w-full border border-line rounded-[9px] px-3 py-2 text-[13px] outline-none focus:border-navy resize-none" />
              <label className="flex items-center gap-2 text-[13px] cursor-pointer">
                <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="w-4 h-4" />
                Set as default policy
              </label>
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
