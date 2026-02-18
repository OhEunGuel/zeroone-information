type Props = { tier?: string | number }

// 사이트 팔레트에 맞춘 배지 색상 (globals.css의 CSS 변수 사용)
const tierColor: Record<string, string> = {
  // 부드러운 크림/브라운 톤과 조화되도록 설정
  Bronze:
    'bg-[var(--brand-accent)]/35 text-[var(--brand-deep)] border border-[var(--brand-accent)]/60',
  Silver:
    'bg-[var(--brand-surface-2)] text-[var(--brand-text)] border border-[var(--brand-border)]',
  Gold:
    'bg-[var(--brand-primary)]/20 text-[var(--brand-deep)] border border-[var(--brand-primary)]/50',
  Platinum:
    'bg-[var(--brand-surface)] text-[var(--brand-deep)] border border-[var(--brand-border)]',
  Diamond:
    'bg-[var(--brand-deep)]/10 text-[var(--brand-deep)] border border-[var(--brand-deep)]/30',
  Master:
    'bg-[var(--er-header)] text-white border border-[var(--er-header)]',
}

export default function TierBadge({ tier }: Props) {
  const t = tier ? String(tier) : 'Unranked'
  const color =
    tierColor[t] ?? 'bg-[var(--brand-surface-2)] text-[var(--brand-muted)] border border-[var(--brand-border)]'
  return (
    <span className={`inline-block rounded-full px-2 py-1 text-[10px] font-medium ${color}`}>
      {t}
    </span>
  )
}
