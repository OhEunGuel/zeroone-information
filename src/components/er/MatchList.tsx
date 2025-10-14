import MatchItem from './MatchItem'

type Item = {
  id: string
  startedAt: string
  placement?: number | null
  character?: string | null
  kills?: number | null
  assists?: number | null
  mmrDelta?: number | null
}

export default function MatchList({ items }: { items: Item[] }) {
  if (!items || items.length === 0) return <div className="text-neutral-500">표시할 전적이 없습니다.</div>
  return (
    <ul className="space-y-2">
      {items.map((m) => (
        <MatchItem key={m.id} {...m} />
      ))}
    </ul>
  )
}
