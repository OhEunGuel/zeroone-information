import Container from '@/components/ui/Container'
import SectionCard from '@/components/ui/SectionCard'
import { getMeta } from '@/lib/er/api'

async function getItemsData() {
  try {
    const itemData = await getMeta('Item')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const itemsAny = itemData as any
    const items = itemsAny?.data ?? itemsAny?.items ?? []
    
    return Array.isArray(items) ? items : []
  } catch (error) {
    console.error('[items] Failed to fetch items data:', error)
    return []
  }
}

export default async function ItemsPage() {
  const tabs = ['무기','방어구','장신구','소모품']
  const items = await getItemsData()
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold mb-4">아이템</h1>
      <SectionCard right={
        <div className="flex items-center gap-2">
          {tabs.map((t, idx)=> (
            <button key={t} className={`rounded-full border px-3 py-1 text-xs ${idx===0? 'border-[var(--brand-deep)] bg-[var(--brand-accent)]/40':'border-[var(--brand-border)] bg-[var(--brand-surface-2)]'}`}>{t}</button>
          ))}
          <input placeholder="아이템 검색" className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-3 py-1 text-sm outline-none" />
        </div>
      }>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.length > 0 ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            items.slice(0, 24).map((it: any, idx: number) => (
              <div key={idx} className="group rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold">{it.name ?? it.itemName ?? `아이템 ${idx + 1}`}</div>
                    <div className="text-xs text-[var(--brand-muted)]">{it.itemGrade ?? it.rarity ?? '일반'}</div>
                  </div>
                  <span className="rounded-full bg-[var(--brand-accent)]/40 px-2 py-0.5 text-[10px] text-[var(--brand-deep)]">
                    {it.itemGrade ?? it.rarity ?? '일반'}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-[var(--brand-muted)]">
                  {it.tooltip ?? it.description ?? it.desc ?? '아이템 설명'}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-[var(--brand-muted)]">
              아이템 데이터를 불러올 수 없습니다.
            </div>
          )}
        </div>
      </SectionCard>
    </Container>
  )
}
