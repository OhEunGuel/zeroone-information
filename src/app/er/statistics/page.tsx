import Container from '@/components/ui/Container'
import SectionCard from '@/components/ui/SectionCard'
import Chip from '@/components/ui/Chip'
import { getMeta } from '@/lib/er/api'

async function getStatisticsData() {
  try {
    const [characterData, seasonData] = await Promise.all([
      getMeta('Character'),
      getMeta('Season')
    ])
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const charactersAny = characterData as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const seasonsAny = seasonData as any
    
    const characters = charactersAny?.data ?? charactersAny?.characters ?? []
    const seasons = seasonsAny?.data ?? seasonsAny?.seasons ?? []
    
    return { 
      characters: Array.isArray(characters) ? characters : [],
      seasons: Array.isArray(seasons) ? seasons : []
    }
  } catch (error) {
    console.error('[statistics] Failed to fetch statistics data:', error)
    return { characters: [], seasons: [] }
  }
}

export default async function StatisticsPage() {
  const { characters } = await getStatisticsData()
  
  // 메타 통계는 실제 계산이 필요하므로 임시 값 (추후 실제 통계 API 추가 필요)
  const meta = [
    { label: '총 실험체 수', value: characters.length.toString() },
    { label: '현재 시즌', value: 'S8' },
    { label: '데이터 상태', value: characters.length > 0 ? '연결됨' : '오프라인' },
    { label: 'API 버전', value: 'v2' },
  ]
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
              {characters.length > 0 ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                characters.slice(0, 10).map((c: any, i: number) => (
                  <tr key={i} className="border-b bg-[var(--er-card)]">
                    <td className="px-4 py-3">{c.name ?? c.characterName ?? `실험체 ${i + 1}`}</td>
                    <td className="px-4 py-3">{c.pickRate ?? '-'}</td>
                    <td className="px-4 py-3">{c.winRate ?? '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-[var(--brand-muted)]">
                    실험체 데이터를 불러올 수 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </Container>
  )
}
