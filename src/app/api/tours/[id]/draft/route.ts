import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const tour = await prisma.tourProgram.update({
    where: { id: params.id },
    data: {
      draftData: body,
      lastAutoSave: new Date(),
    },
  })

  return NextResponse.json({ lastAutoSave: tour.lastAutoSave })
}
