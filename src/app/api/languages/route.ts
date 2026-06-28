import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const langs = await prisma.language.findMany({ orderBy: [{ isDefault: 'desc' }, { order: 'asc' }] })
  return NextResponse.json(langs)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const lang = await prisma.language.create({
    data: { code: body.code, label: body.label, isDefault: body.isDefault || false, isActive: body.isActive ?? true, order: body.order || 0 },
  })
  return NextResponse.json(lang, { status: 201 })
}
