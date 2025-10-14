import Container from '@/components/ui/Container'
import SectionCard from '@/components/ui/SectionCard'

export default function UnionLeaderboardPage() {
  const unions = Array.from({ length: 20 }).map((_, i) => ({
    rank: i + 1,
    name: `Union-${i + 1}`,
    members: 30 - (i % 5),
    rating: 4000 - i * 37,
    winRate: `${(55 - i * 0.6).toFixed(1)}%`,
  }))
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold mb-4">유니온 순위</h1>
      <SectionCard right={
        <div className="flex items-center gap-2">
          <input placeholder="유니온 검색" className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-3 py-1 text-sm outline-none" />
          <select className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-3 py-1 text-sm">
            <option>레이팅순</option>
            <option>승률순</option>
            <option>인원순</option>
          </select>
        </div>
      }>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--er-header)] text-white">
                {['순위','유니온','인원','레이팅','승률'].map((h)=> (
                  <th key={h} className="px-4 py-2 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {unions.map(u => (
                <tr key={u.rank} className="border-b bg-[var(--er-card)]">
                  <td className="px-4 py-3">{u.rank}</td>
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3">{u.members}</td>
                  <td className="px-4 py-3">{u.rating}</td>
                  <td className="px-4 py-3">{u.winRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </Container>
  )
}
