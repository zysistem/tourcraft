'use client'

import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, MapPin, Building2, Plane, CheckSquare,
  FileText, Settings, Globe, Users, LogOut, Map
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/tours', label: 'Tour Programs', icon: Map },
]

const libraryItems = [
  { href: '/admin/library/visit-points', label: 'Visit Points', icon: MapPin, color: '#b08147' },
  { href: '/admin/library/accommodations', label: 'Accommodations', icon: Building2, color: '#5b8def' },
  { href: '/admin/library/airlines', label: 'Airlines', icon: Plane, color: '#6cc4b6' },
  { href: '/admin/library/inclusion-items', label: 'Inclusion Items', icon: CheckSquare, color: '#2f9e6e' },
  { href: '/admin/library/cancellation-policies', label: 'Cancellation Policies', icon: FileText, color: '#cf5a4e' },
]

const settingsItems = [
  { href: '/admin/settings/general', label: 'General', icon: Settings },
  { href: '/admin/settings/languages', label: 'Languages', icon: Globe },
  { href: '/admin/settings/users', label: 'Users', icon: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg">
        <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return null

  const user = session.user
  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0].toUpperCase() || 'U'

  const isActive = (href: string) =>
    pathname === href || (href !== '/admin/dashboard' && pathname?.startsWith(href))

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar */}
      <aside className="w-[252px] flex-none bg-navy text-[#cdd5e4] flex flex-col sticky top-0 h-screen overflow-y-auto">
        {/* Logo */}
        <div className="px-[22px] py-[18px] flex items-center gap-[11px] border-b border-white/[0.07]">
          <div className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center text-[#3a2a14] font-black text-[17px]"
            style={{ background: 'linear-gradient(135deg, #b08147, #cda06a)' }}>T</div>
          <div>
            <div className="text-white font-bold text-[16px] tracking-[0.01em]">TourCraft</div>
            <div className="text-[10.5px] text-[#7d89a6] tracking-[0.13em] uppercase mt-[1px]">Tour Studio</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 py-4 flex-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-[11px] px-3 py-[10px] rounded-[9px] text-[13.5px] font-medium mb-[2px] transition-colors ${
                isActive(href) ? 'bg-white/10 text-white' : 'text-[#cdd5e4] hover:bg-white/5 hover:text-white'
              }`}>
              <Icon size={17} />{label}
            </Link>
          ))}

          <div className="text-[10.5px] text-[#6b779a] tracking-[0.13em] uppercase px-3 pt-[18px] pb-2">Library</div>
          {libraryItems.map(({ href, label, icon: Icon, color }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-[11px] px-3 py-[10px] rounded-[9px] text-[13.5px] font-medium mb-[2px] transition-colors ${
                isActive(href) ? 'bg-white/10 text-white' : 'text-[#cdd5e4] hover:bg-white/5 hover:text-white'
              }`}>
              <span className="w-[6px] h-[6px] rounded-full flex-none" style={{ background: color }} />
              {label}
            </Link>
          ))}

          <div className="text-[10.5px] text-[#6b779a] tracking-[0.13em] uppercase px-3 pt-[18px] pb-2">Settings</div>
          {settingsItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-[11px] px-3 py-[10px] rounded-[9px] text-[13.5px] font-medium mb-[2px] transition-colors ${
                isActive(href) ? 'bg-white/10 text-white' : 'text-[#cdd5e4] hover:bg-white/5 hover:text-white'
              }`}>
              <Icon size={17} />{label}
            </Link>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-4 py-[14px] border-t border-white/[0.07] flex items-center gap-[11px]">
          <div className="w-[34px] h-[34px] rounded-full bg-navy2 flex items-center justify-center text-[#cdd5e4] font-bold text-[13px] flex-none">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-[13px] font-semibold truncate">{user?.name || 'Admin'}</div>
            <div className="text-[11px] text-[#7d89a6] truncate">{user?.email}</div>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-[#6b779a] hover:text-white transition-colors" title="Sign out">
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        {children}
      </main>
    </div>
  )
}
