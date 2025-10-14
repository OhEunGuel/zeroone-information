import SearchForm from './SearchForm'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative">
      <div className="relative h-[260px] md:h-[360px] w-full">
        <Image
          src="https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1600&auto=format&fit=crop"
          alt="hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35),rgba(0,0,0,0.35))]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-4">
            <div className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-sm">ER.GG</div>
            <div className="mx-auto w-full max-w-2xl">
              <SearchForm placeholder="플레이어 닉네임을 입력해주세요." />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
