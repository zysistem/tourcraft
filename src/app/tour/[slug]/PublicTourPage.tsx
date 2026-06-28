'use client'

import { useState } from 'react'
import { getLang } from '@/lib/i18n'
import { format } from 'date-fns'
import { Download, Plane, Check, X, ChevronDown } from 'lucide-react'

function MealBadge({ letter, active }: { letter: string; active: boolean }) {
  return (
    <span className={`w-6 h-6 rounded-[6px] inline-flex items-center justify-center text-[11px] font-bold ${
      active ? 'bg-green-soft text-green' : 'bg-[#f0f1f4] text-[#bcc1ca]'
    }`}>{letter}</span>
  )
}

export default function PublicTourPage({ tour, settings }: { tour: any; settings: any }) {
  const [lang, setLang] = useState(tour.languages?.[0] || 'en')
  const [openPolicies, setOpenPolicies] = useState<Record<string, boolean>>({})

  const t = (obj: any) => getLang(obj, lang)
  const title = t(tour.titles) || tour.clientName
  const description = t(tour.descriptionBlock)
  const included = tour.inclusions.filter((i: any) => i.type === 'included')
  const excluded = tour.inclusions.filter((i: any) => i.type === 'excluded')
  const prices = (tour.priceTable || []) as any[]
  const paymentText = t(tour.paymentOptions)

  const formatDate = (d: string | null) => {
    if (!d) return '—'
    return format(new Date(d), 'MMM d, yyyy')
  }

  const companyName = settings?.companyName || 'TourCraft'
  const logoLetter = companyName[0] || 'T'
  const primaryColor = settings?.primaryColor || '#1B2A4A'

  return (
    <div className="min-h-screen" style={{ background: '#faf8f4', fontFamily: 'var(--font-jakarta), system-ui, sans-serif' }}>
      {/* Sticky header */}
      <header className="sticky top-0 z-40 h-[62px] flex items-center px-[26px] gap-[14px] border-b border-[#e9e3d8]"
        style={{ background: 'rgba(250,248,244,0.92)', backdropFilter: 'blur(10px)' }}>
        <div className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center text-[#3a2a14] font-black"
          style={{ background: `linear-gradient(135deg, #b08147, #cda06a)` }}>
          {logoLetter}
        </div>
        <div className="font-serif text-[18px] font-semibold tracking-[0.01em] text-ink"
          style={{ fontFamily: 'Georgia, serif' }}>{title}</div>
        <div className="flex-1" />
        {/* Language switcher */}
        {tour.languages?.length > 1 && (
          <div className="flex bg-white border border-[#e6ddcd] rounded-[9px] p-[3px]">
            {tour.languages.map((l: string) => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-[13px] py-[6px] rounded-[7px] text-[12px] font-bold transition-colors ${
                  lang === l ? 'text-white' : 'text-muted'
                }`}
                style={{ background: lang === l ? primaryColor : 'transparent' }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
        <button onClick={() => window.print()}
          className="h-[38px] rounded-[9px] px-[15px] text-[13px] font-semibold text-white flex items-center gap-2 no-print"
          style={{ background: primaryColor }}>
          <Download size={15} />Download PDF
        </button>
      </header>

      {/* HERO */}
      <section className="relative h-[540px] flex items-end overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2a3550, #10172b)' }}>
        {tour.coverPhotoUrl ? (
          <img src={tour.coverPhotoUrl} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,.03),rgba(255,255,255,.03)_14px,transparent_14px,transparent_28px)] flex items-center justify-center">
            <span className="text-white/20 text-[13px] font-mono tracking-[0.2em]">FULL-BLEED COVER PHOTO</span>
          </div>
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,12,24,.85) 0%, rgba(8,12,24,.15) 60%)' }} />
        <div className="relative max-w-[1000px] mx-auto w-full px-[30px] pb-[52px] text-white">
          <div className="text-[12.5px] font-semibold tracking-[0.18em] uppercase text-[#b08147]">
            {tour.destination || 'Private Tour'}
          </div>
          <h1 className="text-[54px] leading-[1.05] font-normal mt-[14px] max-w-[760px]"
            style={{ fontFamily: 'Georgia, serif' }}>{title}</h1>
          <div className="flex gap-[30px] mt-[26px] flex-wrap">
            {[
              ['Dates', `${formatDate(tour.startDate)} – ${formatDate(tour.endDate)}`],
              ['Duration', `${tour.durationDays} days`],
              ['Travellers', `${tour.paxCount} travellers`],
              ['Prepared by', tour.preparedBy || '—'],
            ].map(([label, value], i, arr) => (
              <div key={label} className="flex items-stretch gap-[30px]">
                <div>
                  <div className="text-[11px] tracking-[0.1em] uppercase text-white/60">{label}</div>
                  <div className="text-[16px] font-semibold mt-1">{value}</div>
                </div>
                {i < arr.length - 1 && <div className="w-px bg-white/20" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      {description && (
        <section className="max-w-[760px] mx-auto px-[30px] pt-16 pb-8">
          <div className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[#b08147] mb-[14px]">Overview</div>
          <p className="text-[24px] leading-[1.55] text-[#2a2d34] font-normal"
            style={{ fontFamily: 'Georgia, serif' }}>{description}</p>
        </section>
      )}

      {/* DAY TIMELINE */}
      <section className="max-w-[1000px] mx-auto px-[30px] pt-10 pb-8">
        <h2 className="text-[34px] font-normal mb-[30px]" style={{ fontFamily: 'Georgia, serif' }}>
          Day-by-day itinerary
        </h2>
        <div className="relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-[#e6ddcd]" />
          <div className="flex flex-col gap-[26px]">
            {tour.days.map((day: any) => {
              const dayNotes = t(day.notes)
              const hotel = day.accommodation ? getLang(day.accommodation.names, lang) : null
              const visits = day.visitPoints.map((vp: any) => getLang(vp.visitPoint.names, lang)).filter(Boolean)

              return (
                <div key={day.id} className="flex gap-6 relative">
                  <div className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-[15px] z-10 border-4 border-[#faf8f4] flex-none"
                    style={{ background: primaryColor }}>
                    {day.dayNumber}
                  </div>
                  <div className="flex-1 bg-white border border-[#ece5d8] rounded-[16px] overflow-hidden shadow-[0_4px_18px_rgba(40,30,10,.04)]">
                    <div className="grid grid-cols-[1fr_240px]">
                      <div className="p-[22px_24px]">
                        <div className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#b08147]">
                          {day.date ? format(new Date(day.date), 'EEEE · MMM d') : `Day ${day.dayNumber}`}
                          {day.startTime && ` · ${day.startTime}`}
                        </div>
                        <h3 className="text-[24px] font-normal mt-[5px]" style={{ fontFamily: 'Georgia, serif' }}>
                          Day {day.dayNumber}
                        </h3>
                        {dayNotes && (
                          <p className="text-[14px] leading-[1.6] text-[#5a5e66] mt-[10px]">{dayNotes}</p>
                        )}
                        {visits.length > 0 && (
                          <div className="flex gap-2 flex-wrap mt-[14px]">
                            {visits.map((v: string, i: number) => (
                              <span key={i} className="bg-[#f3ece1] text-[#7a5826] text-[12.5px] font-semibold px-3 py-[6px] rounded-[20px]">
                                {v}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-[14px] flex-wrap mt-4 items-center">
                          {hotel && (
                            <div className="flex items-center gap-2 bg-[#f6f3ec] border border-[#ece5d8] rounded-[9px] px-3 py-[7px]">
                              <span className="text-[#5b8def]">🏨</span>
                              <span className="text-[12.5px] font-semibold">{hotel}</span>
                              {day.accommodation?.stars > 0 && (
                                <span className="text-[#b08147] text-[11px]">{'★'.repeat(day.accommodation.stars)}</span>
                              )}
                            </div>
                          )}
                          {day.flightInfo && (
                            <div className="flex items-center gap-2 bg-[#0f1830] text-[#dce3f2] rounded-[9px] px-3 py-[7px]">
                              <Plane size={13} className="text-[#b08147]" />
                              <span className="text-[12px] font-bold font-mono text-[#b08147]">{day.flightInfo.code}</span>
                              <span className="text-[12px]">{day.flightInfo.from} → {day.flightInfo.to}</span>
                              {day.flightInfo.departure && (
                                <span className="text-[11px] font-mono opacity-80">{day.flightInfo.departure}</span>
                              )}
                            </div>
                          )}
                          <div className="flex gap-1">
                            <MealBadge letter="B" active={day.mealBreakfast} />
                            <MealBadge letter="L" active={day.mealLunch} />
                            <MealBadge letter="D" active={day.mealDinner} />
                          </div>
                        </div>
                      </div>
                      <div className="bg-[repeating-linear-gradient(135deg,#e9ebef,#e9ebef_9px,#eef0f3_9px,#eef0f3_18px)] flex items-center justify-center text-faint text-[10px] font-mono">
                        {day.photoUrl ? (
                          <img src={day.photoUrl} alt={`Day ${day.dayNumber}`} className="w-full h-full object-cover" />
                        ) : 'DAY PHOTO'}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* PRICING */}
      {prices.length > 0 && (
        <section className="max-w-[1000px] mx-auto px-[30px] pt-10 pb-8">
          <h2 className="text-[34px] font-normal mb-6" style={{ fontFamily: 'Georgia, serif' }}>Pricing</h2>
          <div className="grid grid-cols-3 gap-4">
            {prices.map((p: any, i: number) => (
              <div key={i} className="rounded-[16px] p-[24px_22px] shadow-[0_4px_18px_rgba(40,30,10,.04)]"
                style={{ border: p.recommended ? '2px solid #b08147' : '1px solid #ece5d8', background: '#fff' }}>
                {p.recommended && (
                  <div className="text-[10.5px] font-bold tracking-[0.1em] uppercase text-[#b08147]">Recommended</div>
                )}
                <div className="font-semibold text-[15px] mt-1">{p.option}</div>
                <div className="text-[38px] font-normal mt-[10px]" style={{ fontFamily: 'Georgia, serif' }}>
                  {p.currency} {p.pricePerPerson}
                </div>
                <div className="text-[12px] text-muted">{p.notes}</div>
              </div>
            ))}
          </div>
          {paymentText && (
            <div className="mt-4 text-[13.5px] leading-[1.6] text-[#5a5e66] bg-white border border-[#ece5d8] rounded-[12px] p-5">
              {paymentText}
            </div>
          )}
        </section>
      )}

      {/* INCLUSIONS */}
      {(included.length > 0 || excluded.length > 0) && (
        <section className="max-w-[1000px] mx-auto px-[30px] pt-10 pb-8">
          <div className="grid grid-cols-2 gap-10">
            {included.length > 0 && (
              <div>
                <h2 className="text-[26px] font-normal mb-[18px] text-[#1f6f4d]" style={{ fontFamily: 'Georgia, serif' }}>
                  What's included
                </h2>
                {included.map((inc: any) => (
                  <div key={inc.id} className="flex items-start gap-[11px] py-[9px] border-b border-[#ece5d8]">
                    <Check size={17} className="text-[#2f9e6e] mt-[2px] flex-none" strokeWidth={2.6} />
                    <span className="text-[14.5px]">{getLang(inc.inclusionItem.labels, lang)}</span>
                  </div>
                ))}
              </div>
            )}
            {excluded.length > 0 && (
              <div>
                <h2 className="text-[26px] font-normal mb-[18px] text-[#9e3d33]" style={{ fontFamily: 'Georgia, serif' }}>
                  Not included
                </h2>
                {excluded.map((exc: any) => (
                  <div key={exc.id} className="flex items-start gap-[11px] py-[9px] border-b border-[#ece5d8]">
                    <X size={17} className="text-[#cf5a4e] mt-[2px] flex-none" strokeWidth={2.6} />
                    <span className="text-[14.5px] text-[#5a5e66]">{getLang(exc.inclusionItem.labels, lang)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CANCELLATION */}
      {tour.policies.length > 0 && (
        <section className="max-w-[1000px] mx-auto px-[30px] pt-10 pb-8">
          <h2 className="text-[34px] font-normal mb-[22px]" style={{ fontFamily: 'Georgia, serif' }}>
            Cancellation policy
          </h2>
          <div className="flex flex-col gap-3">
            {tour.policies.map((pol: any) => (
              <div key={pol.id} className="bg-white border border-[#ece5d8] rounded-[13px] px-[22px] py-[18px]">
                <div className="font-semibold text-[15px]">{getLang(pol.cancellationPolicy.titles, lang)}</div>
                <div className="text-[13.5px] leading-[1.6] text-[#5a5e66] mt-[7px]">
                  {getLang(pol.cancellationPolicy.contents, lang)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="mt-[50px] py-[46px] px-[30px]" style={{ background: '#1B2A4A', color: '#cdd5e4' }}>
        <div className="max-w-[1000px] mx-auto flex gap-[30px] flex-wrap items-start">
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center gap-[11px]">
              <div className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center text-[#3a2a14] font-black"
                style={{ background: 'linear-gradient(135deg, #b08147, #cda06a)' }}>
                {logoLetter}
              </div>
              <div className="text-white font-bold text-[16px]">{companyName}</div>
            </div>
            <p className="text-[13px] leading-[1.7] mt-[14px] text-[#8b97b3]">
              {settings?.companyAddress}
              {settings?.companyPhone && <><br />{settings.companyPhone}</>}
              {settings?.companyWebsite && <> · {settings.companyWebsite}</>}
            </p>
          </div>
          {settings?.emergencyPhone && (
            <div>
              <div className="text-white font-semibold text-[13px] mb-[10px]">Emergency contacts</div>
              <p className="text-[13px] leading-[1.8] text-[#8b97b3]">24/7 line · {settings.emergencyPhone}</p>
            </div>
          )}
        </div>
        <div className="max-w-[1000px] mx-auto mt-[30px] pt-5 border-t border-white/10 text-[12px] text-[#6b779a]">
          Prepared for {tour.clientName} · {tour.preparedDate ? format(new Date(tour.preparedDate), 'MMMM d, yyyy') : ''} · Tour ref. {tour.slug?.toUpperCase()}
        </div>
      </footer>
    </div>
  )
}
