import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateSlug, uniqueSlug } from '@/lib/slug'
import { startOfMonth, endOfMonth } from 'date-fns'

function parseTourLanguages(raw: string | null): string[] {
  if (!raw) return ['en']
  try { return JSON.parse(raw) } catch { return ['en'] }
}

function serializeTourLanguages(langs: string[] | undefined): string {
  return JSON.stringify(langs && langs.length ? langs : ['en'])
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const limit = parseInt(searchParams.get('limit') || '100')

  const where = status ? { status } : {}

  const [tours, total, drafts] = await Promise.all([
    prisma.tourProgram.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      take: limit,
      select: {
        id: true, slug: true, clientName: true, status: true, titles: true,
        startDate: true, endDate: true, durationDays: true, paxCount: true,
        tourLanguages: true, coverPhotoUrl: true, createdAt: true, updatedAt: true,
      },
    }),
    prisma.tourProgram.count(),
    prisma.tourProgram.count({ where: { status: 'draft' } }),
  ])

  const now = new Date()
  const publishedThisMonth = await prisma.tourProgram.count({
    where: {
      status: 'published',
      updatedAt: { gte: startOfMonth(now), lte: endOfMonth(now) },
    },
  })

  const [vpCount, acCount, airCount, inclCount, polCount] = await Promise.all([
    prisma.visitPoint.count(),
    prisma.accommodation.count(),
    prisma.airline.count(),
    prisma.inclusionItem.count(),
    prisma.cancellationPolicy.count(),
  ])

  const toursOut = tours.map((t) => ({ ...t, languages: parseTourLanguages(t.tourLanguages), tourLanguages: undefined }))

  return NextResponse.json({
    tours: toursOut,
    total,
    drafts,
    publishedThisMonth,
    libraryItems: vpCount + acCount + airCount + inclCount + polCount,
  })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { clientName, startDate, titles } = body

  const titleEn = typeof titles === 'object' ? titles.en || '' : ''
  const baseSlug = generateSlug(clientName || 'tour', titleEn, startDate ? new Date(startDate) : null)
  const slug = await uniqueSlug(baseSlug)

  const tour = await prisma.tourProgram.create({
    data: {
      slug,
      clientName: clientName || '',
      clientEmail: body.clientEmail || null,
      clientPhone: body.clientPhone || null,
      preparedBy: body.preparedBy || session.user?.name || null,
      preparedDate: body.preparedDate ? new Date(body.preparedDate) : new Date(),
      paxCount: body.paxCount || 1,
      destination: body.destination || null,
      startDate: startDate ? new Date(startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
      tourLanguages: serializeTourLanguages(body.languages),
      titles: body.titles || {},
      descriptionBlock: body.descriptionBlock || {},
      priceTable: body.priceTable || [],
      paymentOptions: body.paymentOptions || {},
      status: 'draft',
      durationDays: body.durationDays || 1,
    },
  })

  return NextResponse.json({ ...tour, languages: parseTourLanguages(tour.tourLanguages) }, { status: 201 })
}
