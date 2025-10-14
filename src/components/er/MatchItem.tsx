type Props = {
  id: string
  startedAt: string
  placement?: number | null
  character?: string | null
  kills?: number | null
  assists?: number | null
  mmrDelta?: number | null
}

export default function MatchItem({ id, startedAt, placement, character, kills, assists, mmrDelta }: Props) {
  return (
    <li className="border rounded p-3 flex justify-between items-center">
      <div>
        <div className="text-sm text-gray-500">{new Date(startedAt).toLocaleString()}</div>
        <div>캐릭터: {character ?? '-'}</div>
        <div className="text-xs text-neutral-400">#{id}</div>
      </div>
      <div className="text-right">
        <div>순위: {placement ?? '-'}</div>
        <div>K / A: {kills ?? 0} / {assists ?? 0}</div>
        <div>MMR: {mmrDelta ?? 0}</div>
      </div>
    </li>
  )
}
