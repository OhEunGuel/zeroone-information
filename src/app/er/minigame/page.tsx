import Container from '@/components/ui/Container'
import SectionCard from '@/components/ui/SectionCard'
import MiniGame from '@/components/er/MiniGame'

export const metadata = {
  title: '미니게임 | ER.GG',
}

export default function MinigamePage() {
  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold mb-4">미니게임: 피하기</h1>
      <SectionCard title="피하기 게임" right={<span className="text-xs text-[var(--brand-muted)]">대기 시간에 가볍게 즐겨보세요</span>}>
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-[var(--brand-muted)]">좌우 방향키(모바일은 버튼)로 이동하며 떨어지는 돌을 피해 최대한 오래 살아남아보세요.</p>
          <MiniGame />
        </div>
      </SectionCard>
    </Container>
  )
}
