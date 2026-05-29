import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { BottomNav } from '@/components/shared/bottom-nav'

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user.role !== 'SELLER') redirect('/login')

  return (
    <div className="page-content">
      {children}
      <BottomNav role="SELLER" />
    </div>
  )
}
