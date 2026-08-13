# MOA — 그룹 여행 중재 서비스

> 싸울 건 싸우고, 여행은 같이.

MOA는 서로 다른 여행 취향을 모아 대리인들이 대신 의견을 조율하고, 결정 근거까지 보여주는 그룹 여행 프론트엔드 프로토타입입니다.

## 핵심 경험

- 여행지와 기본 정보를 정해 여행 방을 만들어요.
- 친구마다 절대 조건과 여행 취향을 입력해요.
- 각자의 대리인이 숙소, 식사, 활동, 교통을 함께 논의해요.
- 의견이 갈리면 MOA가 실제 조건을 확인하고 타협안을 정리해요.
- 최종 일정과 만족도, 양보 내역, 소수 의견을 함께 확인해요.

## 주요 화면

| 화면 | 로컬 주소 |
| --- | --- |
| 랜딩 | `/?stage=landing` |
| 여행 방 생성 완료 | `/?stage=invite` |
| 여행 방 | `/?stage=lobby` |
| 절대 조건 설문 | `/?stage=hard` |
| 내 대리인 | `/?stage=persona` |
| 회의 진행 | `/?stage=running` |
| 최종 결과 | `/?stage=result` |
| 일정 | `/?stage=result&tab=itinerary` |
| 공평성 | `/?stage=result&tab=fairness` |
| 회의 다시보기 | `/?stage=replay` |

## 기술 스택

- React 19
- TypeScript 5.8
- Vite 7
- Framer Motion
- Phosphor Icons
- Tailwind CSS / PostCSS

## 로컬 실행

Node.js 20 이상을 권장합니다.

```bash
npm install
npm run dev
```

브라우저에서 터미널에 표시된 로컬 주소를 열면 됩니다. 기본 주소는 `http://localhost:5173`입니다.

## 품질 검사

```bash
npm run lint
npm run build
```

## 프로젝트 구조

```text
src/
├── App.tsx        # 전체 사용자 흐름과 화면 컴포넌트
├── data.ts        # 오사카 데모 데이터
├── main.tsx       # React 진입점
└── styles.css     # 디자인 시스템과 반응형 스타일

public/
├── assets/
│   ├── moa-wordmark.png
│   └── fukuoka.webp
└── manifest.webmanifest
```

## 현재 구현 범위

현재 버전은 오사카 3박 4일, 6인 그룹을 기준으로 만든 프론트엔드 데모입니다. 설문, 대리인 회의, 팩트 체크, 합의, 결과 확인 흐름은 목 데이터로 동작합니다. 실제 인증, 알림, 예약 API, 대리인 백엔드는 추후 연동 대상입니다.

## 디자인 원칙

- Pretendard를 기본 UI 서체로 사용합니다.
- 따뜻한 크림 배경과 MOA 코랄을 중심으로 구성합니다.
- 여행을 먼저 보여주고, 대리인 기술은 필요한 순간에만 드러냅니다.
- 캐릭터나 마스코트 없이 MOA 워드마크와 제품 화면으로 브랜드를 표현합니다.
- 데스크톱과 모바일에서 같은 흐름과 기능을 유지합니다.
