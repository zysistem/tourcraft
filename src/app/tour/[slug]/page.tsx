import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getLang } from '@/lib/i18n'
import PublicTourPage from './PublicTourPage'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const tour = await prisma.tourProgram.findUnique({ where: { slug: params.slug } })
  if (!tour) return {}
  const title = getLang(tour.titles as any, 'en') || tour.clientName
  return {
    title: `${title} | TourCraft`,
    description: getLang(tour.descriptionBlock as any, 'en') || '',
    openGraph: {
      title: `${title} | TourCraft`,
      description: getLang(tour.descriptionBlock as any, 'en') || '',
      images: tour.coverPhotoUrl ? [tour.coverPhotoUrl] : [],
    },
  }
}

export default async function TourPage({ params }: { params: { slug: string } }) {
  const tour = await prisma.tourProgram.findUnique({
    where: { slug: params.slug },
    include: {
      days: {
        orderBy: { dayNumber: 'asc' },
        include: {
          accommodation: true,
          visitPoints: { include: { visitPoint: true }, orderBy: { order: 'asc' } },
        },
      },
      inclusions: { include: { inclusionItem: true } },
      policies: { include: { cancellationPolicy: true } },
    },
  })

  if (!tour || tour.status !== 'published') notFound()

  const settings = await prisma.tourSettings.findFirst()

  let languages: string[] = ['en']
  try { languages = JSON.parse(tour.tourLanguages || '["en"]') } catch { languages = ['en'] }

  return <PublicTourPage tour={{ ...tour, languages } as any} settings={settings as any} />
}
