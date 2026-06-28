'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import TopBar from '@/components/admin/TopBar'
import { Plus, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function ToursPage() {
  const router = useRouter()
  const [tours, setTours] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [loading, setLoading] = useState(true)

  const fetchTours = async () => {
    setLoading(true)
    const url = filter === 'all' ? '/api/tours' : `/api/tours?status=${filter}`
    const res = await fetch(url)
    const data = await res.json()
    setTours(data.tours || [])
    setLoading(false)
  }

  useEffect(() => { fetchTours() }, [filter])

  const deleteTour = async (id: string) => {
    if (!confirm('Delete this tour? This cannot be undone.')) return
    await fetch(`/api/tours/${id}`, { method: 'DELETE' })
    toast.success('Tour deleted')
    fetchTours()
  }

  const counts = { all: tours.length }

  return (
    <>
      <TopBar title="Tour Programs" showNewTour />
      <div className="flex-1 overflow-y-auto p-7">
        <div className="max-w-[1080px] animate-tcfade">
          {/* Filter tabs */}
          <div className="flex items-center gap-[10px] mb-[18px]">
            <div className="flex bg-card border border-line rounded-[9px] p-[3px]">
              {(['all', 'published', 'draft'] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-[13px] py-[6px] rounded-[7px] text-[12.5px] font-semibold transition-colors ${
                    filter === f ? 'bg-navy text-white' : 'text-muted hover:text-ink'
                  }`}>
                  {f === 'all' ? 'All' : f === 'published' ? 'Published' : 'Drafts'} · {tours.filter(t => f === 'all' || t.status === f).length}
                </button>
              ))}
            </div>
            <div className="flex-1" />
            <Link href="/admin/tours/new"
              className="h-[38px] bg-navy text-white rounded-[9px] px-4 text-[13px] font-semibold flex items-center gap-2 hover:bg-navy2 transition-colors">
              <Plus size={15} />New Tour
            </Link>
          </div>

          {/* Table */}
          <div className="bg-card border border-line rounded-[14px] overflow-hidden">
            <div className="grid grid-cols-[2.4fr_1.3fr_1fr_1fr_0.8fr_40px] gap-3 px-5 py-[13px] border-b border-line text-[11.5px] font-semibold text-faint uppercase tracking-[0.06em]">
              <div>Tour</div><div>Client</div><div>Dates</div><div>Languages</div><div>Status</div><div />
            </div>

            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="grid grid-cols-[2.4fr_1.3fr_1fr_1fr_0.8fr_40px] gap-3 px-5 py-[15px] border-b border-line items-center">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="h-4 bg-bg rounded animate-pulse" />
                  ))}
                </div>
              ))
            ) : tours.filter(t => filter === 'all' || t.status === filter).length === 0 ? (
              <div className="p-10 text-center text-muted text-[13px]">
                No tours found. <Link href="/admin/tours/new" className="text-gold font-semibold">Create your first tour →</Link>
              </div>
            ) : (
              tours.filter(t => filter === 'all' || t.status === filter).map((t) => (
                <div key={t.id}
                  className="grid grid-cols-[2.4fr_1.3fr_1fr_1fr_0.8fr_40px] gap-3 px-5 py-[15px] border-b border-line items-center hover:bg-bg transition-colors group">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push(`/admin/tours/${t.id}/edit`)}>
                    <div className="w-[42px] h-[42px] rounded-[9px] bg-[repeating-linear-gradient(135deg,#e9ebef,#e9ebef_7px,#eef0f3_7px,#eef0f3_14px)] flex-none" />
                    <div>
                      <div className="font-semibold text-[13.5px]">{(t.titles as any)?.en || 'Untitled'}</div>
                      <div className="text-[11.5px] text-muted mt-[2px]">{t.durationDays} days · {t.paxCount} pax</div>
                    </div>
                  </div>
                  <div className="text-[13px]">{t.clientName}</div>
                  <div className="text-[12.5px] text-muted">
                    {t.startDate ? format(new Date(t.startDate), 'MMM d') : '—'}
                    {t.endDate ? `–${format(new Date(t.endDate), 'd')}` : ''}
                  </div>
                  <div className="text-[12px] text-muted">{(t.languages || []).map((l: string) => l.toUpperCase()).join(' · ')}</div>
                  <div>
                    <span className={`text-[10.5px] font-bold px-[10px] py-1 rounded-[20px] ${
                      t.status === 'published' ? 'bg-green-soft text-green' : 'bg-amber-soft text-amber'
                    }`}>
                      {t.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <button onClick={() => deleteTour(t.id)}
                    className="opacity-0 group-hover:opacity-100 text-faint hover:text-red transition-all">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
