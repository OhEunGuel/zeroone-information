import Image from 'next/image'
import Container from '@/components/ui/Container'
import SectionCard from '@/components/ui/SectionCard'
import Chip from '@/components/ui/Chip'

export default function StreamerPage() {
  const streamers = Array.from({ length: 12 }).map((_, i) => ({
    name: `Streamer ${i+1}`,
    title: '랭크 게임 생방송',
    viewers: Math.floor(Math.random()*5000)+100,
    thumbnail: `https://picsum.photos/seed/stream_${i}/320/180`,
  }))
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold mb-4">e스포츠/스트리머</h1>
      <SectionCard right={<div className="hidden md:flex items-center gap-2">{['전체','Live','VOD'].map((t, idx)=> <Chip key={t} label={t} active={idx===1} />)}</div>}>
        <div className="mb-3 flex items-center gap-2">
          {['탑','정글','미드','원딜','서폿'].map((c, idx)=> (
            <button key={c} className={`rounded-full border px-3 py-1 text-xs ${idx===0? 'border-[var(--brand-deep)] bg-[var(--brand-accent)]/40':'border-[var(--brand-border)] bg-[var(--brand-surface-2)]'}`}>{c}</button>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {streamers.map((s, idx)=> (
            <div key={idx} className="rounded-xl border border-[var(--brand-border)] overflow-hidden">
              <Image src={s.thumbnail} alt={s.name} width={640} height={360} className="h-40 w-full object-cover" />
              <div className="p-3">
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-[var(--brand-muted)]">{s.title}</div>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="rounded-full bg-[var(--brand-accent)]/40 px-2 py-0.5 text-[var(--brand-deep)]">Live</span>
                  <span className="text-[var(--brand-deep)] font-medium">{s.viewers.toLocaleString()}명 시청</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </Container>
  )
}
