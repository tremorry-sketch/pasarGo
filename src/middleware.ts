import { NextResponse } from 'next/server'

// DEMO MODE: auth disabled for prototype demonstration
export default function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: ['/buyer/:path*', '/seller/:path*', '/courier/:path*', '/admin/:path*'],
}
