import { NextResponse, type NextRequest } from 'next/server'
import { upsertPlayerAndMatches } from '@/lib/er/service'

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ nickname: string }> }
) {
  try {
    const { nickname } = await context.params
    if (!nickname) return NextResponse.json({ error: 'nickname required' }, { status: 400 })
    const data = await upsertPlayerAndMatches(nickname)
    return NextResponse.json(data, { status: 200 })
  } catch (e: unknown) {
    console.error('[api] falling back due to error:', e)
    // 개발 편의: 내부 오류 시에도 목업 형태를 반환해 UI가 깨지지 않게 함
    const { nickname } = await context.params
    return NextResponse.json({
      player: { id: 0, nickname: nickname ?? 'unknown' },
      matches: Array.from({ length: 10 }).map((_, i) => ({
        id: `api_fallback_${i}`,
        startedAt: new Date(Date.now() - i * 36e5),
        placement: (i % 8) + 1,
        character: ['Jackie', 'Aya', 'Hyunwoo', 'Silvia'][i % 4],
        kills: (i * 2) % 7,
        assists: (i * 3) % 5,
        mmrDelta: i % 2 === 0 ? 12 : -6,
      })),
    }, { status: 200 })
  }
}
