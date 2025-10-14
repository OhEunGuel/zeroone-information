import Container from '@/components/ui/Container'
import SectionCard from '@/components/ui/SectionCard'
import Chip from '@/components/ui/Chip'
import Image from 'next/image'

export default function RoutesPage() {
  const filters = ['전체','솔로','듀오','스쿼드']
  const routes = Array.from({ length: 10 }).map((_, i)=> ({
    character: ['재키','현우','나딘','아야','레녹스'][i%5],
    title: `Top 루트 #${i+1}`,
    pick: `${(12 + i).toFixed(1)}%`, win: `${(50 + (i%7)).toFixed(1)}%`,
    items: Array.from({ length: 6 }).map((__, j)=> `https://picsum.photos/seed/route_${i}_${j}/64/64`),
  }))
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold mb-4">루트</h1>
      <SectionCard right={<div className="hidden md:flex gap-2">{filters.map((f, idx)=> <Chip key={f} label={f} active={idx===0} />)}</div>}>
        <div className="grid md:grid-cols-2 gap-3">
          {routes.map((r, idx)=> (
            <div key={idx} className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{r.character}</div>
                  <div className="text-sm text-[var(--brand-muted)]">{r.title}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[var(--brand-muted)]">채택률</div>
                  <div className="text-sm font-semibold">{r.pick}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {r.items.map((src, i)=> <Image key={i} src={src} alt="item" width={36} height={36} className="rounded" />)}
                </div>
                <div className="text-right">
                  <div className="text-xs text-[var(--brand-muted)]">승률</div>
                  <div className="text-sm font-semibold">{r.win}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </Container>
  )
}
