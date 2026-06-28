'use client'

import { useEffect, useState } from 'react'
import TopBar from '@/components/admin/TopBar'
import { Search, Plus, Edit, Trash2 } from 'lucide-react'
import { getLang } from '@/lib/i18n'
import toast from 'react-hot-toast'

const LANG_BADGE: Record<string, string> = { en: 'EN', es: 'ES', tr: 'TR', fr: 'FR' }

function VisitPointModal({ item, onClose, onSaved }: { item?: any; onClose: () => void; onSaved: () => void }) {
  const [names, setNames] = useState<Record<string, string>>(item?.names || {})
  const [descs, setDescs] = useState<Record<string, string>>(item?.descriptions || {})
  const [category, setCategory] = useState(item?.category || '')
  const [activeLang, setActiveLang] = useState('en')
  const [saving, setSaving] = useState(false)

  const langs = ['en', 'es', 'tr', 'fr']

  const save = async () => {
    setSaving(true)
    const url = item ? `/api/library/visit-points/${item.id}` : '/api/library/visit-points'
    const method = item ? 'PATCH' : 'POST'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ names, descriptions: descs, category }),
    })
    setSaving(false)
    toast.success(item ? 'Updated!' : 'Created!')
    onSaved()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-[16px] w-full max-w-[560px] shadow-xl">
        <div className="px-6 py-5 border-b border-line flex items-center justify-between">
          <h2 className="font-bold text-[17px]">{item ? 'Edit' : 'Add'} Visit Point</h2>
          <button onClick={onClose} className="text-faint hover:text-ink text-xl">✕</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="text-[12.5px] font-semibold block mb-2">Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)}
              placeholder="Landmark, Heritage, Experience…"
              className="w-full h-10 border border-line rounded-[9px] px-3 text-[13px] outline-none focus:border-navy" />
          </div>
          <div className="flex gap-2">
            {langs.map((l) => (
              <button key={l} onClick={() => setActiveLang(l)}
                className={`px-3 py-[5px] rounded-[7px] text-[12px] font-bold transition-colors ${
                  activeLang === l ? 'bg-navy text-white' : 'bg-bg text-muted'
                }`}>{l.toUpperCase()}</button>
            ))}
          </div>
          <div>
            <label className="text-[12.5px] font-semibold block mb-2">Name ({activeLang.toUpperCase()})</label>
            <input value={names[activeLang] || ''} onChange={(e) => setNames({ ...names, [activeLang]: e.target.value })}
              className="w-full h-10 border border-line rounded-[9px] px-3 text-[13px] outline-none focus:border-navy" />
          </div>
          <div>
            <label className="text-[12.5px] font-semibold block mb-2">Description ({activeLang.toUpperCase()})</label>
            <textarea value={descs[activeLang] || ''} onChange={(e) => setDescs({ ...descs, [activeLang]: e.target.value })}
              rows={3} className="w-full border border-line rounded-[9px] px-3 py-2 text-[13px] outline-none focus:border-navy resize-none" />
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

export default function VisitPointsPage() {
  const [items, setItems] = useState<any[]>([])
  const [q, setQ] = useState('')
  const [modal, setModal] = useState<any>(null) // null = closed, {} = new, item = edit

  const load = () => {
    fetch(`/api/library/visit-points${q ? `?q=${q}` : ''}`)
      .then((r) => r.json())
      .then(setItems)
  }

  useEffect(() => { load() }, [q])

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this visit point?')) return
    await fetch(`/api/library/visit-points/${id}`, { method: 'DELETE' })
    toast.success('Deleted')
    load()
  }

  return (
    <>
      <TopBar title="Library" showSearch={false} />
      <div className="flex-1 overflow-y-auto p-7">
        <div className="max-w-[1080px] animate-tcfade">
          {/* Library sub-tabs */}
          <div className="flex gap-0 mb-5 border-b border-line">
            {[
              ['visit-points', 'Visit Points'], ['accommodations', 'Accommodations'],
              ['airlines', 'Airlines'], ['inclusion-items', 'Inclusion Items'],
              ['cancellation-policies', 'Cancellation Policies'],
            ].map(([slug, label]) => (
              <a key={slug} href={`/admin/library/${slug}`}
                className={`px-[4px] mr-[18px] pb-[11px] text-[13.5px] font-semibold cursor-pointer border-b-2 transition-colors ${
                  slug === 'visit-points' ? 'border-navy text-ink' : 'border-transparent text-muted hover:text-ink'
                }`}>{label}</a>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-[320px]">
              <Search size={16} className="absolute left-[11px] top-1/2 -translate-y-1/2 text-faint" />
              <input value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="Search visit points…"
                className="w-full h-10 border border-line rounded-[9px] pl-[34px] pr-3 text-[13px] bg-card outline-none focus:border-navy" />
            </div>
            <div className="flex-1" />
            <button onClick={() => setModal({})}
              className="h-10 bg-navy text-white rounded-[9px] px-4 text-[13px] font-semibold flex items-center gap-2 hover:bg-navy2">
              <Plus size={15} />Add visit point
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-4">
            {items.map((v) => {
              const langs = Object.keys(v.names || {})
              return (
                <div key={v.id} className="bg-card border border-line rounded-[13px] overflow-hidden group">
                  <div className="h-[120px] bg-[repeating-linear-gradient(135deg,#e9ebef,#e9ebef_9px,#eef0f3_9px,#eef0f3_18px)] flex items-center justify-center text-faint text-[10px] font-mono relative">
                    PHOTO
                    {v.category && (
                      <span className="absolute top-[10px] left-[10px] bg-navy/90 text-white text-[10.5px] font-semibold px-[9px] py-1 rounded-[6px]">
                        {v.category}
                      </span>
                    )}
                  </div>
                  <div className="p-[13px_15px]">
                    <div className="font-semibold text-[14px]">{getLang(v.names, 'en') || 'Untitled'}</div>
                    <div className="text-[12px] text-muted mt-[3px] leading-[1.5] line-clamp-2">
                      {getLang(v.descriptions, 'en')}
                    </div>
                    <div className="flex items-center gap-[6px] mt-[10px]">
                      {['en', 'es', 'tr'].map((l) => (
                        <span key={l} className={`text-[10px] font-bold px-[7px] py-[3px] rounded-[5px] ${
                          (v.names as any)?.[l]
                            ? 'bg-green-soft text-green'
                            : 'bg-amber-soft text-amber'
                        }`}>{l.toUpperCase()}{!(v.names as any)?.[l] ? ' ●' : ''}</span>
                      ))}
                      <div className="flex-1" />
                      <button onClick={() => setModal(v)} className="text-gold text-[12px] font-semibold hover:underline">Edit</button>
                      <button onClick={() => deleteItem(v.id)} className="text-faint hover:text-red ml-1">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {items.length === 0 && (
            <div className="text-center py-16 text-muted">
              <div className="text-[15px] font-semibold mb-2">No visit points yet</div>
              <button onClick={() => setModal({})} className="text-gold font-semibold text-[13px] hover:underline">
                + Add your first visit point
              </button>
            </div>
          )}
        </div>
      </div>

      {modal !== null && (
        <VisitPointModal
          item={modal.id ? modal : undefined}
          onClose={() => setModal(null)}
          onSaved={load}
        />
      )}
    </>
  )
}
