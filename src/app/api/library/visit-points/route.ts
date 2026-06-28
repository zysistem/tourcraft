import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')

  const items = await prisma.visitPoint.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const filtered = q
    ? items.filter((i) => {
        const names = i.names as Record<string, string>
        return Object.values(names).some((v) => v.toLowerCase().includes(q.toLowerCase()))
      })
    : items

  return NextResponse.json(filtered)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const item = await prisma.visitPoint.create({
    data: {
      names: body.names || {},
      descriptions: body.descriptions || {},
      photoUrl: body.photoUrl || null,
      category: body.category || null,
    },
  })
  return NextResponse.json(item, { status: 201 })
}
