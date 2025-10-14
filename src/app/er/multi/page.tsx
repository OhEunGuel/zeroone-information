"use client"
import { useState } from 'react'
import Container from '@/components/ui/Container'
import SectionCard from '@/components/ui/SectionCard'
import Link from 'next/link'

export default function MultiSearchPage() {
  const [input, setInput] = useState('RIOORI\n커리\nlsterio')
  const names = input.split(/\n|,|\s+/).map(s=>s.trim()).filter(Boolean).slice(0, 10)
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold mb-4">멀티서치</h1>
      <SectionCard title="닉네임 입력" right={
        <div className="flex items-center gap-2">
          <button onClick={()=> setInput('RIOORI\n커리\nlsterio')} className="rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-3 py-1 text-xs">샘플 채우기</button>
          <button onClick={()=> setInput('')} className="rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-3 py-1 text-xs">초기화</button>
        </div>
      }>
        <textarea value={input} onChange={(e)=> setInput(e.target.value)} rows={5} className="w-full rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface-2)] p-3 outline-none" placeholder="닉네임을 줄바꿈으로 입력" />
      </SectionCard>
      <SectionCard title="검색 결과">
        {names.length === 0 ? (
          <div className="text-sm text-[var(--brand-muted)]">닉네임을 입력하세요.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {names.map((n)=> (
              <Link key={n} href={`/er/${encodeURIComponent(n)}`} className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface-2)] p-4 hover:border-[var(--brand-deep)]">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{n}</div>
                  <div className="text-xs text-[var(--brand-muted)]">바로가기</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </SectionCard>
    </Container>
  )
}
