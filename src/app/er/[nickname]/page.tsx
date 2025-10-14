import { upsertPlayerAndMatches, type UIMatch } from '@/lib/er/service'
import PlayerCard from '@/components/er/PlayerCard'
import MatchList from '@/components/er/MatchList'
import Filters from '@/components/er/Filters'

export default async function PlayerPage({ params }: { params: { nickname: string } }) {
  const { nickname } = params
  let data: { player: { id: number; nickname: string }; matches: UIMatch[] } | null = null
  try {
    data = await upsertPlayerAndMatches(nickname)
  } catch (e) {
    console.error('[player page] fetch error', e)
  }
  const items = (data?.matches ?? []).map((m: UIMatch) => ({
    id: m.id,
    startedAt: m.startedAt instanceof Date ? m.startedAt.toISOString() : new Date(m.startedAt as unknown as string).toISOString(),
    placement: m.placement,
    character: m.character,
    kills: m.kills,
    assists: m.assists,
    mmrDelta: m.mmrDelta,
  }))
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">전적</h1>
      </div>
      {data ? (
        <PlayerCard nickname={data.player.nickname} userId={data.player.id} />
      ) : (
        <div className="rounded border p-4 text-[var(--brand-muted)]">플레이어 정보를 불러오지 못했습니다.</div>
      )}

      <div className="flex items-center justify-between">
        <div className="font-semibold">최근 매치</div>
        <Filters />
      </div>
      {items.length > 0 ? (
        <MatchList items={items} />
      ) : (
        <div className="text-sm text-[var(--brand-muted)]">표시할 전적이 없습니다.</div>
      )}
    </div>
  )
}
