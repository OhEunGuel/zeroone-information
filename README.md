Next.js minimal starter with Tailwind v4 and Prisma (MySQL)

Quickstart

1) 환경변수 설정
- `.env.example`를 `.env`로 복사 후 MySQL 연결 문자열을 설정하세요.
- 예시: `mysql://USER:PASSWORD@HOST:PORT/DATABASE`

2) 의존성 설치 및 Prisma Client 생성
- `npm install`
- `npx prisma generate`

3) (선택) 스키마 정의 및 마이그레이션
- `prisma/schema.prisma`에 모델을 작성하고 아래 명령으로 DB에 반영합니다.
- `npx prisma migrate dev --name init`

4) 개발 서버 실행
- `npm run dev`

비고
- Tailwind v4는 `postcss.config.mjs`와 `src/app/globals.css`로 구성되어 있습니다.
- 서버 코드에서 `import { PrismaClient } from '@prisma/client'`로 사용하세요.
