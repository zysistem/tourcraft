import { prisma } from './prisma'

export function generateSlug(clientName: string, title: string, startDate: Date | null): string {
  const parts = [clientName, title, startDate ? formatDateForSlug(startDate) : '']
  const base = parts
    .filter(Boolean)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
  return base
}

function formatDateForSlug(date: Date): string {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`
}

export async function uniqueSlug(base: string): Promise<string> {
  let slug = base
  let count = 0
  while (true) {
    const existing = await prisma.tourProgram.findUnique({ where: { slug } })
    if (!existing) return slug
    count++
    slug = `${base}-${count}`
  }
}
