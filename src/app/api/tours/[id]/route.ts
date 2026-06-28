import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function parseTourLanguages(raw: string | null): string[] {
  if (!raw) return ['en']
  try { return JSON.parse(raw) } catch { return ['en'] }
}

function serializeTourLanguages(langs: string[] | undefined): string {
  return JSON.stringify(langs && langs.length ? langs : ['en'])
}

function toursWithLanguages(tour: any) {
  return { ...tour, languages: parseTourLanguages(tour.tourLanguages), tourLanguages: undefined }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const tour = await prisma.tourProgram.findUnique({
    where: { id: params.id },
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

  if (!tour) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(toursWithLanguages(tour))
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const updateData: any = {}
  const allowed = [
    'clientName', 'clientEmail', 'clientPhone', 'preparedBy', 'preparedDate',
    'paxCount', 'destination', 'startDate', 'endDate', 'titles',
    'descriptionBlock', 'priceTable', 'paymentOptions', 'coverPhotoUrl',
    'logoOverride', 'status', 'durationDays',
  ]

  for (const key of allowed) {
    if (body[key] !== undefined) {
      if (key === 'startDate' || key === 'endDate' || key === 'preparedDate') {
        updateData[key] = body[key] ? new Date(body[key]) : null
      } else {
        updateData[key] = body[key]
      }
    }
  }

  if (body.languages !== undefined) {
    updateData.tourLanguages = serializeTourLanguages(body.languages)
  }

  updateData.updatedAt = new Date()

  // Handle days update
  if (body.days) {
    await prisma.tourDay.deleteMany({ where: { tourProgramId: params.id } })
    for (const day of body.days) {
      const created = await prisma.tourDay.create({
        data: {
          tourProgramId: params.id,
          dayNumber: day.dayNumber,
          date: day.date ? new Date(day.date) : null,
          startTime: day.startTime || null,
          endTime: day.endTime || null,
          photoUrl: day.photoUrl || null,
          accommodationId: day.accommodationId || null,
          flightInfo: day.flightEnabled ? day.flightInfo : null,
          notes: day.notes || {},
          mealBreakfast: day.mealBreakfast || false,
          mealLunch: day.mealLunch || false,
          mealDinner: day.mealDinner || false,
        },
      })
      if (day.visitPointIds?.length) {
        await prisma.tourDayVisitPoint.createMany({
          data: day.visitPointIds.map((vpId: string, idx: number) => ({
            tourDayId: created.id,
            visitPointId: vpId,
            order: idx,
          })),
        })
      }
    }
  }

  // Handle inclusions
  if (body.includedItemIds || body.excludedItemIds) {
    await prisma.tourInclusion.deleteMany({ where: { tourProgramId: params.id } })
    const inclusions = [
      ...(body.includedItemIds || []).map((id: string) => ({ tourProgramId: params.id, inclusionItemId: id, type: 'included' })),
      ...(body.excludedItemIds || []).map((id: string) => ({ tourProgramId: params.id, inclusionItemId: id, type: 'excluded' })),
    ]
    if (inclusions.length) await prisma.tourInclusion.createMany({ data: inclusions })
  }

  // Handle policies
  if (body.selectedPolicyIds) {
    await prisma.tourCancellationPolicy.deleteMany({ where: { tourProgramId: params.id } })
    if (body.selectedPolicyIds.length) {
      await prisma.tourCancellationPolicy.createMany({
        data: body.selectedPolicyIds.map((pId: string) => ({
          tourProgramId: params.id,
          cancellationPolicyId: pId,
        })),
      })
    }
  }

  const tour = await prisma.tourProgram.update({
    where: { id: params.id },
    data: updateData,
  })

  return NextResponse.json(toursWithLanguages(tour))
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.tourProgram.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
