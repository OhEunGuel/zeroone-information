/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/ui/Container'
import SectionCard from '@/components/ui/SectionCard'
import { ER_CHARACTERS } from '@/data/er/characters'
import { getMeta, getWeaponRoutes } from '@/lib/er/api'

type CharacterMeta = { characterNum?: number; code?: string; name?: string; role?: string; difficulty?: string }

export default function CharacterDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Note: Next 15 App Router passes params as a Promise in server components
  async function Inner() {
    const { slug } = await params

    // 1) 캐릭터 메타에서 대상 캐릭터 찾기
    const meta: any = await getMeta('Character').catch(() => null)
    const list: CharacterMeta[] = meta?.data ?? meta?.characters ?? meta?.Character ?? []
    const lower = slug.toLowerCase()
    const match = (list as any[]).find((c) =>
      String(c?.code ?? '').toLowerCase() === lower ||
      String(c?.name ?? '').toLowerCase() === lower ||
      String(c?.characterNum ?? '') === slug
    )

    // 2) 로컬 목록과 합쳐 기본 정보 생성
    const local = ER_CHARACTERS.find(c => c.slug.toLowerCase() === lower)
    const displayName = match?.name ?? local?.name ?? slug
    const displayRole = (match?.role as string) ?? local?.role ?? '—'
    const displayDifficulty = (match?.difficulty as string) ?? local?.difficulty ?? '—'

    // 3) 아이템/무기 메타를 불러와 코드→이름 매핑 (아이콘은 추후 연결)
    const [itemAll, itemWeapon, itemArmor] = await Promise.all([
      getMeta('Item').catch(() => null),
      getMeta('ItemWeapon').catch(() => null),
      getMeta('ItemArmor').catch(() => null),
    ])
    const itemMaps: Record<string | number, { name?: string }> = {}
    const absorb = (raw: any) => {
      const arr: any[] = raw?.data ?? raw?.items ?? raw?.Item ?? []
      for (const it of arr) {
        const key = it.itemCode ?? it.code ?? it.id
        if (key != null && itemMaps[key] == null) itemMaps[key] = { name: it.name ?? it.itemName }
      }
    }
    absorb(itemAll); absorb(itemWeapon); absorb(itemArmor)

    const nameFromCode = (code: number | string) => {
      const hit = itemMaps[code]
      return hit?.name ?? `#${code}`
    }

    // 4) 추천 무기 루트 필터 (해당 캐릭터만)
    const routesJson: any = await getWeaponRoutes().catch(() => null)
    const rawList: any[] = routesJson ? (routesJson.result ?? routesJson.routes ?? routesJson.items ?? []) : []
    const normalized = rawList.map((it: any) => it?.recommendWeaponRoute ?? it)
    const charKey = match?.characterNum ?? match?.code
    const filtered = normalized.filter((r: any) => {
      const key = r.characterCode ?? r.characterNum ?? r.ownerCharacterNum
      return String(key ?? '').toLowerCase() === String(charKey ?? '').toLowerCase()
    })
    const topRoutes = filtered.slice(0, 3)

    // 5) 스킬 메타(가능 시): CharacterSkill에서 대상 캐릭터 스킬 추출
    const skillMeta: any = await getMeta('CharacterSkill').catch(() => null)
    const rawSkills: any[] = skillMeta ? (skillMeta.data ?? skillMeta.skills ?? skillMeta.CharacterSkill ?? []) : []
    const charNum = match?.characterNum ?? match?.code
    const skills = rawSkills
      .filter((s: any) => String(s.characterNum ?? s.characterCode ?? '').toLowerCase() === String(charNum ?? '').toLowerCase())
      .slice(0, 6)

    // 6) 캐릭터 이미지 후보 선택(없으면 placeholder)
    const pickImageUrl = (obj: any): string | null => {
      const keys = ['icon', 'image', 'img', 'profile', 'thumbnail', 'portrait', 'squareImage', 'squarePortrait']
      for (const k of keys) {
        const v = obj?.[k]
        if (typeof v === 'string' && (v.startsWith('http') || v.startsWith('/'))) return v
      }
      return null
    }
    const portraitUrl = pickImageUrl(match)

    return (
      <Container className="py-8">
        <nav aria-label="breadcrumb" className="mb-3 text-sm text-[var(--brand-muted)]">
          <Link href="/er/characters" className="hover:underline">실험체</Link>
          <span aria-hidden className="mx-2">›</span>
          <span aria-current="page" className="text-[var(--brand-text)] font-medium">{displayName}</span>
        </nav>

        <div className="mb-6 flex items-center gap-4">
          <Image src={portraitUrl ?? `https://picsum.photos/seed/${slug}/96/96`} alt={displayName} width={72} height={72} className="rounded-lg object-cover" />
          <div>
            <h1 className="text-2xl font-bold">{displayName}</h1>
            <p className="text-sm text-[var(--brand-muted)]">{displayRole} · 난이도 {displayDifficulty}</p>
          </div>
        </div>

        <SectionCard title="요약">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '역할', value: displayRole },
              { label: '난이도', value: displayDifficulty },
              { label: '채택률', value: '—' },
              { label: '승률', value: '—' },
            ].map((m)=> (
              <div key={m.label} className="rounded-xl border border-[var(--brand-border)] p-4">
                <div className="text-sm text-[var(--brand-muted)]">{m.label}</div>
                <div className="mt-1 text-xl font-semibold">{m.value}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* 스킬 */}
        {skills.length > 0 && (
          <SectionCard title="스킬">
            <div className="grid md:grid-cols-2 gap-4">
              {skills.map((s: any, idx: number) => {
                const sName = s.name ?? s.skillName ?? s.code ?? `스킬 ${idx + 1}`
                const sDesc = s.description ?? s.desc ?? s.skillDesc
                return (
                  <div key={idx} className="rounded-xl border border-[var(--brand-border)] p-4">
                    <div className="font-semibold">{sName}</div>
                    {sDesc && <p className="mt-1 text-sm text-[var(--brand-muted)] leading-relaxed">{String(sDesc)}</p>}
                  </div>
                )
              })}
            </div>
          </SectionCard>
        )}

        <SectionCard title="추천 루트">
          {topRoutes.length === 0 ? (
            <div className="text-sm text-gray-500">표시할 추천 루트가 없습니다.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {topRoutes.map((r: any, i: number) => {
                const title = r.title ?? r.name ?? `추천 루트 ${i + 1}`
                // 무기/아이템 코드 추출 (문자열 JSON 가능)
                const weaponCodes: number[] = (() => { try { return JSON.parse(r.weaponCodes ?? '[]') } catch { return [] } })()
                const lateGameItemCodes: number[] = (() => {
                  try { const obj = JSON.parse(r.lateGameItemCodes ?? '{}'); return Array.isArray(obj) ? obj : Object.values(obj).flat() as number[] } catch { return [] }
                })()
                const preview = (weaponCodes.length ? weaponCodes : lateGameItemCodes).slice(0, 6)
                return (
                  <div key={i} className="rounded-xl border border-[var(--brand-border)] p-4">
                    <div className="mb-2 font-semibold">{title}</div>
                    <div className="flex flex-wrap gap-2">
                      {preview.length === 0 ? (
                        <span className="text-xs text-gray-500">아이템 미리보기 없음</span>
                      ) : preview.map((code, idx) => (
                        <span key={idx} className="inline-flex rounded bg-[var(--brand-surface)] px-2 py-0.5 text-xs border border-[var(--brand-border)]">
                          {nameFromCode(code)}
                        </span>
                      ))}
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
  return <Inner />
}

export async function generateStaticParams() {
  return ER_CHARACTERS.map((c) => ({ slug: c.slug }))
}
