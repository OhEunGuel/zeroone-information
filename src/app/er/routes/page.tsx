import Container from '@/components/ui/Container'
import SectionCard from '@/components/ui/SectionCard'
import Chip from '@/components/ui/Chip'
import { getWeaponRoutes, getMeta } from '@/lib/er/api'

async function getRoutesData() {
  try {
    const [routesData, seasonData] = await Promise.all([
      getWeaponRoutes(),
      getMeta('Season')
    ])
    
    // API 응답 구조에 따라 데이터 추출 (any로 타입 캐스팅)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const routesAny = routesData as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const seasonsAny = seasonData as any
    const routes = routesAny?.routes ?? routesAny?.data ?? routesAny ?? []
    const seasons = seasonsAny?.data ?? seasonsAny?.seasons ?? []
    
    return { routes: Array.isArray(routes) ? routes : [], seasons }
  } catch (error) {
    console.error('[routes] Failed to fetch routes data:', error)
    return { routes: [], seasons: [] }
  }
}

export default async function RoutesPage() {
  const filters = ['전체','솔로','듀오','스쿼드']
  const { routes } = await getRoutesData()
  
  // 실제 루트 데이터가 있으면 사용, 없으면 플레이스홀더 표시
  const hasRoutes = routes.length > 0
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold mb-4">루트</h1>
      <SectionCard right={<div className="hidden md:flex gap-2">{filters.map((f, idx)=> <Chip key={f} label={f} active={idx===0} />)}</div>}>
        <div className="grid md:grid-cols-2 gap-3">
          {hasRoutes ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            routes.slice(0, 10).map((r: any, idx: number) => (
              <div key={idx} className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{r.characterName ?? r.character ?? '실험체'}</div>
                    <div className="text-sm text-[var(--brand-muted)]">{r.routeName ?? r.title ?? `루트 #${idx + 1}`}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[var(--brand-muted)]">채택률</div>
                    <div className="text-sm font-semibold">{r.pickRate ?? r.pick ?? '-'}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(r.items ?? []).slice(0, 6).map((item: any, i: number) => (
                      <div key={i} className="w-9 h-9 rounded bg-[var(--brand-surface-2)] flex items-center justify-center text-xs">
                        {item?.name?.[0] ?? '?'}
                      </div>
                    ))}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[var(--brand-muted)]">승률</div>
                    <div className="text-sm font-semibold">{r.winRate ?? r.win ?? '-'}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-[var(--brand-muted)]">
              루트 데이터를 불러올 수 없습니다. API 연결을 확인해주세요.
            </div>
          )}
        </div>
      </SectionCard>
    </Container>
  )
}
