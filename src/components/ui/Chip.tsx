export default function Chip({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
        active
          ? 'border-[var(--brand-deep)] bg-[var(--brand-accent)]/40 text-[var(--brand-deep)]'
          : 'border-[var(--brand-border)] bg-[var(--brand-surface-2)] text-[var(--brand-text)]'
      }`}
    >
      {label}
    </span>
  )
}
