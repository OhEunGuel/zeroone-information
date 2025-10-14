import Header from '@/components/er/Header'
import type { ReactNode } from 'react'

export default function ERLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[var(--er-bg)] text-[var(--er-text)]">
      <Header />
      <main className="pb-12">{children}</main>
    </div>
  )
}
