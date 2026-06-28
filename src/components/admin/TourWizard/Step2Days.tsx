'use client'

import { useState } from 'react'
import { useTourWizardStore, DayData } from '@/store/tourWizardStore'
import { format } from 'date-fns'
import { ChevronDown, GripVertical, Plane } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

const LANG_LABELS: Record<string, string> = { en: 'EN', es: 'ES', tr: 'TR', fr: 'FR', de: 'DE' }

function MealBadge({ letter, active }: { letter: string; active: boolean }) {
  return (
    <span className={`w-5 h-5 rounded-[6px] inline-flex items-center justify-center text-[10px] font-bold ${
      active ? 'bg-green-soft text-green' : 'bg-[#f0f1f4] text-[#bcc1ca]'
    }`}>{letter}</span>
  )
}

function DayCard({ day, index }: { day: DayData; index: number }) {
  const store = useTourWizardStore()
  const [open, setOpen] = useState(index === 0)
  const [noteLang, setNoteLang] = useState(store.languages[0] || 'en')

  const update = (data: Partial<DayData>) => store.updateDay(day.dayNumber, data)

  const dateLabel = day.date ? format(new Date(day.date + 'T00:00:00'), 'EEE, MMM d') : `Day ${day.dayNumber}`

  return (
    <div className="border border-line rounded-[13px] overflow-hidden">
      {/* Header */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-[14px] px-4 py-[14px] cursor-pointer bg-bg hover:bg-[#f0f1f3] transition-colors">
        <GripVertical size={15} className="text-[#b4bac4] cursor-grab" />
        <div className="w-[38px] h-[38px] rounded-[10px] bg-navy text-white flex flex-col items-center justify-center flex-none">
          <span className="text-[8px] opacity-70 leading-none">DAY</span>
          <span className="text-[15px] font-bold leading-[1.1]">{day.dayNumber}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[14px]">{day.notes[store.languages[0] || 'en'] ? `Day ${day.dayNumber}` : dateLabel}</div>
          <div className="text-[12px] text-muted mt-[2px]">{dateLabel}{day.accommodationName ? ` · ${day.accommodationName}` : ''}</div>
        </div>
        <div className="flex gap-1">
          <MealBadge letter="B" active={day.mealBreakfast} />
          <MealBadge letter="L" active={day.mealLunch} />
          <MealBadge letter="D" active={day.mealDinner} />
        </div>
        <ChevronDown size={18} className={`text-faint transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>

      {/* Body */}
      {open && (
        <div className="px-4 py-[18px] border-t border-line">
          <div className="grid grid-cols-[170px_1fr] gap-[18px]">
            {/* Left: photo + times */}
            <div>
              <div className="h-[110px] rounded-[10px] bg-[repeating-linear-gradient(135deg,#eef0f3,#eef0f3_9px,#f5f6f8_9px,#f5f6f8_18px)] flex items-center justify-center text-faint text-[10px] font-mono cursor-pointer hover:border hover:border-navy transition-all">
                DAY PHOTO
              </div>
              <div className="flex gap-2 mt-[9px]">
                <input value={day.startTime} onChange={(e) => update({ startTime: e.target.value })}
                  placeholder="Start" type="time"
                  className="w-1/2 h-[34px] border border-line rounded-[7px] px-2 text-[12px] outline-none focus:border-navy" />
                <input value={day.endTime} onChange={(e) => update({ endTime: e.target.value })}
                  placeholder="End" type="time"
                  className="w-1/2 h-[34px] border border-line rounded-[7px] px-2 text-[12px] outline-none focus:border-navy" />
              </div>
            </div>

            {/* Right: main fields */}
            <div className="flex flex-col gap-[13px]">
              {/* Accommodation */}
              <div>
                <div className="text-[11.5px] font-semibold text-muted mb-[6px]">ACCOMMODATION</div>
                <div className="flex items-center gap-[10px] border border-line rounded-[9px] px-3 py-[9px]">
                  <span className="w-2 h-2 rounded-full bg-[#5b8def] flex-none" />
                  <input value={day.accommodationName}
                    onChange={(e) => update({ accommodationName: e.target.value })}
                    placeholder="Hotel name…"
                    className="flex-1 text-[13px] font-semibold outline-none" />
                </div>
              </div>

              {/* Flight */}
              <div>
                <div className="flex items-center justify-between mb-[6px]">
                  <span className="text-[11.5px] font-semibold text-muted">FLIGHT INFO</span>
                  <button type="button"
                    onClick={() => update({ flightEnabled: !day.flightEnabled })}
                    className={`text-[11px] font-semibold px-[9px] py-[3px] rounded-[14px] transition-colors ${
                      day.flightEnabled ? 'bg-navy text-white' : 'bg-bg text-muted'
                    }`}>
                    {day.flightEnabled ? 'On ●' : 'Add'}
                  </button>
                </div>
                {day.flightEnabled && (
                  <div className="flex items-center gap-3 border border-line rounded-[9px] px-3 py-[10px] bg-[#0f1830] text-[#dce3f2]">
                    <Plane size={14} className="text-gold" />
                    <input value={day.flightInfo.code}
                      onChange={(e) => update({ flightInfo: { ...day.flightInfo, code: e.target.value } })}
                      placeholder="TK 1856" className="w-20 bg-transparent text-[13px] font-bold text-gold outline-none font-mono" />
                    <input value={day.flightInfo.from}
                      onChange={(e) => update({ flightInfo: { ...day.flightInfo, from: e.target.value } })}
                      placeholder="MAD" className="w-12 bg-transparent text-[13px] text-center outline-none font-mono uppercase" />
                    <span>→</span>
                    <input value={day.flightInfo.to}
                      onChange={(e) => update({ flightInfo: { ...day.flightInfo, to: e.target.value } })}
                      placeholder="IST" className="w-12 bg-transparent text-[13px] text-center outline-none font-mono uppercase" />
                    <input value={day.flightInfo.departure}
                      onChange={(e) => update({ flightInfo: { ...day.flightInfo, departure: e.target.value } })}
                      placeholder="10:25" type="time" className="bg-transparent text-[12px] outline-none font-mono opacity-80" />
                    <span>–</span>
                    <input value={day.flightInfo.arrival}
                      onChange={(e) => update({ flightInfo: { ...day.flightInfo, arrival: e.target.value } })}
                      placeholder="15:40" type="time" className="bg-transparent text-[12px] outline-none font-mono opacity-80" />
                  </div>
                )}
              </div>

              {/* Visit Points */}
              <div>
                <div className="text-[11.5px] font-semibold text-muted mb-[6px]">VISIT POINTS</div>
                <div className="flex gap-2 flex-wrap items-center">
                  {day.visitPointNames.map((name, i) => (
                    <span key={i} className="bg-gold-soft text-[#7a5826] text-[12px] font-semibold px-[11px] py-[6px] rounded-[20px] flex items-center gap-2">
                      {name}
                      <button type="button"
                        onClick={() => update({
                          visitPointNames: day.visitPointNames.filter((_, j) => j !== i),
                          visitPointIds: day.visitPointIds.filter((_, j) => j !== i),
                        })}
                        className="opacity-60 hover:opacity-100 text-xs">✕</button>
                    </span>
                  ))}
                  <input
                    placeholder="+ Add visit point"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = e.currentTarget.value.trim()
                        if (val) {
                          update({ visitPointNames: [...day.visitPointNames, val], visitPointIds: [...day.visitPointIds, val] })
                          e.currentTarget.value = ''
                        }
                      }
                    }}
                    className="border border-dashed border-line text-muted text-[12px] font-semibold px-[11px] py-[6px] rounded-[20px] outline-none focus:border-navy w-40"
                  />
                </div>
              </div>

              {/* Meals */}
              <div>
                <div className="text-[11.5px] font-semibold text-muted mb-[6px]">MEALS</div>
                <div className="flex gap-4">
                  {(['mealBreakfast', 'mealLunch', 'mealDinner'] as const).map((key, i) => (
                    <label key={key} className="flex items-center gap-[6px] text-[12.5px] cursor-pointer">
                      <span
                        onClick={() => update({ [key]: !day[key] })}
                        className={`w-[17px] h-[17px] rounded-[5px] inline-flex items-center justify-center text-[11px] text-white font-bold cursor-pointer ${
                          day[key] ? 'bg-green border-green' : 'bg-white border border-[#d4d8df]'
                        }`}>
                        {day[key] ? '✓' : ''}
                      </span>
                      {['Breakfast', 'Lunch', 'Dinner'][i]}
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes multilingual */}
              <div>
                <div className="flex items-center gap-2 mb-[6px]">
                  <span className="text-[11.5px] font-semibold text-muted">NOTES</span>
                  <div className="flex gap-1">
                    {store.languages.map((l) => (
                      <button key={l} type="button" onClick={() => setNoteLang(l)}
                        className={`text-[11px] font-bold px-2 py-[2px] rounded-[5px] ${
                          noteLang === l ? 'bg-navy text-white' : 'bg-bg text-muted'
                        }`}>{LANG_LABELS[l] || l.toUpperCase()}</button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={day.notes[noteLang] || ''}
                  onChange={(e) => update({ notes: { ...day.notes, [noteLang]: e.target.value } })}
                  rows={2}
                  placeholder={`Notes in ${noteLang.toUpperCase()}…`}
                  className="w-full border border-line rounded-[9px] px-3 py-[9px] text-[13px] outline-none focus:border-navy resize-vertical"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Step2Days() {
  const store = useTourWizardStore()

  const onDragEnd = (result: any) => {
    if (!result.destination) return
    const days = Array.from(store.days)
    const [removed] = days.splice(result.source.index, 1)
    days.splice(result.destination.index, 0, removed)
    const renumbered = days.map((d, i) => ({ ...d, dayNumber: i + 1 }))
    store.setDays(renumbered)
  }

  if (store.days.length === 0) {
    return (
      <div className="text-center py-12 text-muted">
        <div className="text-[15px] font-semibold mb-2">No days yet</div>
        <div className="text-[13px]">Go back to Step 1 and set tour start and end dates to auto-generate days.</div>
      </div>
    )
  }

  return (
    <div className="animate-tcfade">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] font-bold text-gold tracking-[0.1em] uppercase">Step 2 of 7</div>
          <h2 className="text-[20px] font-bold mt-1">Tour days</h2>
        </div>
        <div className="text-[12px] text-muted flex items-center gap-2 mt-1">
          <GripVertical size={15} />Drag cards to reorder
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="days">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="mt-5 flex flex-col gap-3">
              {store.days.map((day, index) => (
                <Draggable key={day.dayNumber} draggableId={String(day.dayNumber)} index={index}>
                  {(prov) => (
                    <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                      <DayCard day={day} index={index} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
