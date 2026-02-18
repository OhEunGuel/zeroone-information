// MatchingMode: 2 Normal, 3 Rank (공식 문서)
export const MATCHING_MODE = {
  NORMAL: 2,
  RANK: 3,
} as const

// MatchingTeamMode: 1 Solo, 2 Duo, 3 Squad (공식 문서)
export const TEAM_MODE = {
  SOLO: 1,
  DUO: 2,
  SQUAD: 3,
  // 주의: 유니온(합작)은 별도 코드일 수 있습니다. 공식 값 확인 후 갱신 필요.
} as const

export const DEFAULT_SEASON_ID = Number(process.env.ER_DEFAULT_SEASON_ID ?? 8)
export const DEFAULT_TEAM_MODE = Number(process.env.ER_DEFAULT_TEAM_MODE ?? TEAM_MODE.SOLO)

// 서버 코드는 문서/포털 기준으로 확인 필요. 임시로 string 허용.
export type ServerCode = string
