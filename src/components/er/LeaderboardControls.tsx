"use client"
import { useRouter, useSearchParams } from 'next/navigation'

type SeasonOption = { id: number; label: string }

export default function LeaderboardControls({
  seasons,
  seasonId,
  team,
  server,
}: {
  seasons: SeasonOption[]
  seasonId: number
  team: number
  server?: string
}) {
  const router = useRouter()
  const sp = useSearchParams()

  const onSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const params = new URLSearchParams(sp?.toString() ?? '')
    params.set('season', value)
    params.set('team', String(team))
    if (server) params.set('server', server); else params.delete('server')
    router.push(`/er/leaderboard?${params.toString()}`)
  }

  const onServerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const params = new URLSearchParams(sp?.toString() ?? '')
    params.set('season', String(seasonId))
    params.set('team', String(team))
    if (value) params.set('server', value); else params.delete('server')
    router.push(`/er/leaderboard?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <select
        className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-3 py-1 text-sm"
        value={String(seasonId)}
        onChange={onSeasonChange}
      >
        {seasons.map((opt) => (
          <option key={opt.id} value={String(opt.id)}>{opt.label}</option>
        ))}
      </select>
      <select
        className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-3 py-1 text-sm"
        value={server ?? ''}
        onChange={onServerChange}
      >
        <option value="">전체 지역</option>
        <option value="AS">아시아</option>
        <option value="NA">NA</option>
        <option value="EU">EU</option>
      </select>
    </div>
  )
}
