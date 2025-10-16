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
    console.error('[api] Player fetch error:', e)
    return NextResponse.json(
      { 
        error: 'Failed to fetch player data',
        message: e instanceof Error ? e.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}
