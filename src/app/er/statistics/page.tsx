import Container from '@/components/ui/Container'
import SectionCard from '@/components/ui/SectionCard'
import Chip from '@/components/ui/Chip'

export default function StatisticsPage() {
  const meta = [
    { label: '평균 순위', value: '#2.8' },
    { label: '평균 K/D/A', value: '5.12' },
    { label: '평균 생존시간', value: '10:43' },
    { label: 'TOP3 비율', value: '48.2%' },
  ]
  const characterDist = Array.from({ length: 8 }).map((_, i) => ({ name: `캐릭터 ${i+1}`, pick: (Math.random()*20+5).toFixed(1)+'%', win: (Math.random()*20+5).toFixed(1)+'%' }))
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold mb-4">통계</h1>
      <SectionCard title="시즌 메타 요약" right={
        <div className="flex items-center gap-2">
          <select className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-3 py-1 text-sm">
            <option>시즌 8</option>
            <option>시즌 7</option>
          </select>
          <div className="hidden md:flex gap-2">
            {['전체','솔로','듀오','스쿼드'].map((t, idx)=> <Chip key={t} label={t} active={idx===0} />)}
          </div>
        </div>
      }>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {meta.map((m)=> (
            <div key={m.label} className="rounded-xl border border-[var(--brand-border)] p-4">
              <div className="text-sm text-[var(--brand-muted)]">{m.label}</div>
              <div className="mt-1 text-xl font-semibold">{m.value}</div>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="실험체 픽/승률">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--er-header)] text-white">
                {['실험체','픽률','승률'].map((h)=> <th key={h} className="px-4 py-2 text-left font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {characterDist.map((c, i)=> (
                <tr key={i} className="border-b bg-[var(--er-card)]">
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.pick}</td>
                  <td className="px-4 py-3">{c.win}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </Container>
  )
}
