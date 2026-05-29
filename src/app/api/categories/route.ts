import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json(categories)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, icon, slug } = await req.json()
  const category = await prisma.category.create({
    data: { name, icon, slug: slug || name.toLowerCase().replace(/\s+/g, '-') },
  })
  return NextResponse.json(category, { status: 201 })
}
