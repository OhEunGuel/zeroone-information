import { upsertPlayerAndMatches, type UIMatch } from '@/lib/er/service'
import PlayerCard from '@/components/er/PlayerCard'
import MatchList from '@/components/er/MatchList'
import Filters from '@/components/er/Filters'

export default async function PlayerPage({ params }: { params: { nickname: string } }) {
  const { nickname } = params
  const data = await upsertPlayerAndMatches(nickname)
  const items = data.matches.map((m: UIMatch) => ({
    id: m.id,
    startedAt: m.startedAt.toISOString(),
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
      <PlayerCard nickname={data.player.nickname} userId={data.player.id} />

      <div className="flex items-center justify-between">
        <div className="font-semibold">최근 매치</div>
        <Filters />
      </div>
      <MatchList items={items} />
    </div>
  )
}
