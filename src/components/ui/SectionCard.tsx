export default function SectionCard({ title, children, right }: { title?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="my-6">
      {(title || right) && (
        <div className="mb-3 flex items-center justify-between">
          {title ? <h2 className="text-base font-semibold">{title}</h2> : <div />}
          {right}
        </div>
      )}
      <div className="rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-5 shadow-sm">
        {children}
      </div>
    </section>
  )
}
