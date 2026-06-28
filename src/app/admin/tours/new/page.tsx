'use client'

import TopBar from '@/components/admin/TopBar'
import TourWizard from '@/components/admin/TourWizard'

export default function NewTourPage() {
  return (
    <>
      <TopBar title="New Tour Program" showSearch={false} />
      <div className="flex-1 overflow-y-auto p-7">
        <TourWizard />
      </div>
    </>
  )
}
