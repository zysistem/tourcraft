'use client'

import { useEffect, useState } from 'react'
import TopBar from '@/components/admin/TopBar'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function UsersSettingsPage() {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/users').then((r) => r.json()).then(setUsers).catch(() => setUsers([]))
  }, [])

  return (
    <>
      <TopBar title="Settings" showSearch={false} />
      <div className="flex-1 overflow-y-auto p-7">
        <div className="max-w-[840px]">
          <div className="flex gap-0 mb-[22px] border-b border-line">
            {[['general', 'General'], ['languages', 'Languages'], ['users', 'Users']].map(([slug, label]) => (
              <a key={slug} href={`/admin/settings/${slug}`}
                className={`px-[4px] mr-5 pb-[11px] text-[14px] font-semibold border-b-2 transition-colors ${slug === 'users' ? 'border-navy text-ink' : 'border-transparent text-muted hover:text-ink'}`}>
                {label}
              </a>
            ))}
          </div>

          <div className="bg-card border border-line rounded-[14px] p-[24px_26px]">
            <div className="flex items-center justify-between mb-[18px]">
              <h2 className="text-[17px] font-bold">Users</h2>
              <button className="h-9 bg-navy text-white rounded-[9px] px-[14px] text-[12.5px] font-semibold hover:bg-navy2 flex items-center gap-2">
                <Plus size={14} />Invite user
              </button>
            </div>
            <div className="border border-line rounded-[11px] overflow-hidden">
              {users.map((u) => {
                const initials = u.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || u.email?.[0].toUpperCase()
                return (
                  <div key={u.id} className="flex items-center gap-[13px] px-4 py-[14px] border-b border-line">
                    <div className="w-[38px] h-[38px] rounded-full bg-navy-soft text-navy flex items-center justify-center font-bold text-[13px] flex-none">
                      {initials}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-[14px]">{u.name || '—'}</div>
                      <div className="text-[12px] text-muted">{u.email}</div>
                    </div>
                    <span className={`text-[10.5px] font-bold px-[11px] py-[5px] rounded-[6px] ${
                      u.role === 'admin' ? 'bg-navy text-white' : 'bg-navy-soft text-navy'
                    }`}>{u.role === 'admin' ? 'Owner' : 'Editor'}</span>
                  </div>
                )
              })}
              {users.length === 0 && (
                <div className="p-8 text-center text-muted text-[13px]">No users yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
