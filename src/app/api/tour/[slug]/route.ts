import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
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

  if (!tour) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (tour.status !== 'published') return NextResponse.json({ error: 'Not published' }, { status: 404 })

  return NextResponse.json(tour)
}
