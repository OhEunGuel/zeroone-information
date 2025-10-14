"use client"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = {
  initialValue?: string
  className?: string
  placeholder?: string
}

export default function SearchForm({ initialValue = '', className, placeholder = '닉네임을 입력하세요' }: Props) {
  const [q, setQ] = useState(initialValue)
  const router = useRouter()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const v = q.trim()
        if (!v) return
        router.push(`/er/${encodeURIComponent(v)}`)
      }}
      className={className}
    >
      <div className="group flex items-center gap-2 rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)] pl-3 pr-1 shadow-sm focus-within:ring-2 focus-within:ring-[var(--brand-accent)]">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none px-2 py-2 text-[var(--brand-text)] placeholder:text-[var(--brand-muted)]"
        />
        <button
          type="submit"
          aria-label="검색"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-primary)] hover:bg-[var(--brand-deep)] text-white px-4 py-2 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span className="text-sm font-semibold">검색</span>
        </button>
      </div>
    </form>
  )
}
