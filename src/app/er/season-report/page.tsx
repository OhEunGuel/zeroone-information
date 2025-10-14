import Container from '@/components/ui/Container'
import SectionCard from '@/components/ui/SectionCard'

export default function SeasonReportPage() {
  const summary = [
    { label: '최고 티어', value: '이터니티' },
    { label: '최고 RP', value: '11,340' },
    { label: '총 경기 수', value: '532' },
    { label: '평균 순위', value: '#2.9' },
  ]
  const highlights = Array.from({ length: 6 }).map((_, i)=> ({ title: `하이라이트 ${i+1}`, desc: '극적인 한타 역전! MVP 경기', date: `2025-0${(i%9)+1}-12` }))
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold mb-4">이전 시즌 성적표</h1>
      <SectionCard title="시즌 요약" right={
        <div className="flex items-center gap-2">
          <select className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-3 py-1 text-sm">
            <option>시즌 8</option>
            <option>시즌 7</option>
            <option>시즌 6</option>
          </select>
          <button className="rounded-full border border-[var(--brand-deep)] bg-[var(--brand-accent)]/40 px-3 py-1 text-xs">공유</button>
        </div>
      }>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summary.map((s)=> (
            <div key={s.label} className="rounded-xl border border-[var(--brand-border)] p-4">
              <div className="text-sm text-[var(--brand-muted)]">{s.label}</div>
              <div className="mt-1 text-xl font-semibold">{s.value}</div>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="하이라이트">
        <div className="grid md:grid-cols-2 gap-3">
          {highlights.map((h, i)=> (
            <div key={i} className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface-2)] p-4">
              <div className="font-semibold">{h.title}</div>
              <div className="text-sm text-[var(--brand-muted)]">{h.desc}</div>
              <div className="mt-1 text-xs text-[var(--brand-muted)]">{h.date}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </Container>
  )
}
