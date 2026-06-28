import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const items = await prisma.cancellationPolicy.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const item = await prisma.cancellationPolicy.create({
    data: { titles: body.titles || {}, contents: body.contents || {}, isDefault: body.isDefault || false },
  })
  return NextResponse.json(item, { status: 201 })
}
