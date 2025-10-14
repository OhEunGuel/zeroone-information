import TierBadge from './TierBadge'

type Props = {
  nickname: string
  userId?: string | number
  tier?: string | number
}

export default function PlayerCard({ nickname, userId, tier }: Props) {
  return (
    <div className="rounded border p-4 flex items-center justify-between">
      <div>
        <div className="text-lg font-semibold">{nickname}</div>
        {userId != null && (
          <div className="text-xs text-neutral-500">ID: {userId}</div>
        )}
      </div>
      <TierBadge tier={tier} />
    </div>
  )
}
