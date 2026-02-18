import Container from '@/components/ui/Container'
import SectionCard from '@/components/ui/SectionCard'
import Link from 'next/link'

export default function BookmarkedPlayersPage() {
  const players = Array.from({ length: 15 }).map((_, i)=> ({ nickname: `Player_${i+1}`, tier: ['이터니티','미스릴','다이아'][i%3], rp: 3000+i*23 }))
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold mb-4">즐겨찾기 · 플레이어</h1>
      <SectionCard right={
        <div className="flex items-center gap-2">
          <input placeholder="플레이어 검색" className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-3 py-1 text-sm outline-none" />
          <select className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-3 py-1 text-sm">
            <option>RP 높은 순</option>
            <option>RP 낮은 순</option>
            <option>닉네임</option>
          </select>
        </div>
      }>
        <div className="grid md:grid-cols-2 gap-3">
          {players.map((p)=> (
            <Link key={p.nickname} href={`/er/${encodeURIComponent(p.nickname)}`} className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface-2)] p-4 hover:border-[var(--brand-deep)]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{p.nickname}</div>
                  <div className="text-xs text-[var(--brand-muted)]">{p.tier}</div>
                </div>
                <div className="text-sm font-medium">{p.rp} RP</div>
              </div>
            </Link>
          ))}
        </div>
      </SectionCard>
    </Container>
  )
}
