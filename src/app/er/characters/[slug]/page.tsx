import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import SectionCard from '@/components/ui/SectionCard'
import { ER_CHARACTERS } from '@/data/er/characters'
const PLACEHOLDER = {
  skills: [
    { key: 'Q', name: '기본 스킬 Q', desc: '전방을 공격합니다.' },
    { key: 'W', name: '기본 스킬 W', desc: '대상을 끌어오거나 밀쳐냅니다.' },
    { key: 'E', name: '기본 스킬 E', desc: '지정 방향으로 빠르게 이동합니다.' },
    { key: 'R', name: '궁극기 R', desc: '강력한 일격을 가합니다.' },
  ],
  routes: Array.from({ length: 3 }).map((_, i) => ({
    title: `표준 루트 ${i + 1}`,
    items: Array.from({ length: 6 }).map((__, j) => `https://picsum.photos/seed/route_${i}_${j}/64/64`),
  })),
}

export default function CharacterDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Note: Next 15 App Router passes params as a Promise in server components
  async function Inner() {
    const { slug } = await params
    const base = ER_CHARACTERS.find(c => c.slug.toLowerCase() === slug.toLowerCase())
      ?? { slug, name: slug, role: '근접', difficulty: '중' as const }
    const data = {
      name: base.name,
      role: base.role,
      difficulty: base.difficulty,
      skills: PLACEHOLDER.skills,
      routes: PLACEHOLDER.routes,
    }
    return (
      <Container className="py-8">
        <nav aria-label="breadcrumb" className="mb-3 text-sm text-[var(--brand-muted)]">
          <Link href="/er/characters" className="hover:underline">실험체</Link>
          <span aria-hidden className="mx-2">›</span>
          <span aria-current="page" className="text-[var(--brand-text)] font-medium">{data.name}</span>
        </nav>
        <div className="mb-6 flex items-center gap-4">
          <Image src={`https://picsum.photos/seed/${slug}/96/96`} alt={data.name} width={72} height={72} className="rounded-lg" />
          <div>
            <h1 className="text-2xl font-bold">{data.name}</h1>
            <p className="text-sm text-[var(--brand-muted)]">{data.role} · 난이도 {data.difficulty}</p>
          </div>
        </div>

        <SectionCard title="요약">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '역할', value: data.role },
              { label: '난이도', value: data.difficulty },
              { label: '채택률', value: '14.2%' },
              { label: '승률', value: '51.8%' },
            ].map((m)=> (
              <div key={m.label} className="rounded-xl border border-[var(--brand-border)] p-4">
                <div className="text-sm text-[var(--brand-muted)]">{m.label}</div>
                <div className="mt-1 text-xl font-semibold">{m.value}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <div role="tablist" aria-label="실험체 상세 탭" className="mb-3 flex gap-2">
          <button role="tab" aria-selected="true" className="rounded-full border border-[var(--brand-deep)] bg-[var(--brand-accent)]/40 px-3 py-1 text-xs font-medium">스킬</button>
          <button role="tab" aria-selected="false" className="rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-3 py-1 text-xs">루트</button>
        </div>

        <SectionCard title="스킬">
          <div className="grid md:grid-cols-2 gap-4">
            {data.skills.map((s) => (
              <div key={s.key} className="rounded-xl border border-[var(--brand-border)] p-4">
                <div className="mb-1 font-semibold">{s.key}. {s.name}</div>
                <p className="text-sm text-[var(--brand-muted)]">{s.desc}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="추천 루트">
          <div className="grid md:grid-cols-2 gap-4">
            {data.routes.map((r, i) => (
              <div key={i} className="rounded-xl border border-[var(--brand-border)] p-4">
                <div className="mb-2 font-semibold">{r.title}</div>
                <div className="flex gap-2">
                  {r.items.map((src, idx) => (
                    <Image key={idx} src={src} alt="item" width={40} height={40} className="rounded" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </Container>
    )
  }
  return <Inner />
}

export async function generateStaticParams() {
  return ER_CHARACTERS.map((c) => ({ slug: c.slug }))
}
