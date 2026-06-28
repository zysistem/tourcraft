'use client'

import { useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTourWizardStore, generateDaysFromRange } from '@/store/tourWizardStore'
import AutoSaveIndicator from '../AutoSaveIndicator'
import Step1Metadata from './Step1Metadata'
import Step2Days from './Step2Days'
import Step3Description from './Step3Description'
import Step4Pricing from './Step4Pricing'
import Step5Inclusions from './Step5Inclusions'
import Step6Cancellation from './Step6Cancellation'
import Step7Review from './Step7Review'
import toast from 'react-hot-toast'
import { ChevronLeft } from 'lucide-react'
import { useSession } from 'next-auth/react'

const STEP_NAMES = ['Metadata', 'Days', 'Description', 'Pricing', 'Inclusions', 'Cancellation', 'Review']

interface Props {
  tourId?: string
  initialData?: any
}

export default function TourWizard({ tourId, initialData }: Props) {
  const router = useRouter()
  const { data: session } = useSession()
  const store = useTourWizardStore()
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null)

  // Load initial data from DB
  useEffect(() => {
    if (initialData) {
      store.loadFromData(initialData)
      store.setTourId(initialData.id)
    } else if (!tourId) {
      store.resetWizard()
      if (session?.user?.name) store.setField('preparedBy', session.user.name)
      store.setField('preparedDate', new Date().toISOString().split('T')[0])
    }
  }, [initialData])

  // Auto-save every 30s
  const autoSave = useCallback(async () => {
    if (!store.tourId) return
    store.setIsSaving(true)
    try {
      await fetch(`/api/tours/${store.tourId}/draft`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(useTourWizardStore.getState()),
      })
      store.setLastSaved(new Date())
    } catch (e) {
      // silent
    } finally {
      store.setIsSaving(false)
    }
  }, [store.tourId])

  useEffect(() => {
    if (!store.tourId) return
    autoSaveTimer.current = setInterval(autoSave, 30000)
    return () => { if (autoSaveTimer.current) clearInterval(autoSaveTimer.current) }
  }, [store.tourId, autoSave])

  // Save on unmount
  useEffect(() => {
    return () => { if (store.tourId) autoSave() }
  }, [store.tourId])

  // Create tour if new
  const ensureTourCreated = async (): Promise<string | null> => {
    if (store.tourId) return store.tourId
    try {
      const res = await fetch('/api/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: store.clientName || 'New Tour',
          startDate: store.startDate || null,
          titles: store.titles,
          languages: store.languages,
          paxCount: store.paxCount,
        }),
      })
      const data = await res.json()
      store.setTourId(data.id)
      return data.id
    } catch {
      toast.error('Failed to create tour')
      return null
    }
  }

  const saveCurrentStep = async () => {
    const id = await ensureTourCreated()
    if (!id) return false

    const s = useTourWizardStore.getState()

    try {
      await fetch(`/api/tours/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: s.clientName,
          clientEmail: s.clientEmail,
          clientPhone: s.clientPhone,
          paxCount: s.paxCount,
          titles: s.titles,
          destination: s.destination,
          languages: s.languages,
          preparedBy: s.preparedBy,
          preparedDate: s.preparedDate,
          startDate: s.startDate,
          endDate: s.endDate,
          coverPhotoUrl: s.coverPhotoUrl,
          durationDays: s.days.length || 1,
          descriptionBlock: s.descriptionBlock,
          priceTable: s.priceTable,
          paymentOptions: s.paymentOptions,
          days: s.days,
          includedItemIds: s.includedItemIds,
          excludedItemIds: s.excludedItemIds,
          selectedPolicyIds: s.selectedPolicyIds,
        }),
      })
      store.setLastSaved(new Date())
      return true
    } catch {
      toast.error('Save failed')
      return false
    }
  }

  const goNext = async () => {
    const ok = await saveCurrentStep()
    if (!ok) return
    if (store.currentStep < 7) {
      store.setStep(store.currentStep + 1)
    }
  }

  const goPrev = () => {
    if (store.currentStep > 1) store.setStep(store.currentStep - 1)
  }

  const titleEn = (store.titles as any)?.en || store.clientName || 'New Tour'
  const subtitle = [store.clientName, store.days.length ? `${store.days.length} days` : null, store.languages.map((l) => l.toUpperCase()).join(' / ')].filter(Boolean).join(' · ')

  return (
    <div className="max-w-[1000px] animate-tcfade">
      {/* Wizard header */}
      <div className="flex items-center gap-[14px] mb-5">
        <div>
          <div className="flex items-center gap-[10px]">
            <h1 className="text-[22px] font-bold">{titleEn}</h1>
            <span className={`text-[11px] font-bold px-[9px] py-1 rounded-[20px] tracking-[0.03em] ${
              initialData?.status === 'published' ? 'bg-green-soft text-green' : 'bg-amber-soft text-amber'
            }`}>
              ● {initialData?.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
            </span>
          </div>
          {subtitle && <div className="text-[12.5px] text-muted mt-[3px]">{subtitle}</div>}
        </div>
        <div className="flex-1" />
        <AutoSaveIndicator lastSaved={store.lastSaved} isSaving={store.isSaving} />
        <button onClick={saveCurrentStep}
          className="h-[36px] border border-line bg-card rounded-[9px] px-[14px] text-[13px] font-semibold text-navy hover:bg-bg transition-colors">
          Save draft
        </button>
        {store.tourId && (
          <a href={`/tour/${initialData?.slug || ''}`} target="_blank" rel="noopener noreferrer"
            className="h-[36px] border border-line bg-card rounded-[9px] px-[14px] text-[13px] font-semibold text-muted hover:bg-bg transition-colors">
            Preview
          </a>
        )}
      </div>

      {/* Stepper */}
      <div className="flex items-center bg-card border border-line rounded-[13px] px-[18px] py-[14px] mb-5 overflow-x-auto gap-0">
        {STEP_NAMES.map((name, i) => {
          const num = i + 1
          const done = num < store.currentStep
          const cur = num === store.currentStep
          return (
            <div key={name} className="flex items-center gap-[9px] flex-none">
              <button
                onClick={() => store.setStep(num)}
                className={`w-[28px] h-[28px] rounded-full flex items-center justify-center text-[12px] font-bold transition-colors ${
                  cur ? 'bg-navy text-white' : done ? 'bg-green text-white' : 'bg-bg text-faint border border-line'
                }`}>
                {done ? '✓' : num}
              </button>
              <span className={`text-[12.5px] font-semibold whitespace-nowrap ${cur ? 'text-ink' : 'text-faint'}`}>
                {name}
              </span>
              {num < 7 && <div className="w-6 h-[2px] bg-line mx-1 flex-none" />}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <div className="bg-card border border-line rounded-[14px] p-[26px_28px] min-h-[420px]">
        {store.currentStep === 1 && <Step1Metadata />}
        {store.currentStep === 2 && <Step2Days />}
        {store.currentStep === 3 && <Step3Description />}
        {store.currentStep === 4 && <Step4Pricing />}
        {store.currentStep === 5 && <Step5Inclusions />}
        {store.currentStep === 6 && <Step6Cancellation />}
        {store.currentStep === 7 && <Step7Review onPublish={saveCurrentStep} />}
      </div>

      {/* Footer nav */}
      <div className="flex items-center mt-[18px]">
        <button onClick={goPrev} disabled={store.currentStep === 1}
          className="h-[42px] border border-line bg-card rounded-[10px] px-5 text-[13.5px] font-semibold text-navy flex items-center gap-2 hover:bg-bg transition-colors disabled:opacity-40">
          <ChevronLeft size={16} />Back
        </button>
        <div className="flex-1 text-center text-[12.5px] text-faint">
          Step {store.currentStep} of 7 · changes auto-save
        </div>
        <button onClick={goNext}
          className="h-[42px] bg-navy text-white rounded-[10px] px-6 text-[13.5px] font-semibold hover:bg-navy2 transition-colors">
          {store.currentStep === 7 ? 'Publish →' : 'Next →'}
        </button>
      </div>
    </div>
  )
}
