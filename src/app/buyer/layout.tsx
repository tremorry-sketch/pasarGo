import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { BottomNav } from '@/components/shared/bottom-nav'

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user.role !== 'BUYER') redirect('/login')

  return (
    <div className="page-content">
      {children}
      <BottomNav role="BUYER" />
    </div>
  )
}
