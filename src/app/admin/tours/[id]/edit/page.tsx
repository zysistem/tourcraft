'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import TopBar from '@/components/admin/TopBar'
import TourWizard from '@/components/admin/TourWizard'

export default function EditTourPage() {
  const { id } = useParams<{ id: string }>()
  const [tour, setTour] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/tours/${id}`)
      .then((r) => r.json())
      .then((data) => { setTour(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <>
        <TopBar title="Edit Tour" showSearch={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-navy border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    )
  }

  return (
    <>
      <TopBar title="Edit Tour Program" showSearch={false} showViewPublic publicUrl={tour?.slug ? `/tour/${tour.slug}` : undefined} />
      <div className="flex-1 overflow-y-auto p-7">
        <TourWizard tourId={id} initialData={tour} />
      </div>
    </>
  )
}
