# 기술 수사관 포트폴리오

>이 프로젝트는 수사관 콘셉트로 제작된 포트폴리오 사이트입니다.\
사용자는 사건 기록을 열람하고, 프로파일을 확인하며, 단서를 찾듯 기술 여정을 탐험할 수 있습니다.

## 프로젝트 개요
• 기본환경: **Next 15 + React 19, TypeScript**\
• 상태관리: Zustand\
• 데이터: Supabase\
• 스타일링/애니메이션: SCSS, Framer, Three.js\
• 빌드/런타임: Turbopack, pnpm

⸻

## 주요 페이지

- ### HomeMain (홈)
    •	큐브 스캐너 인증 애니메이션으로 시작\
    •	"ACCESS AUTHORIZED" 타이핑 효과\
    •	사건 기록 열람, 수사관 프로파일 버튼\
    •	GuideNotice 컴포넌트

- ### AboutMain (소개)
    •	프로필 카드 섹션\
    •	DNA – 수사 스타일 수치 시각화\
    •	TECH – 사용 기술 요약\
    •	TIMELINE – 성장 히스토리

- ### CaseMain (사건)
    •	사건 검색 기능 (CaseSearch)\
    •	태그 기반 필터링 (React, Next.js 등)\
    •	사건 카드 그리드\
    •	사건 상세 모달 (CaseDetailModal) – 사건의 맥락, 단서, 해결 기록 열람

- ### ContactMain (제보)
    •	"Mission control online" 타이핑 애니메이션\
    •	연락처 폼 (이름, 이메일, 메시지)\
    •	전송 제한 및 성공 메시지\
    •	메달 보상 시스템과 연동

- ### MedalMain (메달함)
    •	사용자 랭크 표시\
    •	획득한 메달 목록\
    •	메달 수집 방법 가이드 제공

⸻

### 메달 시스템
- 랭크: 활동에 따라 탐색자 → 조력자 → 파트너로 성장
- 메달 획득 방식:\
  •	사건 기록 열람\
  •	수사 모달에서 단서 탐색 및 퀴즈 해결\
  •	Contact 페이지를 통한 제보/협업 시도\
  •	이스터에그 발견

⸻

### 이스터에그 시스템

- 사이트 곳곳에 숨겨진 세 가지 유형의 이스터에그가 배치되어 있습니다.\
•	기본 에그: 비교적 쉽게 발견 가능\
•	스페셜 에그: 특정 행동 조건 달성 시 획득 가능\
•	히든 에그: 특정한 상황에서만 나타나는 비밀 단서

- 이스터에그를 일정량 수집하면 특별한 보상이 기다리고 있습니다.

⸻

## 기술 스택

- 프론트엔드\
•	React 19 · Next.js 15\
•	TypeScript · SCSS 모듈\
•	Framer Motion (애니메이션)\
•	Three.js (3D 연출)\
•	React Intersection Observer (스크롤 기반 인터랙션)

- 데이터\
•	Zustand (전역 상태 관리)\
•	Supabase (DB)

- 유틸리티\
•	Zod (스키마 기반 검증)\
•	Radash (유틸 함수)\
•	classnames (조건부 스타일링)

- 개발 환경\
•	ESLint + Prettier (코드 품질 관리)\
•	Turbopack (개발 빌드)\
•	pnpm (패키지 매니저)

⸻

## 실행 방법

- ### 의존성 설치
    *pnpm i*

- ### 개발 서버 실행
    *pnpm dev*

- ### 빌드
    *pnpm build*

⸻