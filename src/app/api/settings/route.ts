import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let settings = await prisma.tourSettings.findFirst()
  if (!settings) {
    settings = await prisma.tourSettings.create({ data: {} })
  }
  return NextResponse.json(settings)
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  let settings = await prisma.tourSettings.findFirst()

  if (settings) {
    settings = await prisma.tourSettings.update({ where: { id: settings.id }, data: body })
  } else {
    settings = await prisma.tourSettings.create({ data: body })
  }

  return NextResponse.json(settings)
}
