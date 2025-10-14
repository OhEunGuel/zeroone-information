export type ERPlayerSummary = {
  nickname: string
  userNum: number
}

export type ERMatch = {
  id: string
  startedAt: string
  placement?: number
  character?: string | number
  kills?: number
  assists?: number
  mmrDelta?: number
}

// BSER Open API 실연동: https://open-api.bser.io (x-api-key 필요)
// 1) GET /v1/user/nickname?query={nickname} → userNum 획득
// 2) GET /v1/user/games/{userNum} → 최근 게임 목록
type BSERUserResponse = { user?: Array<{ userNum: number; nickname: string }> }
type BSERGamesResponse = { games?: Array<{
  gameId?: string | number
  matchId?: string | number
  id?: string | number
  startDtm?: string | number | Date
  startedAt?: string | number | Date
  teamRank?: number
  placement?: number
  characterNum?: number | string
  character?: number | string
  playerKill?: number
  kills?: number
  playerAssistant?: number
  assists?: number
  mmrGain?: number
  mmrDelta?: number
}> }

export async function fetchPlayerAndMatches(nickname: string): Promise<{ player: ERPlayerSummary; matches: ERMatch[] }> {
  const base = process.env.ER_API_BASE || 'https://open-api.bser.io'
  const key = process.env.ER_API_KEY

  if (!key) {
    // Fallback mock when key is absent to allow UI development
    const now = Date.now()
    return {
      player: { nickname, userNum: 123456 },
      matches: Array.from({ length: 10 }).map((_, i) => ({
        id: `mock_${nickname}_${i}`,
        startedAt: new Date(now - i * 36e5).toISOString(),
        placement: (i % 8) + 1,
        character: ['Jackie', 'Aya', 'Hyunwoo', 'Silvia'][i % 4],
        kills: (i * 2) % 7,
        assists: (i * 3) % 5,
        mmrDelta: i % 2 === 0 ? 14 : -7,
      })),
    }
  }

  // 1) 닉네임으로 userNum 조회
  const u = new URL('/v1/user/nickname', base)
  u.searchParams.set('query', nickname)
  const userRes = await fetch(u, {
    headers: { 'x-api-key': key },
    next: { revalidate: 60 },
  })
  if (!userRes.ok) {
    throw new Error(`Failed to fetch user by nickname (${userRes.status})`)
  }
  const userJson = await userRes.json() as BSERUserResponse
  const candidates = userJson?.user ?? []
  if (candidates.length === 0) {
    throw new Error('User not found')
  }
  // 동일 닉네임 우선, 없으면 첫번째
  const exact = candidates.find(v => v.nickname.toLowerCase() === nickname.toLowerCase())
  const picked = exact ?? candidates[0]
  const player: ERPlayerSummary = { nickname: picked.nickname, userNum: picked.userNum }

  // 2) 유저 게임 목록
  const gamesUrl = new URL(`/v1/user/games/${picked.userNum}`, base)
  const gamesRes = await fetch(gamesUrl, {
    headers: { 'x-api-key': key },
    next: { revalidate: 60 },
  })
  if (!gamesRes.ok) {
    throw new Error(`Failed to fetch user games (${gamesRes.status})`)
  }
  // 응답 예시는 문서에 따라 다를 수 있으므로 필수 필드만 방어적으로 매핑
  const gamesJson = await gamesRes.json() as BSERGamesResponse
  const matches: ERMatch[] = (gamesJson?.games ?? []).map((g) => ({
    id: String(g.gameId ?? g.matchId ?? g.id),
    startedAt: new Date(g.startDtm ?? g.startedAt ?? Date.now()).toISOString(),
    placement: g.teamRank ?? g.placement ?? undefined,
    character: g.characterNum ?? g.character ?? undefined,
    kills: g.playerKill ?? g.kills ?? undefined,
    assists: g.playerAssistant ?? g.assists ?? undefined,
    mmrDelta: g.mmrGain ?? g.mmrDelta ?? undefined,
  })).filter(m => !!m.id && !!m.startedAt)

  return { player, matches }
}
