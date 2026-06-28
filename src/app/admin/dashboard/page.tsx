'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TopBar from '@/components/admin/TopBar'
import { Plus, Star, Globe } from 'lucide-react'
import { format } from 'date-fns'

interface Stats {
  total: number
  drafts: number
  publishedThisMonth: number
  libraryItems: number
  recentTours: any[]
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/tours?limit=4')
      .then((r) => r.json())
      .then((data) => {
        setStats({
          total: data.total || 0,
          drafts: data.drafts || 0,
          publishedThisMonth: data.publishedThisMonth || 0,
          libraryItems: data.libraryItems || 0,
          recentTours: data.tours?.slice(0, 4) || [],
        })
      })
      .catch(() => {
        setStats({ total: 0, drafts: 0, publishedThisMonth: 0, libraryItems: 0, recentTours: [] })
      })
  }, [])

  const firstName = session?.user?.name?.split(' ')[0] || 'there'

  const statCards = [
    { label: 'Total tours', value: stats?.total ?? '—', sub: '▲ 6 this month', subColor: 'text-green' },
    { label: 'Drafts', value: stats?.drafts ?? '—', sub: 'In progress', subColor: 'text-amber' },
    { label: 'Published this month', value: stats?.publishedThisMonth ?? '—', sub: '▲ 30% vs last month', subColor: 'text-green' },
    { label: 'Library items', value: stats?.libraryItems ?? '—', sub: 'Across 5 collections', subColor: 'text-muted' },
  ]

  return (
    <>
      <TopBar title="Dashboard" showNewTour />
      <div className="flex-1 overflow-y-auto p-7">
        <div className="max-w-[1080px] animate-tcfade">
          {/* Header */}
          <div className="flex items-end justify-between mb-[22px]">
            <div>
              <div className="text-[13px] font-semibold text-gold tracking-[0.04em]">
                {format(new Date(), 'EEEE, d MMMM yyyy')}
              </div>
              <h1 className="text-[27px] font-bold mt-1">Welcome back, {firstName}</h1>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {statCards.map((c) => (
              <div key={c.label} className="bg-card border border-line rounded-[14px] p-[18px_20px]">
                <div className="text-[12px] text-muted font-semibold">{c.label}</div>
                <div className="text-[30px] font-bold mt-[6px]">{c.value}</div>
                <div className={`text-[12px] font-semibold mt-1 ${c.subColor}`}>{c.sub}</div>
              </div>
            ))}
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-[1.6fr_1fr] gap-4">
            {/* Recent tours */}
            <div className="bg-card border border-line rounded-[14px] overflow-hidden">
              <div className="px-5 py-4 border-b border-line flex items-center justify-between">
                <div className="font-bold text-[15px]">Recent tour programs</div>
                <Link href="/admin/tours" className="text-gold text-[12.5px] font-semibold hover:underline">
                  View all →
                </Link>
              </div>
              {stats?.recentTours.length === 0 ? (
                <div className="p-8 text-center text-muted text-[13px]">
                  No tours yet.{' '}
                  <Link href="/admin/tours/new" className="text-gold font-semibold">Create your first tour →</Link>
                </div>
              ) : (
                stats?.recentTours.map((t) => (
                  <Link key={t.id} href={`/admin/tours/${t.id}/edit`}
                    className="px-5 py-[14px] border-b border-line flex items-center gap-[14px] cursor-pointer hover:bg-bg transition-colors">
                    <div className="w-[46px] h-[46px] rounded-[10px] bg-[repeating-linear-gradient(135deg,#e9ebef,#e9ebef_7px,#eef0f3_7px,#eef0f3_14px)] flex-none" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[14px] truncate">{t.titles?.en || t.clientName}</div>
                      <div className="text-[12px] text-muted mt-[2px]">
                        {t.clientName} · {t.durationDays} days
                      </div>
                    </div>
                    <span className={`text-[10.5px] font-bold px-[10px] py-1 rounded-[20px] ${
                      t.status === 'published'
                        ? 'bg-green-soft text-green'
                        : 'bg-amber-soft text-amber'
                    }`}>
                      {t.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </Link>
                ))
              )}
            </div>

            {/* Quick actions */}
            <div className="bg-card border border-line rounded-[14px] p-[18px_20px]">
              <div className="font-bold text-[15px] mb-[14px]">Quick actions</div>
              <Link href="/admin/tours/new"
                className="w-full text-left bg-navy-soft border border-[#dde3ee] rounded-[11px] px-[15px] py-[13px] mb-[10px] flex items-center gap-[11px] text-[13.5px] font-semibold text-navy hover:bg-[#e6ebf5] transition-colors">
                <span className="w-[30px] h-[30px] rounded-[8px] bg-navy text-white flex items-center justify-center text-[17px] flex-none">+</span>
                Create new tour program
              </Link>
              <Link href="/admin/library/visit-points"
                className="w-full text-left bg-card border border-line rounded-[11px] px-[15px] py-[13px] mb-[10px] flex items-center gap-[11px] text-[13.5px] font-semibold text-ink hover:bg-bg transition-colors">
                <span className="w-[30px] h-[30px] rounded-[8px] bg-gold-soft text-gold flex items-center justify-center flex-none">
                  <Star size={15} />
                </span>
                Add visit point to library
              </Link>
              <Link href="/admin/settings/languages"
                className="w-full text-left bg-card border border-line rounded-[11px] px-[15px] py-[13px] flex items-center gap-[11px] text-[13.5px] font-semibold text-ink hover:bg-bg transition-colors">
                <span className="w-[30px] h-[30px] rounded-[8px] bg-[#eaf0ff] text-[#5b8def] flex items-center justify-center flex-none">
                  <Globe size={15} />
                </span>
                Manage languages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
