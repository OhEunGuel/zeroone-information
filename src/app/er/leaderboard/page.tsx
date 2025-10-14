import Container from '@/components/ui/Container'
import SectionCard from '@/components/ui/SectionCard'
import Chip from '@/components/ui/Chip'

export default function LeaderboardPage() {
  const filters = ['솔로', '듀오', '스쿼드']
  const rows = Array.from({ length: 20 }).map((_, i)=> ({
    rank: i+1,
    player: `Player_${i+1}`,
    tier: ['이터니티','미스릴','다이아'][i%3],
    rp: 5000 - i*37,
    top3: `${(40 + (i%7)).toFixed(1)}%`,
    kda: (3 + (i%5)*0.3).toFixed(2),
  }))
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold mb-4">순위표</h1>
      <SectionCard right={
        <div className="flex items-center gap-2">
          <select className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-3 py-1 text-sm">
            <option>시즌 8</option>
            <option>시즌 7</option>
          </select>
          <select className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-3 py-1 text-sm">
            <option>전체 지역</option>
            <option>아시아</option>
            <option>NA</option>
            <option>EU</option>
          </select>
        </div>
      }>
        <div className="mb-3 flex flex-wrap gap-2">
          {filters.map((f, idx)=> <Chip key={f} label={f} active={idx===0} />)}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--er-header)] text-white">
                {['랭크','플레이어','티어','RP','TOP 3','평균 K/D/A'].map((h)=> (
                  <th key={h} className="px-4 py-2 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx)=> (
                <tr key={r.rank} className={`border-b bg-[var(--er-card)] ${idx%2===0? 'bg-opacity-100':'bg-opacity-95'}`}>
                  <td className="px-4 py-3">{r.rank}</td>
                  <td className="px-4 py-3 font-medium">{r.player}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-2 py-0.5 text-xs">{r.tier}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold tabular-nums">{r.rp.toLocaleString()} RP</td>
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
