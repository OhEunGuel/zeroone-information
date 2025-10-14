"use client"
import Link from 'next/link'
import SearchForm from './SearchForm'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--brand-border)] bg-[var(--brand-surface)]/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="h-16 flex items-center justify-between gap-6">
          <Link href="/er" className="font-bold tracking-tight text-[var(--brand-text)]">ER.GG</Link>
          <div className="hidden md:block flex-1 max-w-xl">
            <SearchForm placeholder="플레이어 닉네임을 입력해주세요." />
          </div>
          <nav className="text-sm text-[var(--brand-muted)] flex items-center gap-5">
            <Link href="/er/leaderboard" className="hover:text-[var(--brand-deep)]">순위표</Link>
            <Link href="/er/leaderboard/union" className="hover:text-[var(--brand-deep)]">유니온</Link>
            <Link href="/er/routes" className="hover:text-[var(--brand-deep)]">루트</Link>
            <Link href="/er/characters" className="hover:text-[var(--brand-deep)]">실험체</Link>
            <Link href="/er/items" className="hover:text-[var(--brand-deep)]">아이템</Link>
            <Link href="/er/statistics" className="hover:text-[var(--brand-deep)]">통계</Link>
            <Link href="/er/streamer" className="hover:text-[var(--brand-deep)]">스트리머</Link>
            <Link href="/er/bookmarks/players" className="hover:text-[var(--brand-deep)]">즐겨찾기</Link>
            <Link href="/er/multi" className="hover:text-[var(--brand-deep)]">멀티서치</Link>
            <Link href="/er/season-report" className="hover:text-[var(--brand-deep)]">성적표</Link>
            <Link href="https://dak.gg/ko/cards?view=table&game=er&type=rank&from=er" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--brand-deep)]">파티찾기↗</Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
