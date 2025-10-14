"use client"
import { useRouter } from 'next/navigation'
import { useState, useId } from 'react'

export type PlayerSearchBarProps = {
  placeholder?: string
  className?: string
  variant?: 'default' | 'compact' // compact: 헤더용, default: 히어로/메인용
}

export default function PlayerSearchBar({ placeholder = '플레이어 닉네임을 입력해주세요.', className, variant = 'default' }: PlayerSearchBarProps) {
  const [value, setValue] = useState('')
  const router = useRouter()
  const id = useId()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const v = value.trim()
    if (!v) return
    router.push(`/er/${encodeURIComponent(v)}`)
  }

  // 대기업 스타일: 크고 선명한 서치바 + 미세한 그림자 + 포커스 링
  const shell = variant === 'compact'
    ? 'h-10 rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface)]/90 shadow-sm'
    : 'h-12 rounded-full border-2 border-[var(--brand-border)] bg-[var(--brand-surface)] shadow'

  const button = variant === 'compact'
    ? 'px-4 h-8 text-sm'
    : 'px-6 h-10 text-base'

  return (
    <form onSubmit={onSubmit} className={className} role="search" aria-label="플레이어 검색">
      <label htmlFor={id} className="sr-only">플레이어 닉네임</label>
      <div className={`${shell} group flex items-center gap-2 pl-4 pr-2 transition-shadow focus-within:ring-2 focus-within:ring-[var(--brand-accent)]`}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-[var(--brand-muted)]">
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <input
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-[var(--brand-text)] placeholder:text-[var(--brand-muted)]"
          autoComplete="off"
          spellCheck={false}
        />
        <button type="submit" className={`rounded-full bg-[var(--brand-primary)] hover:bg-[var(--brand-deep)] text-white font-semibold ${button} transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)]`}>
          검색
        </button>
      </div>
    </form>
  )
}
