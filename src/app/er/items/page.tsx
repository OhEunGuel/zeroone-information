import Container from '@/components/ui/Container'
import SectionCard from '@/components/ui/SectionCard'

export default function ItemsPage() {
  const tabs = ['무기','방어구','장신구','소모품']
  const items = Array.from({ length: 24 }).map((_, i)=> ({
    name: `아이템 ${i+1}`,
    rarity: ['일반','고급','희귀','에픽'][i%4],
    desc: '간단한 아이템 설명 텍스트',
  }))
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold mb-4">아이템</h1>
      <SectionCard right={
        <div className="flex items-center gap-2">
          {tabs.map((t, idx)=> (
            <button key={t} className={`rounded-full border px-3 py-1 text-xs ${idx===0? 'border-[var(--brand-deep)] bg-[var(--brand-accent)]/40':'border-[var(--brand-border)] bg-[var(--brand-surface-2)]'}`}>{t}</button>
          ))}
          <input placeholder="아이템 검색" className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-3 py-1 text-sm outline-none" />
        </div>
      }>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((it, idx)=> (
            <div key={idx} className="group rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold">{it.name}</div>
                  <div className="text-xs text-[var(--brand-muted)]">{it.rarity}</div>
                </div>
                <span className="rounded-full bg-[var(--brand-accent)]/40 px-2 py-0.5 text-[10px] text-[var(--brand-deep)]">{it.rarity}</span>
              </div>
              <p className="mt-2 line-clamp-2 text-xs text-[var(--brand-muted)]">{it.desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </Container>
  )
}
