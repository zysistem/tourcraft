'use client'

import { Search, ExternalLink, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TopBarProps {
  title: string
  onNewTour?: () => void
  showSearch?: boolean
  showNewTour?: boolean
  showViewPublic?: boolean
  publicUrl?: string
}

export default function TopBar({
  title,
  onNewTour,
  showSearch = true,
  showNewTour = false,
  showViewPublic = false,
  publicUrl,
}: TopBarProps) {
  const router = useRouter()

  return (
    <header className="h-16 flex-none bg-card border-b border-line flex items-center gap-4 px-7 sticky top-0 z-20">
      <div className="text-[15px] font-bold">{title}</div>
      <div className="flex-1" />
      {showSearch && (
        <div className="relative">
          <Search size={16} className="absolute left-[11px] top-1/2 -translate-y-1/2 text-faint" />
          <input
            placeholder="Search tours, clients…"
            className="w-[240px] h-[38px] border border-line rounded-[9px] pl-[34px] pr-3 text-[13px] bg-bg outline-none focus:border-navy transition-colors"
          />
        </div>
      )}
      {showViewPublic && publicUrl && (
        <a href={publicUrl} target="_blank" rel="noopener noreferrer"
          className="h-[38px] border border-line bg-card rounded-[9px] px-[14px] text-[13px] font-semibold text-navy flex items-center gap-2 hover:bg-bg transition-colors">
          View public page <ExternalLink size={14} />
        </a>
      )}
      {showNewTour && (
        <button
          onClick={() => onNewTour ? onNewTour() : router.push('/admin/tours/new')}
          className="h-[38px] bg-navy text-white rounded-[9px] px-4 text-[13px] font-semibold flex items-center gap-2 hover:bg-navy2 transition-colors">
          <Plus size={15} />New Tour
        </button>
      )}
    </header>
  )
}
