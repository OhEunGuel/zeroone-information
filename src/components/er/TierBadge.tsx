type Props = { tier?: string | number }

const tierColor: Record<string, string> = {
  Bronze: 'bg-orange-200 text-orange-900',
  Silver: 'bg-gray-200 text-gray-900',
  Gold: 'bg-yellow-200 text-yellow-900',
  Platinum: 'bg-cyan-200 text-cyan-900',
  Diamond: 'bg-blue-200 text-blue-900',
  Master: 'bg-purple-200 text-purple-900',
}

export default function TierBadge({ tier }: Props) {
  const t = tier ? String(tier) : 'Unranked'
  const color = tierColor[t] ?? 'bg-neutral-200 text-neutral-900'
  return <span className={`inline-block text-xs px-2 py-1 rounded ${color}`}>{t}</span>
}
