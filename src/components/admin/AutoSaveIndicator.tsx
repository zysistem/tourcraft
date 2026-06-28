'use client'

import { formatDistanceToNow } from 'date-fns'
import { CheckCircle, Loader2, Clock } from 'lucide-react'

interface Props {
  lastSaved: Date | null
  isSaving: boolean
}

export default function AutoSaveIndicator({ lastSaved, isSaving }: Props) {
  if (isSaving) {
    return (
      <div className="flex items-center gap-2 text-[12.5px] text-muted font-medium">
        <Loader2 size={14} className="animate-spin" />Saving…
      </div>
    )
  }
  if (lastSaved) {
    return (
      <div className="flex items-center gap-[7px] text-[12.5px] text-green font-semibold">
        <span className="w-[7px] h-[7px] rounded-full bg-green animate-tcpulse" />
        Auto-saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2 text-[12.5px] text-faint">
      <Clock size={14} />Unsaved
    </div>
  )
}
