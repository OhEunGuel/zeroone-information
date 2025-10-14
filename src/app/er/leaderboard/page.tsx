/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import Container from '@/components/ui/Container'
import SectionCard from '@/components/ui/SectionCard'
import Chip from '@/components/ui/Chip'
import { getMeta, getRankTop } from '@/lib/er/api'
import { TEAM_MODE, DEFAULT_TEAM_MODE } from '@/lib/er/constants'
import LeaderboardControls from '@/components/er/LeaderboardControls'
import TierBadge from '@/components/er/TierBadge'

type SearchParams = {
  season?: string
  team?: string // 1|2|3
  server?: string // 서버 코드(문자열), 전체는 미지정
}

async function getSeasonMetaSafe() {
  try {
    const meta: any = await getMeta('Season')
    const list = meta?.data ?? meta?.Season ?? meta?.seasons ?? []
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

async function tryRankTop(seasonId: number | string, teamMode: number | string, server?: string) {
  try {
    const data: any = await getRankTop(seasonId, teamMode, server)
    const rows: any[] = data
      ? (data.topRanks ?? data.rankers ?? data.ranks ?? data.top ?? data.list ?? data.result ?? [])
      : []
    return { ok: true, rows }
  } catch {
    return { ok: false, rows: [] as any[] }
  }
}

export default async function LeaderboardPage({ searchParams }: { searchParams?: SearchParams }) {
  const team = Number(searchParams?.team ?? DEFAULT_TEAM_MODE) || DEFAULT_TEAM_MODE
  const server = searchParams?.server || undefined

  // 시즌 목록 가져오기 및 기본 선택
  const seasons = await getSeasonMetaSafe()
  const current = seasons.find((s: any) => String(s.isCurrent) === '1')
  const selectedSeasonId = Number(searchParams?.season ?? (current?.seasonID ?? 8))

  // rank/top이 시즌 메타의 current로 동작하지 않는 경우가 있어 최근 시즌들로 폴백 시도 (최대 3회)
  const candidateSeasonIds: number[] = Array.from(
    new Set<number>([
      selectedSeasonId,
      ...seasons
        .map((s: any) => Number(s.seasonID))
        .filter((n: number) => !Number.isNaN(n))
        .sort((a: number, b: number) => b - a)
    ])
  ).slice(0, 5)

  let rows: any[] = []
  let resolvedSeasonId: number = selectedSeasonId
  for (const sid of candidateSeasonIds.slice(0, 3)) {
    const { ok, rows: r } = await tryRankTop(sid, team, server)
    if (ok && r.length > 0) {
      rows = r
      resolvedSeasonId = sid
      break
    }
    // 마지막 후보라면 ok여부와 상관없이 rows를 설정(빈 배열일 수 있음)
    if (sid === candidateSeasonIds.slice(0, 3).at(-1)) {
      rows = r
      resolvedSeasonId = sid
    }
  }

  const teamFilters = [
    { label: '솔로', value: TEAM_MODE.SOLO },
    { label: '듀오', value: TEAM_MODE.DUO },
    { label: '스쿼드', value: TEAM_MODE.SQUAD },
  ]

  // 시즌 옵션 표시용
  const seasonOptions = candidateSeasonIds.map((id) => ({ id, label: `시즌 ${id}` }))

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold mb-4">순위표</h1>
      <SectionCard right={<LeaderboardControls seasons={seasonOptions} seasonId={resolvedSeasonId} team={team} server={server} />}>
        <div className="mb-3 flex flex-wrap gap-2">
          {teamFilters.map((f) => (
            <Link
              key={f.value}
              href={`/er/leaderboard?season=${resolvedSeasonId}&team=${f.value}${server ? `&server=${encodeURIComponent(server)}` : ''}`}
              prefetch={false}
            >
              <Chip label={f.label} active={team === f.value} />
            </Link>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--er-header)] text-white">
                {['랭크','플레이어','티어','RP','TOP 3','평균 K/D/A'].map((h)=> (
                  <th key={h} className="px-4 py-2 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">랭킹 데이터를 불러오지 못했습니다.</td>
                </tr>
              ) : (
                rows.map((r: any, idx: number)=> {
                  const rank = r.rank ?? r.order ?? idx + 1
                  const player = r.nickname ?? r.user?.nickname ?? r.name ?? `#${r.userNum ?? ''}`
                  const tier = r.tier ?? r.leagueTier ?? r.rankTier ?? '—'
                  const rpRaw = r.rp ?? r.leaguePoint ?? r.mmr ?? 0
                  const rp = Number(rpRaw) || 0
                  const top3 = r.top3 ?? r.topRate ?? r.top3Rate ?? null
                  const kda = r.kda ?? r.avgKda ?? (r.kills && r.deaths && r.assists ? `${r.kills}/${r.deaths}/${r.assists}` : null)
                  return (
                    <tr key={`${player}-${rank}`} className={`border-b bg-[var(--er-card)] ${idx%2===0? 'bg-opacity-100':'bg-opacity-95'}`}>
                      <td className="px-4 py-3">{rank}</td>
                      <td className="px-4 py-3 font-medium">{player}</td>
                      <td className="px-4 py-3"><TierBadge tier={tier} /></td>
                      <td className="px-4 py-3 font-semibold tabular-nums">{rp.toLocaleString()} RP</td>
                      <td className="px-4 py-3">{top3 != null ? String(top3) : '—'}</td>
                      <td className="px-4 py-3">{kda != null ? String(kda) : '—'}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </Container>
  )
}
