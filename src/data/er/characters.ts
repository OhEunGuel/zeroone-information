export type ERCharacter = {
  slug: string
  name: string
  role: '근접' | '원거리' | '지원' | '탱커'
  difficulty: '하' | '중' | '상'
}

const KNOWN: ERCharacter[] = [
  { slug: 'Lenox', name: '레녹스', role: '근접', difficulty: '중' },
  { slug: 'Jackie', name: '재키', role: '근접', difficulty: '하' },
  { slug: 'Hyunwoo', name: '현우', role: '근접', difficulty: '중' },
  { slug: 'Nadine', name: '나딘', role: '원거리', difficulty: '상' },
  { slug: 'Aya', name: '아야', role: '원거리', difficulty: '중' },
  { slug: 'Emma', name: '엠마', role: '지원', difficulty: '하' },
]

const EXTRA: ERCharacter[] = Array.from({ length: 78 }).map((_, i) => {
  const n = (i + 1).toString().padStart(2, '0')
  const slug = `Char${n}`
  const name = `실험체 ${n}`
  const role: ERCharacter['role'] = (['근접', '원거리', '지원', '탱커'] as const)[i % 4]
  const difficulty: ERCharacter['difficulty'] = (['하', '중', '상'] as const)[i % 3]
  return { slug, name, role, difficulty }
})

export const ER_CHARACTERS: ERCharacter[] = [...KNOWN, ...EXTRA]
