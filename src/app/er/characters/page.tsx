import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import SectionCard from '@/components/ui/SectionCard'
import Chip from '@/components/ui/Chip'
import { ER_CHARACTERS } from '@/data/er/characters'

export default function CharactersPage() {
  const roles = ['전체','근접','원거리','지원','탱커']
  const diffs = ['전체','하','중','상']
  const chars = ER_CHARACTERS.map((c, i)=> ({
    ...c,
    pick: (10 + (i%7)).toFixed(1)+'%',
    win: (50 + (i%5)).toFixed(1)+'%'
  }))
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold mb-4">실험체</h1>
      <SectionCard right={
        <div className="flex items-center gap-2">
          <input placeholder="실험체 검색" className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-3 py-1 text-sm outline-none" />
          <select className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-3 py-1 text-sm">
            <option>이름순</option>
            <option>채택률순</option>
            <option>승률순</option>
          </select>
        </div>
      }>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            {roles.map((r, idx)=> <Chip key={r} label={r} active={idx===0} />)}
          </div>
          <div className="flex gap-2">
            {diffs.map((d, idx)=> <Chip key={d} label={`난이도 ${d}`} active={idx===0} />)}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {chars.map((c, idx)=> (
            <Link key={idx} href={`/er/characters/${c.slug}`} className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4 hover:border-[var(--brand-deep)]">
              <div className="mb-2 flex items-center gap-3">
                <Image src={`https://picsum.photos/seed/char_${c.slug}/80/80`} alt={c.name} width={56} height={56} className="rounded-lg" />
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-[var(--brand-muted)]">{c.role} · 난이도 {c.difficulty}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="text-[var(--brand-muted)]">채택률</div>
                  <div className="font-medium">{c.pick}</div>
                </div>
                <div className="text-right">
                  <div className="text-[var(--brand-muted)]">승률</div>
                  <div className="font-medium">{c.win}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </SectionCard>
    </Container>
  )
}
