import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const { name, email, phone, password, role } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, phone, password: hashed, role: role || 'BUYER' },
  })

  return NextResponse.json({ id: user.id, email: user.email, role: user.role }, { status: 201 })
}
