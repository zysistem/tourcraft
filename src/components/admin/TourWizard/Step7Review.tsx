'use client'

import { useState } from 'react'
import { useTourWizardStore } from '@/store/tourWizardStore'
import { useRouter } from 'next/navigation'
import { Copy, Printer, Globe, Check } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Step7Review({ onPublish }: { onPublish: () => Promise<boolean> }) {
  const store = useTourWizardStore()
  const router = useRouter()
  const [publishing, setPublishing] = useState(false)
  const [copied, setCopied] = useState(false)

  const titleEn = (store.titles as any)?.en || store.clientName || 'Untitled'
  const tourId = store.tourId

  const handlePublish = async () => {
    if (!tourId) {
      toast.error('Save the tour first')
      return
    }
    setPublishing(true)
    const saved = await onPublish()
    if (!saved) { setPublishing(false); return }

    const res = await fetch(`/api/tours/${tourId}/publish`, { method: 'POST' })
    if (res.ok) {
      toast.success('Tour published!')
      router.push('/admin/tours')
    } else {
      toast.error('Publish failed')
    }
    setPublishing(false)
  }

  const publicUrl = tourId ? `${window.location.origin}/tour/...` : '—'

  const copyUrl = () => {
    navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const reviewItems = [
    { label: 'Client', value: `${store.clientName} (${store.paxCount} pax)` },
    { label: 'Dates', value: store.startDate && store.endDate ? `${store.startDate} – ${store.endDate}` : '—' },
    { label: 'Tour days', value: `${store.days.length} days configured` },
    { label: 'Languages', value: store.languages.map((l) => l.toUpperCase()).join(', ') || '—' },
    { label: 'Pricing options', value: `${store.priceTable.length} options` },
    { label: 'Cancellation policies', value: `${store.selectedPolicyIds.length} selected` },
  ]

  return (
    <div className="animate-tcfade">
      <div className="text-[11px] font-bold text-gold tracking-[0.1em] uppercase">Step 7 of 7</div>
      <h2 className="text-[20px] font-bold mt-1 mb-[18px]">Review &amp; publish</h2>

      <div className="grid grid-cols-2 gap-[14px] mb-5">
        {reviewItems.map((r) => (
          <div key={r.label} className="border border-line rounded-[11px] px-4 py-[14px] flex items-center gap-3">
            <span className="w-[30px] h-[30px] rounded-[8px] bg-green-soft text-green flex items-center justify-center font-black flex-none">
              <Check size={15} strokeWidth={2.5} />
            </span>
            <div className="flex-1">
              <div className="text-[11px] text-muted font-semibold uppercase tracking-[0.05em]">{r.label}</div>
              <div className="text-[13.5px] font-semibold mt-[2px]">{r.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-navy-soft border border-[#dde3ee] rounded-[12px] px-5 py-[18px] flex items-center gap-4">
        <div className="flex-1">
          <div className="font-bold text-[15px] text-navy">Ready to publish</div>
          <div className="text-[12.5px] text-muted mt-[3px]">
            Public URL: <span className="font-mono text-navy">{publicUrl}</span>
          </div>
        </div>
        <button onClick={copyUrl}
          className="h-10 border border-line bg-card rounded-[9px] px-[15px] text-[13px] font-semibold hover:bg-bg flex items-center gap-2">
          {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy URL'}
        </button>
        {tourId && (
          <a href={`/tour/${store.tourId}`} target="_blank" rel="noopener noreferrer"
            className="h-10 border border-line bg-card rounded-[9px] px-[15px] text-[13px] font-semibold hover:bg-bg flex items-center gap-2">
            <Globe size={14} />Preview
          </a>
        )}
        <button onClick={handlePublish} disabled={publishing}
          className="h-10 bg-green text-white rounded-[9px] px-[18px] text-[13px] font-bold hover:opacity-90 disabled:opacity-60">
          {publishing ? 'Publishing…' : 'Publish tour'}
        </button>
      </div>
    </div>
  )
}
