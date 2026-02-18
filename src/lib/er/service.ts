import { prisma } from '@/lib/prisma'
import { fetchPlayerAndMatches } from './api'

export type UIMatch = {
  id: string
  startedAt: Date
  placement: number | null
  character: string | null
  kills: number | null
  assists: number | null
  mmrDelta: number | null
}

export type UpsertResult = {
  player: { id: number; nickname: string }
  matches: UIMatch[]
}

export async function upsertPlayerAndMatches(nickname: string): Promise<UpsertResult> {
  const { player, matches } = await fetchPlayerAndMatches(nickname)

  // 데이터베이스가 없거나 접속 실패해도 UI가 깨지지 않게 방어
  try {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL not set')

    const dbPlayer = await prisma.player.upsert({
      where: { nickname },
      update: { userNum: player.userNum },
      create: { nickname, userNum: player.userNum },
    })

    // 간단 upsert: 존재 여부 체크 후 없으면 생성
    for (const m of matches) {
      await prisma.match.upsert({
        where: { id: m.id },
        update: {
          playerId: dbPlayer.id,
          startedAt: new Date(m.startedAt),
          placement: m.placement ?? null,
          character: m.character != null ? String(m.character) : null,
          kills: m.kills ?? null,
          assists: m.assists ?? null,
          mmrDelta: m.mmrDelta ?? null,
        },
        create: {
          id: m.id,
          playerId: dbPlayer.id,
          startedAt: new Date(m.startedAt),
          placement: m.placement ?? null,
          character: m.character != null ? String(m.character) : null,
          kills: m.kills ?? null,
          assists: m.assists ?? null,
          mmrDelta: m.mmrDelta ?? null,
        },
      })
    }

    const latest = await prisma.match.findMany({
      where: { playerId: dbPlayer.id },
      orderBy: { startedAt: 'desc' },
      take: 20,
    })

    const uiMatches: UIMatch[] = latest.map((m) => ({
      id: m.id,
      startedAt: m.startedAt,
      placement: m.placement ?? null,
      character: m.character ?? null,
      kills: m.kills ?? null,
      assists: m.assists ?? null,
      mmrDelta: m.mmrDelta ?? null,
    }))

    return { player: { id: dbPlayer.id, nickname: player.nickname }, matches: uiMatches }
  } catch (err) {
    console.error('[er] Database error:', (err as Error).message)
    // 프로덕션에서는 DB 없이도 API 데이터는 반환하되, DB 저장만 실패한 것으로 처리
    const safeMatches: UIMatch[] = matches.slice(0, 20).map((m) => ({
      id: m.id,
      startedAt: new Date(m.startedAt),
      placement: m.placement ?? null,
      character: m.character != null ? String(m.character) : null,
      kills: m.kills ?? null,
      assists: m.assists ?? null,
      mmrDelta: m.mmrDelta ?? null,
    }))

    return { player: { id: 0, nickname: player.nickname }, matches: safeMatches }
  }
}
