import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PriceRow {
  id: string
  option: string
  pricePerPerson: string
  currency: string
  notes: string
  recommended: boolean
}

export interface FlightInfo {
  code: string
  from: string
  to: string
  departure: string
  arrival: string
}

export interface DayData {
  dayNumber: number
  date: string
  startTime: string
  endTime: string
  photoUrl: string
  accommodationId: string
  accommodationName: string
  flightEnabled: boolean
  flightInfo: FlightInfo
  visitPointIds: string[]
  visitPointNames: string[]
  mealBreakfast: boolean
  mealLunch: boolean
  mealDinner: boolean
  notes: Record<string, string>
}

export interface TourWizardState {
  // Step
  currentStep: number
  tourId: string | null
  lastSaved: Date | null
  isSaving: boolean

  // Step 1 - Metadata
  clientName: string
  clientEmail: string
  clientPhone: string
  paxCount: number
  titles: Record<string, string>
  destination: string
  languages: string[]
  preparedBy: string
  preparedDate: string
  startDate: string
  endDate: string
  coverPhotoUrl: string

  // Step 2 - Days
  days: DayData[]

  // Step 3 - Description
  descriptionBlock: Record<string, string>

  // Step 4 - Pricing
  priceTable: PriceRow[]
  paymentOptions: Record<string, string>

  // Step 5 - Inclusions
  includedItemIds: string[]
  excludedItemIds: string[]

  // Step 6 - Cancellation
  selectedPolicyIds: string[]

  // Actions
  setStep: (step: number) => void
  setField: (field: string, value: any) => void
  setTourId: (id: string) => void
  setDays: (days: DayData[]) => void
  updateDay: (dayNumber: number, data: Partial<DayData>) => void
  addPriceRow: () => void
  removePriceRow: (id: string) => void
  updatePriceRow: (id: string, data: Partial<PriceRow>) => void
  setLastSaved: (date: Date) => void
  setIsSaving: (saving: boolean) => void
  resetWizard: () => void
  loadFromData: (data: any) => void
}

const defaultDay = (dayNumber: number, date: string): DayData => ({
  dayNumber,
  date,
  startTime: '',
  endTime: '',
  photoUrl: '',
  accommodationId: '',
  accommodationName: '',
  flightEnabled: false,
  flightInfo: { code: '', from: '', to: '', departure: '', arrival: '' },
  visitPointIds: [],
  visitPointNames: [],
  mealBreakfast: false,
  mealLunch: false,
  mealDinner: false,
  notes: {},
})

const initialState = {
  currentStep: 1,
  tourId: null,
  lastSaved: null,
  isSaving: false,
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  paxCount: 1,
  titles: {},
  destination: '',
  languages: ['en'],
  preparedBy: '',
  preparedDate: new Date().toISOString().split('T')[0],
  startDate: '',
  endDate: '',
  coverPhotoUrl: '',
  days: [],
  descriptionBlock: {},
  priceTable: [],
  paymentOptions: {},
  includedItemIds: [],
  excludedItemIds: [],
  selectedPolicyIds: [],
}

export const useTourWizardStore = create<TourWizardState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ currentStep: step }),

      setField: (field, value) => set({ [field]: value } as any),

      setTourId: (id) => set({ tourId: id }),

      setDays: (days) => set({ days }),

      updateDay: (dayNumber, data) =>
        set((state) => ({
          days: state.days.map((d) =>
            d.dayNumber === dayNumber ? { ...d, ...data } : d
          ),
        })),

      addPriceRow: () =>
        set((state) => ({
          priceTable: [
            ...state.priceTable,
            {
              id: Math.random().toString(36).slice(2),
              option: '',
              pricePerPerson: '',
              currency: 'EUR',
              notes: '',
              recommended: false,
            },
          ],
        })),

      removePriceRow: (id) =>
        set((state) => ({
          priceTable: state.priceTable.filter((r) => r.id !== id),
        })),

      updatePriceRow: (id, data) =>
        set((state) => ({
          priceTable: state.priceTable.map((r) =>
            r.id === id ? { ...r, ...data } : r
          ),
        })),

      setLastSaved: (date) => set({ lastSaved: date }),
      setIsSaving: (saving) => set({ isSaving: saving }),

      resetWizard: () => set({ ...initialState, currentStep: 1 }),

      loadFromData: (data) => {
        if (!data) return
        set({
          clientName: data.clientName || '',
          clientEmail: data.clientEmail || '',
          clientPhone: data.clientPhone || '',
          paxCount: data.paxCount || 1,
          titles: data.titles || {},
          destination: data.destination || '',
          languages: data.languages || ['en'],
          preparedBy: data.preparedBy || '',
          preparedDate: data.preparedDate || '',
          startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
          endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
          coverPhotoUrl: data.coverPhotoUrl || '',
          descriptionBlock: data.descriptionBlock || {},
          priceTable: data.priceTable || [],
          paymentOptions: data.paymentOptions || {},
          selectedPolicyIds: (data.policies || []).map((p: any) => p.cancellationPolicyId),
          includedItemIds: (data.inclusions || []).filter((i: any) => i.type === 'included').map((i: any) => i.inclusionItemId),
          excludedItemIds: (data.inclusions || []).filter((i: any) => i.type === 'excluded').map((i: any) => i.inclusionItemId),
          days: (data.days || []).map((d: any) => ({
            dayNumber: d.dayNumber,
            date: d.date ? new Date(d.date).toISOString().split('T')[0] : '',
            startTime: d.startTime || '',
            endTime: d.endTime || '',
            photoUrl: d.photoUrl || '',
            accommodationId: d.accommodationId || '',
            accommodationName: d.accommodation?.names?.en || '',
            flightEnabled: !!d.flightInfo,
            flightInfo: d.flightInfo || { code: '', from: '', to: '', departure: '', arrival: '' },
            visitPointIds: (d.visitPoints || []).map((v: any) => v.visitPointId),
            visitPointNames: (d.visitPoints || []).map((v: any) => v.visitPoint?.names?.en || ''),
            mealBreakfast: d.mealBreakfast || false,
            mealLunch: d.mealLunch || false,
            mealDinner: d.mealDinner || false,
            notes: d.notes || {},
          })),
        })
      },
    }),
    {
      name: 'tour-wizard-store',
      partialize: (state) => ({
        tourId: state.tourId,
        currentStep: state.currentStep,
        clientName: state.clientName,
        clientEmail: state.clientEmail,
        clientPhone: state.clientPhone,
        paxCount: state.paxCount,
        titles: state.titles,
        destination: state.destination,
        languages: state.languages,
        preparedBy: state.preparedBy,
        preparedDate: state.preparedDate,
        startDate: state.startDate,
        endDate: state.endDate,
        coverPhotoUrl: state.coverPhotoUrl,
        days: state.days,
        descriptionBlock: state.descriptionBlock,
        priceTable: state.priceTable,
        paymentOptions: state.paymentOptions,
        includedItemIds: state.includedItemIds,
        excludedItemIds: state.excludedItemIds,
        selectedPolicyIds: state.selectedPolicyIds,
      }),
    }
  )
)

export function generateDaysFromRange(start: string, end: string): DayData[] {
  if (!start || !end) return []
  const startDate = new Date(start)
  const endDate = new Date(end)
  const days: DayData[] = []
  const current = new Date(startDate)
  let dayNumber = 1
  while (current <= endDate) {
    days.push(defaultDay(dayNumber, current.toISOString().split('T')[0]))
    current.setDate(current.getDate() + 1)
    dayNumber++
  }
  return days
}
