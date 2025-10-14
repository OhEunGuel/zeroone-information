import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import SectionCard from '@/components/ui/SectionCard'

export function LatestRoutesSection() {
  const rows = Array.from({ length: 6 }).map((_, i) => ({
    name: ['실비아', '셀린', '엠마', '아야', '이수빈', '아델라'][i % 6],
    items: Array.from({ length: 6 }).map((__, j) => `https://picsum.photos/seed/er_${i}_${j}/64/64`),
  }))
  return (
    <Container className="py-8">
      <SectionCard title="최신 루트" right={<Link href="/er/routes" className="text-sm text-[var(--brand-deep)] hover:underline">전체보기</Link>}>
        <div className="grid md:grid-cols-2 gap-4">
          {rows.map((row, idx) => (
            <div key={idx} className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-2)] p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">{row.name}</div>
                <div className="flex gap-2">
                  {row.items.map((src, i) => (
                    <Image key={i} src={src} alt="item" width={40} height={40} className="rounded object-cover" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </Container>
  )
}

export function SeasonRankingSection() {
  const rows = Array.from({ length: 5 }).map((_, i) => ({
    rank: i + 1,
    player: ['RIOORI', '커리', '로건', 'lsterio', 'X보이'][i],
    tier: '이터니티',
    rp: 11134 - i * 100,
    top3: ['48.2%', '51.2%', '52.3%', '45.3%', '43.1%'][i],
    kda: [4.25, 5.16, 5.46, 6.03, 4.67][i],
    most: ['재키', '현우', '나딘'][i % 3],
  }))
  return (
    <Container className="pb-12">
      <SectionCard title="시즌 8 랭킹" right={<Link href="/er/leaderboard" className="text-sm text-[var(--brand-deep)] hover:underline">전체보기</Link>}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--er-header)] text-white">
                {['랭크', '플레이어', '티어', 'RP', '평균 순위', 'TOP 3', '평균 K/D/A'].map((h) => (
                  <th key={h} className="px-4 py-2 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={r.rank} className={`border-b bg-[var(--er-card)] ${idx % 2 === 0 ? 'bg-opacity-100' : 'bg-opacity-90'}`}>
                  <td className="px-4 py-3">{r.rank}</td>
                  <td className="px-4 py-3 font-medium">{r.player}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-2 py-0.5 text-xs">{r.tier}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-right tabular-nums">{r.rp.toLocaleString()} RP</td>
                  <td className="px-4 py-3">#{(Math.random()*5+1).toFixed(1)}</td>
                  <td className="px-4 py-3">{r.top3}</td>
                  <td className="px-4 py-3">{r.kda}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </Container>
  )
}
