/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import Container from '@/components/ui/Container'
import SectionCard from '@/components/ui/SectionCard'
import { getWeaponRoutes, getMeta, getRankTop } from '@/lib/er/api'
import { DEFAULT_TEAM_MODE } from '@/lib/er/constants'
import TierBadge from '@/components/er/TierBadge'

export async function LatestRoutesSection() {
  // 실데이터: 추천 무기 루트 (최대 6개만 노출)
  const data: any = await getWeaponRoutes().catch(() => null)
  const list: any[] = data
    ? (data.result ?? data.routes ?? data.weaponRoutes ?? data.items ?? [])
    : []
  // 응답은 { recommendWeaponRoute: {...}, recommendWeaponRouteDesc: {...} } 형태
  const normalized = list.map((it: any) => it?.recommendWeaponRoute ?? it)
  const top = normalized.slice(0, 6)

  // 캐릭터 이름 매핑을 위해 메타(Character) 일부 참조 (없으면 번호 그대로 표기)
  const meta: any = await getMeta('Character').catch(() => null)
  const charMap: Record<string | number, string> = {}
  if (meta) {
    const chars = meta.characters ?? meta.data ?? meta.Character ?? []
    for (const c of chars) {
      const key = (c.characterNum ?? c.id ?? c.code) as string | number
      if (key != null) charMap[key] = c.name ?? c.characterName ?? c.displayName ?? String(key)
    }
  }

  return (
    <Container className="py-8">
      <SectionCard title="최신 루트" right={<Link href="/er/routes" className="text-sm text-[var(--brand-deep)] hover:underline">전체보기</Link>}>
        {top.length === 0 ? (
          <div className="text-sm text-gray-500">표시할 루트가 없습니다.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {top.map((route: any, idx: number) => {
              const r = route
              const characterKey = r.characterCode ?? r.characterNum ?? r.ownerCharacterNum
              const name = charMap[characterKey ?? ''] ?? (characterKey != null ? `캐릭터 #${characterKey}` : '알 수 없음')
              // 무기/아이템 코드는 문자열 JSON으로 오는 경우가 많음
              const weaponCodes: number[] = (() => {
                try { return JSON.parse(r.weaponCodes ?? '[]') } catch { return [] }
              })()
              const lateGameItemCodes: number[] = (() => {
                try {
                  const obj = JSON.parse(r.lateGameItemCodes ?? '{}')
                  const arr = Object.values(obj).flat() as number[]
                  return Array.isArray(arr) ? arr.slice(0, 6) : []
                } catch { return [] }
              })()
              const previewCodes = (weaponCodes.length ? weaponCodes : lateGameItemCodes).slice(0, 6)
              return (
                <div key={idx} className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface-2)] p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{r.title ? `${name} · ${r.title}` : name}</div>
                    <div className="flex gap-2">
                      {previewCodes.length === 0 ? (
                        <span className="text-xs text-gray-500">아이템 미리보기 없음</span>
                      ) : previewCodes.map((code, i) => (
                        <span key={i} className="inline-flex rounded bg-[var(--brand-surface)] px-2 py-0.5 text-xs border border-[var(--brand-border)]">#{code}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </SectionCard>
    </Container>
  )
}

export async function SeasonRankingSection() {
  // 현재 시즌은 메타 Season에서 isCurrent=1로 판별하는 게 안전함
  // v2/data/Season은 getMeta('Season')로도 가능하지만, 간결하게 호출
  const seasonMeta: any = await (async () => {
    try {
      const res = await fetch(`${process.env.ER_API_BASE || 'https://open-api.bser.io'}/v2/data/Season`, {
        headers: { 'x-api-key': process.env.ER_API_KEY ?? '', 'accept': 'application/json' },
        next: { revalidate: 3600 },
      })
      if (!res.ok) throw new Error(String(res.status))
      return res.json()
    } catch {
      return null
    }
  })()
  const currentSeason = seasonMeta?.data?.find?.((s: any) => String(s.isCurrent) === '1')
  const seasonId = currentSeason?.seasonID ?? 8
  const teamMode = DEFAULT_TEAM_MODE
  const data: any = await getRankTop(seasonId, teamMode).catch(() => null)
  const rows: any[] = data
    ? (data.topRanks ?? data.rankers ?? data.ranks ?? data.top ?? data.list ?? data.result ?? [])
    : []
  const top = rows.slice(0, 10)

  return (
    <Container className="pb-12">
      <SectionCard title={`시즌 ${seasonId} 랭킹`} right={<Link href="/er/leaderboard" className="text-sm text-[var(--brand-deep)] hover:underline">전체보기</Link>}>
        {top.length === 0 ? (
          <div className="text-sm text-gray-500">랭킹 데이터를 불러오지 못했습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--er-header)] text-white">
                  {['랭크', '플레이어', '티어', 'RP', 'TOP 3', '평균 K/D/A'].map((h) => (
                    <th key={h} className="px-4 py-2 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {top.map((r: any, idx: number) => {
                  const rank = r.rank ?? r.order ?? idx + 1
                  const player = r.nickname ?? r.user?.nickname ?? r.name ?? `#${r.userNum ?? ''}`
                  const tier = r.tier ?? r.leagueTier ?? r.rankTier ?? '—'
                  const rp = r.rp ?? r.leaguePoint ?? r.mmr ?? 0
                  const top3 = r.top3 ?? r.topRate ?? r.top3Rate ?? null
                  const kda = r.kda ?? r.avgKda ?? (r.kills && r.deaths && r.assists ? `${r.kills}/${r.deaths}/${r.assists}` : null)
                  return (
                    <tr key={`${player}-${rank}`} className={`border-b bg-[var(--er-card)] ${idx % 2 === 0 ? 'bg-opacity-100' : 'bg-opacity-90'}`}>
                      <td className="px-4 py-3">{rank}</td>
                      <td className="px-4 py-3 font-medium">{player}</td>
                      <td className="px-4 py-3"><TierBadge tier={tier} /></td>
                      <td className="px-4 py-3 font-semibold text-right tabular-nums">{Number(rp).toLocaleString()} RP</td>
                      <td className="px-4 py-3">{top3 != null ? String(top3) : '—'}</td>
                      <td className="px-4 py-3">{kda != null ? String(kda) : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </Container>
  )
}
