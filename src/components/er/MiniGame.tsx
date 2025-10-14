"use client"
import { useEffect, useRef, useState } from 'react'

type Rock = { lane: number; y: number; speed: number; radius: number }

// 간단 피하기 게임: 5개 레인, 좌/우 키로 이동, 위에서 바위가 떨어짐
export default function MiniGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const runningRef = useRef<boolean>(false)
  const lastTsRef = useRef<number>(0)

  // 게임 설정
  const lanes = 5
  const [score, setScore] = useState(0)
  const scoreRef = useRef(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)
  const [countingDown, setCountingDown] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [bestScore, setBestScore] = useState<number>(0)

  // 플레이어 상태
  const [, setPlayerLane] = useState(2) // 가운데 시작 (0~4)
  const playerLaneRef = useRef(2)

  // 장애물 상태
  const rocksRef = useRef<Rock[]>([])
  const spawnTimerRef = useRef(0)
  const spawnIntervalRef = useRef(600) // ms, 더 빠르게 시작
  const countdownTimerRef = useRef<number | null>(null)

  // 캔버스 픽셀 스케일링
  const desiredWidth = 360
  const desiredHeight = 640

  useEffect(() => {
    // 최고점 불러오기
    try {
      const raw = localStorage.getItem('ergg_minigame_best')
      if (raw) setBestScore(parseInt(raw, 10) || 0)
    } catch {}

    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.floor(desiredWidth * dpr)
    canvas.height = Math.floor(desiredHeight * dpr)
    canvas.style.width = desiredWidth + 'px'
    canvas.style.height = desiredHeight + 'px'

    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)

    const onKeyDown = (e: KeyboardEvent) => {
      const isSpace = e.code === 'Space' || e.key === ' '
      const isEnter = e.key === 'Enter'

      // 시작 / 재시작 (Space/Enter)
      if (!started && (isEnter || isSpace)) {
        if (isSpace) e.preventDefault()
        beginCountdown()
        return
      }
      if (gameOver && (isEnter || isSpace)) {
        if (isSpace) e.preventDefault()
        beginCountdown()
        return
      }

      // 이동 (게임 진행 중일 때만)
      if (started && !gameOver) {
        if (e.key === 'ArrowLeft') {
          playerLaneRef.current = Math.max(0, playerLaneRef.current - 1)
          setPlayerLane(playerLaneRef.current)
        } else if (e.key === 'ArrowRight') {
          playerLaneRef.current = Math.min(lanes - 1, playerLaneRef.current + 1)
          setPlayerLane(playerLaneRef.current)
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      if (countdownTimerRef.current) window.clearTimeout(countdownTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver, started])

  function doStartGame() {
    // 실제 게임 시작(카운트다운 종료 후)
    setStarted(true)
    setGameOver(false)
    scoreRef.current = 0
    setScore(0)
    rocksRef.current = []
    spawnTimerRef.current = 0
    spawnIntervalRef.current = 600
    playerLaneRef.current = 2
    setPlayerLane(2)
    runningRef.current = true
    lastTsRef.current = 0
    // 시작 직후 즉시 스폰 유도
    spawnTimerRef.current = spawnIntervalRef.current
    rafRef.current = requestAnimationFrame(loop)
  }


  function beginCountdown() {
    if (countingDown) return
    setCountingDown(true)
    setCountdown(3)
    // 카운트다운은 DOM 오버레이로 표시하고, 종료 시 게임 시작
    const tick = (n: number) => {
      setCountdown(n)
      if (n <= 1) {
        // 마지막 틱 후 시작
        setCountingDown(false)
        doStartGame()
      } else {
        countdownTimerRef.current = window.setTimeout(() => tick(n - 1), 1000)
      }
    }
    countdownTimerRef.current = window.setTimeout(() => tick(2), 1000)
  }

  function loop(ts: number) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    if (!runningRef.current) return

    const dt = lastTsRef.current ? ts - lastTsRef.current : 16
    lastTsRef.current = ts

    update(dt)
    draw(ctx)

    if (runningRef.current) {
      rafRef.current = requestAnimationFrame(loop)
    }
  }

  function update(dtMs: number) {
    const dt = dtMs / 1000
    scoreRef.current += dt
    // 점점 난이도 증가: 스폰 주기와 속도 조정
    spawnTimerRef.current += dtMs
  // 더 빠른 기본 속도 및 증가량
  const baseSpeed = 180 + Math.min(scoreRef.current * 24, 420) // px/s 증가

    // 스폰
    if (spawnTimerRef.current >= spawnIntervalRef.current) {
      spawnTimerRef.current = 0
      spawnIntervalRef.current = Math.max(220, spawnIntervalRef.current - 10) // 최소 220ms까지 단축
      const lane = Math.floor(Math.random() * lanes)
      const radius = 14 + Math.random() * 10
      const speed = baseSpeed * (0.9 + Math.random() * 0.3)
      rocksRef.current.push({ lane, y: -radius - 2, speed, radius })
      // 확률적으로 추가 스폰(중복 레인 방지)
      if (Math.random() < 0.12) {
        let lane2 = Math.floor(Math.random() * lanes)
        if (lane2 === lane) lane2 = (lane2 + 1) % lanes
        const radius2 = 12 + Math.random() * 8
        const speed2 = baseSpeed * (0.95 + Math.random() * 0.25)
        rocksRef.current.push({ lane: lane2, y: -radius2 - 14, speed: speed2, radius: radius2 })
      }
    }

    // 이동
    const playerY = desiredHeight - 80
    const newRocks: Rock[] = []
    let collided = false
    for (const r of rocksRef.current) {
      r.y += r.speed * dt
      // 충돌 체크: 같은 레인 + y 근접
      if (r.lane === playerLaneRef.current) {
        const dy = Math.abs(r.y - playerY)
        if (dy < r.radius + 18) {
          collided = true
        }
      }
      // 화면 밖은 삭제, 아닌건 유지
      if (r.y < desiredHeight + r.radius + 10) newRocks.push(r)
    }
    rocksRef.current = newRocks

    if (collided) {
      runningRef.current = false
      setGameOver(true)
      // 최고점 반영
      const finalScore = Math.floor(scoreRef.current)
      setScore(finalScore)
      try {
        if (finalScore > (bestScore || 0)) {
          setBestScore(finalScore)
          localStorage.setItem('ergg_minigame_best', String(finalScore))
        }
      } catch {}
    } else {
      // 점수 반영(초 단위 → 정수)
      setScore(Math.floor(scoreRef.current))
    }
  }

  function draw(ctx: CanvasRenderingContext2D) {
    // 배경
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--brand-surface-2') || '#111'
    ctx.fillRect(0, 0, desiredWidth, desiredHeight)

    // 레인 그리드
    const laneWidth = desiredWidth / lanes
    for (let i = 1; i < lanes; i++) {
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(i * laneWidth, 0)
      ctx.lineTo(i * laneWidth, desiredHeight)
      ctx.stroke()
    }

    // 플레이어
    const px = laneWidth * (playerLaneRef.current + 0.5)
    const py = desiredHeight - 80
    // 캐릭터(이렘/고양이) 표현: 둥근 캡슐 + 귀 느낌의 삼각형
    ctx.save()
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--brand-primary') || '#845EC2'
    roundedRect(ctx, px - 18, py - 18, 36, 36, 10)
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.beginPath(); ctx.arc(px - 6, py - 4, 3, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(px + 6, py - 4, 3, 0, Math.PI * 2); ctx.fill()
    ctx.restore()

    // 바위
    for (const r of rocksRef.current) {
      const rx = laneWidth * (r.lane + 0.5)
      ctx.fillStyle = '#7a7a7a'
      ctx.beginPath()
      ctx.arc(rx, r.y, r.radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = 'rgba(0,0,0,0.2)'
      ctx.stroke()
    }

    // 상단 HUD
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 16px ui-sans-serif, system-ui, -apple-system'
    ctx.fillText(`점수: ${Math.floor(scoreRef.current)}`, 12, 24)

    if (gameOver) {
      overlayText(ctx, '게임 오버! 엔터로 재시작', desiredWidth, desiredHeight)
    }
  }

  function overlayText(ctx: CanvasRenderingContext2D, text: string, w: number, h: number) {
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 20px ui-sans-serif, system-ui, -apple-system'
    ctx.textAlign = 'center'
    ctx.fillText(text, w / 2, h / 2)
    ctx.textAlign = 'start'
  }

  function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    const rr = Math.min(r, w / 2, h / 2)
    ctx.beginPath()
    ctx.moveTo(x + rr, y)
    ctx.arcTo(x + w, y, x + w, y + h, rr)
    ctx.arcTo(x + w, y + h, x, y + h, rr)
    ctx.arcTo(x, y + h, x, y, rr)
    ctx.arcTo(x, y, x + w, y, rr)
    ctx.closePath()
  }

  // 모바일 보조 버튼
  const moveLeft = () => {
    if (gameOver || !started) return
    playerLaneRef.current = Math.max(0, playerLaneRef.current - 1)
    setPlayerLane(playerLaneRef.current)
  }
  const moveRight = () => {
    if (gameOver || !started) return
    playerLaneRef.current = Math.min(lanes - 1, playerLaneRef.current + 1)
    setPlayerLane(playerLaneRef.current)
  }

  const handleCanvasClick = () => {
    if (!started) return beginCountdown()
    if (gameOver) return beginCountdown()
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] shadow cursor-pointer"
        />
        {(!started || gameOver || countingDown) && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              {countingDown ? (
                <div className="text-5xl font-extrabold text-white drop-shadow">{countdown}</div>
              ) : (
                <button
                  type="button"
                  onClick={() => (started ? beginCountdown() : beginCountdown())}
                  className="pointer-events-auto rounded-full border border-[var(--brand-deep)] bg-[var(--brand-accent)]/60 px-5 py-2 text-sm font-medium text-[var(--brand-text)] shadow"
                  aria-label={started ? '게임 재시작' : '게임 시작'}
                >
                  {started ? '재시작' : '시작'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 text-sm text-[var(--brand-muted)]">
        <span>← → 방향키로 이동</span>
        <span className="mx-1">·</span>
        <span>스페이스/엔터로 시작/재시작</span>
      </div>
      <div className="md:hidden flex items-center gap-3">
        <button onClick={moveLeft} className="rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-4 py-2">◀︎</button>
        <button onClick={() => beginCountdown()} className="rounded-full border border-[var(--brand-deep)] bg-[var(--brand-accent)]/40 px-4 py-2">
          {started && !gameOver ? '진행중' : countingDown ? `${countdown}` : started ? '재시작' : '시작'}
        </button>
        <button onClick={moveRight} className="rounded-full border border-[var(--brand-border)] bg-[var(--brand-surface-2)] px-4 py-2">▶︎</button>
      </div>
      <div className="text-sm text-[var(--brand-deep)]">점수: {score} {typeof bestScore === 'number' ? <span className="ml-2 text-[var(--brand-muted)]">(최고: {bestScore})</span> : null}</div>
    </div>
  )
}
