import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const ROLE_ROUTES: Record<string, string[]> = {
  '/buyer': ['BUYER'],
  '/seller': ['SELLER'],
  '/courier': ['COURIER'],
  '/admin': ['ADMIN'],
}

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const path = nextUrl.pathname

  const matchedRole = Object.keys(ROLE_ROUTES).find((prefix) =>
    path.startsWith(prefix)
  )

  if (matchedRole) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', nextUrl))
    }
    const allowedRoles = ROLE_ROUTES[matchedRole]
    if (!allowedRoles.includes(session.user.role)) {
      return NextResponse.redirect(new URL('/unauthorized', nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/buyer/:path*', '/seller/:path*', '/courier/:path*', '/admin/:path*'],
}
