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

// 공통 요청 유틸
async function erFetch<T>(pathOrUrl: string | URL, init?: RequestInit & { revalidate?: number }): Promise<T> {
  const base = process.env.ER_API_BASE || 'https://open-api.bser.io'
  const key = process.env.ER_API_KEY
  const url = typeof pathOrUrl === 'string' ? new URL(pathOrUrl, base) : pathOrUrl
  const res = await fetch(url, {
    ...init,
    headers: {
      'x-api-key': key ?? '',
      'accept': 'application/json',
      ...(init?.headers || {}),
    },
    next: { revalidate: init?.revalidate ?? 60 },
  } as RequestInit)
  if (!res.ok) throw new Error(`ER API error ${res.status} ${url}`)
  return res.json() as Promise<T>
}

export async function fetchPlayerAndMatches(nickname: string): Promise<{ player: ERPlayerSummary; matches: ERMatch[] }> {
  const base = process.env.ER_API_BASE || 'https://open-api.bser.io'
  const key = process.env.ER_API_KEY

  if (!key) {
    throw new Error('ER_API_KEY is required for production')
  }

  // 1) 닉네임으로 userNum 조회
  const u = new URL('/v1/user/nickname', base)
  u.searchParams.set('query', nickname)
  const userJson = await erFetch<BSERUserResponse>(u)
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
  // 응답 예시는 문서에 따라 다를 수 있으므로 필수 필드만 방어적으로 매핑
  const gamesJson = await erFetch<BSERGamesResponse>(gamesUrl)
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

// 추가 엔드포인트들
export async function getUserByNickname(nickname: string) {
  const u = new URL('/v1/user/nickname', process.env.ER_API_BASE || 'https://open-api.bser.io')
  u.searchParams.set('query', nickname)
  return erFetch<BSERUserResponse>(u)
}

export async function getUserGames(userNum: number | string) {
  return erFetch<BSERGamesResponse>(`/v1/user/games/${userNum}`)
}

export async function getUserStatsV2(userNum: number | string, seasonId: number | string, matchingMode: string | number) {
  return erFetch(`/v2/user/stats/${userNum}/${seasonId}/${matchingMode}`, { revalidate: 30 })
}

export async function getUserRank(userNum: number | string, seasonId: number | string, matchingTeamMode: string | number) {
  return erFetch(`/v1/rank/${userNum}/${seasonId}/${matchingTeamMode}`, { revalidate: 60 })
}

export async function getRankTop(seasonId: number | string, matchingTeamMode: string | number, serverCode?: string) {
  const path = serverCode
    ? `/v1/rank/top/${seasonId}/${matchingTeamMode}/${serverCode}`
    : `/v1/rank/top/${seasonId}/${matchingTeamMode}`
  return erFetch(path, { revalidate: 60 })
}

export async function getUnionTeam(userNum: number | string, seasonId: number | string) {
  return erFetch(`/v1/unionTeam/${userNum}/${seasonId}`, { revalidate: 60 })
}

export async function getMeta(metaType: string) {
  return erFetch(`/v2/data/${metaType}`, { revalidate: 86400 })
}

export async function getL10n(language: string) {
  return erFetch(`/v1/l10n/${language}`, { revalidate: 86400 })
}

export async function getFreeCharacters(matchingMode: string | number) {
  return erFetch(`/v1/freeCharacters/${matchingMode}`, { revalidate: 3600 })
}

export async function getWeaponRoutes() {
  return erFetch(`/v1/weaponRoutes/recommend`, { revalidate: 3600 })
}

export async function getWeaponRoute(routeId: string | number) {
  return erFetch(`/v1/weaponRoutes/recommend/${routeId}`, { revalidate: 3600 })
}
