'use client'

import { useEffect, useState } from 'react'
import TopBar from '@/components/admin/TopBar'
import { Plus, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function UsersSettingsPage() {
  const [users, setUsers] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'editor' })
  const [saving, setSaving] = useState(false)

  const load = () => {
    fetch('/api/users').then((r) => r.json()).then(setUsers).catch(() => setUsers([]))
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Failed'); return }
      toast.success('User added')
      setShowModal(false)
      setForm({ name: '', email: '', password: '', role: 'editor' })
      load()
    } catch {
      toast.error('Failed to add user')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Delete user ${email}?`)) return
    try {
      await fetch('/api/users', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
      toast.success('User deleted')
      load()
    } catch {
      toast.error('Failed to delete user')
    }
  }

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
              <button onClick={() => setShowModal(true)}
                className="h-9 bg-navy text-white rounded-[9px] px-[14px] text-[12.5px] font-semibold hover:bg-navy2 flex items-center gap-2">
                <Plus size={14} />Add user
              </button>
            </div>
            <div className="border border-line rounded-[11px] overflow-hidden">
              {users.map((u) => {
                const initials = u.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || u.email?.[0].toUpperCase()
                return (
                  <div key={u.id} className="flex items-center gap-[13px] px-4 py-[14px] border-b border-line last:border-0">
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
                    {u.role !== 'admin' && (
                      <button onClick={() => handleDelete(u.id, u.email)}
                        className="text-muted hover:text-red transition-colors ml-1">
                        <Trash2 size={14} />
                      </button>
                    )}
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

      {/* Add user modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[16px] shadow-xl w-full max-w-[440px] mx-4 p-[28px]">
            <div className="flex items-center justify-between mb-[20px]">
              <h3 className="text-[17px] font-bold">Add user</h3>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-ink">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="flex flex-col gap-[14px]">
              <label className="block">
                <span className="text-[12.5px] font-semibold">Full name</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Smith"
                  className="w-full h-[42px] border border-line rounded-[9px] px-[13px] mt-[7px] text-[14px] outline-none focus:border-navy transition-colors" />
              </label>
              <label className="block">
                <span className="text-[12.5px] font-semibold">Email *</span>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="jane@company.com"
                  className="w-full h-[42px] border border-line rounded-[9px] px-[13px] mt-[7px] text-[14px] outline-none focus:border-navy transition-colors" />
              </label>
              <label className="block">
                <span className="text-[12.5px] font-semibold">Password *</span>
                <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  className="w-full h-[42px] border border-line rounded-[9px] px-[13px] mt-[7px] text-[14px] outline-none focus:border-navy transition-colors" />
              </label>
              <label className="block">
                <span className="text-[12.5px] font-semibold">Role</span>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full h-[42px] border border-line rounded-[9px] px-[13px] mt-[7px] text-[14px] outline-none focus:border-navy transition-colors bg-white">
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 h-[42px] border border-line rounded-[9px] text-[13.5px] font-semibold text-muted hover:text-ink transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 h-[42px] bg-navy text-white rounded-[9px] text-[13.5px] font-semibold hover:bg-navy2 transition-colors disabled:opacity-50">
                  {saving ? 'Adding…' : 'Add user'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
