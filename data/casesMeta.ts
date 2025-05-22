export interface CaseMeta {
  id: number
  slug: string
  title: string
  subtitle: string
  summary: string
  description: string
  tech: string[]
  quiz: {
    question: string
    options: string[]
    answer: number
  }
  link?: string
}

export const caseList: CaseMeta[] = [
  {
    id: 2401,
    slug: 'ai-description-error',
    title: 'AI 요약문 왜곡 스캔들',
    subtitle: 'AI 요약문과 상품의 불일치',
    summary:
      '현장에서는 분명 면도기였는데, AI는 자꾸 냉장고라고 주장한다. 텍스트 생성의 단서가 이미지였음을 밝히기까지, 수사는 쉽지 않았다.',
    quiz: {
      question:
        '상품 상세 설명이 이미지로만 구성되어 있을 경우, AI 요약을 위해 어떤 도구 조합이 가장 유효할까요?',
      options: [
        'WebSocket + JSON 파싱',
        'Canvas API + getContext',
        'OpenCV + OCR 엔진',
        'JWT + OAuth 인증',
      ],
      answer: 2,
    },
    description:
      '사건은 AI가 엉뚱한 상품 설명을 작성하면서 시작됐다. 수상했던 건 텍스트 대신 이미지로만 구성된 상세페이지. 수사관은 곧바로 OpenCV를 동원해 이미지 반전 및 전처리를 수행하고, OCR로 텍스트를 추출해냈다. 그렇게 얻은 텍스트로 프롬프트를 재구성하자, 드디어 AI는 정신을 차렸다. 범인은 “텍스트가 아닌 이미지”였고, 해결의 열쇠는 컴퓨터 비전 수사였다.',
    tech: ['OpenCV', 'OCR', '프롬프트 설계', '이미지 분류'],
    link: 'https://google.com',
  },
  {
    id: 2402,
    slug: 'design-gap',
    title: '버튼 출처 불명 사건',
    subtitle: '버튼의 정체를 둘러싼 혼란',
    summary:
      '분명 한 번만 만든 버튼인데, 곳곳에 비슷한 애가 퍼져 있다? 증거를 모아보니 공통 컴포넌트 내부에서 일어난 디자인 실종 사건이었다.',
    quiz: {
      question: '다음 중 Storybook 도입으로 가장 직접적으로 해결 가능한 문제는?',
      options: [
        '네트워크 지연으로 인한 응답 속도 저하',
        '중복된 UI 컴포넌트 생성으로 일관성 상실',
        '백엔드 인증 토큰 만료 문제',
        '브라우저 간 렌더링 차이',
      ],
      answer: 1,
    },
    description:
      '한 버튼이 화면마다 다르게 생겼다. 디자인 실종 사건의 전말은 ‘비슷하지만 다른’ 공통 컴포넌트의 난립이었다. 수사관은 디자인 시스템을 재정립하고, 시각 가이드를 표준화했다. 그 핵심 증거는 바로 Storybook. 개발자와 디자이너 간 브리핑 라인을 만들고, 각 컴포넌트의 외형과 동작을 정조준할 수 있게 했다. 그날 이후, 유사 컴포넌트는 자취를 감췄다.',
    tech: ['Storybook', '디자인 시스템', '컴포넌트 일관성'],
    link: 'https://google.com',
  },
  {
    id: 2403,
    slug: 'thumbnail-delay',
    title: '썸네일 실종 미스터리',
    subtitle: '이미지가 안뜨는 사이트의 비밀',
    summary:
      '누구보다 빠르게 보여줘야 할 썸네일이, 가장 느리다. 성격 급한 사용자들을 지키기 위한 이미지 최적화 수사가 시작됐다.',
    quiz: {
      question: '이미지 로딩 최적화에 가장 효과적인 기술 조합은 무엇일까요?',
      options: [
        'JWT 기반 인증 처리',
        'WebP 포맷 + Intersection Observer',
        'Service Worker 알림',
        'SASS를 통한 스타일 분리',
      ],
      answer: 1,
    },
    description:
      '사용자 이탈률 급증. 현장엔 수십 개의 이미지가 동시에 요청되고 있었고, 브라우저는 버거워했다. 수사관은 즉시 lazy-loading을 투입, WebP로 압축 포맷을 교체하고, Intersection Observer로 실제 보이는 것만 불러오게 조치했다. 또, aspect-ratio로 비율을 고정하고, Skeleton UI로 레이아웃을 안정화시켰다. 최종 보고서엔 “로딩 속도 60% 단축, 성능 회복 완료”가 적혔다.',
    tech: [
      'Lazy Loading',
      'WebP',
      'Intersection Observer',
      'decode async',
      'Skeleton UI',
      'aspect-ratio',
    ],
    link: 'https://google.com',
  },
  {
    id: 2404,
    slug: 'npc-silent',
    title: 'NPC 침묵 사건',
    subtitle: '말 없는 NPC의 반란',
    summary:
      '사용자는 클릭했는데 NPC는 말이 없다. WebGL 속에서 무슨 일이 벌어진 걸까? 마우스 좌표와 충돌 범위를 추적한 디지털 추적 수사 보고서.',
    quiz: {
      question:
        'WebGL 기반 환경에서 캔버스 객체와의 상호작용이 감지되지 않을 때 우선 점검할 사항은?',
      options: [
        'z-index를 조정한다',
        'window에 클릭 이벤트를 바인딩한다',
        '좌표를 정규화하고 충돌 영역을 재계산한다',
        'video 태그로 대체한다',
      ],
      answer: 2,
    },
    description:
      'NPC는 클릭에 반응하지 않았다. 원인은 단순했다. 마우스 좌표가 캔버스 내부의 좌표계와 맞지 않았던 것. 수사관은 좌표계를 정규화하고, NPC의 충돌 영역을 다시 계산했다. 좌표를 맞추자, NPC는 다시 입을 열기 시작했다. 이번 사건은 좌표 하나가 얼마나 중요한 증거가 되는지를 보여준 전형적 예시였다.',
    tech: ['WebGL', 'Canvas 이벤트', '좌표 정규화', '충돌 감지', '인터랙션 트리거'],
    link: 'https://google.com',
  },
  {
    id: 2405,
    slug: 'chart-missing',
    title: '차트 유기 의혹',
    subtitle: '보이지 않는 대시보드',
    summary:
      '차트는 존재했지만, 처음엔 안 보였다. SSR 단계와 인증 지연 사이의 타이밍 범인이 밝혀진 순간, Suspense로 그들을 감쌌다.',
    quiz: {
      question: 'SSR 환경에서 인증 지연으로 인해 데이터 렌더링이 실패하는 경우 가장 적절한 대응은?',
      options: [
        'SSR을 포기하고 CSR로 전환한다',
        '모든 데이터를 미리 static 처리한다',
        'Suspense와 조건 분기로 로딩을 처리한다',
        '차트를 이미지로 캡처해 대체한다',
      ],
      answer: 2,
    },
    description:
      '첫 진입 시 차트가 없었다. 재접속하면 나타나는 차트, 그 사이에 숨어 있는 건 인증 지연이었다. SSR 단계에서는 인증이 완료되지 않아 API 호출이 무력화되고 있었다. 수사관은 Suspense를 사용해 인증이 완료될 때까지 기다리도록 했고, 클라이언트 인증 상태를 감지해 안전하게 분기 처리했다. 차트는 다시 제 자리를 찾았고, 범인은 “타이밍”이었다.',
    tech: ['Next.js', 'Suspense', 'SSR-safe 분기', '비동기 렌더링', '클라이언트 인증 흐름'],
    link: 'https://google.com',
  },
  {
    id: 2406,
    slug: 'nuxt-ssr-context-error',
    title: 'SSR 위장 실행 사건',
    subtitle: '서버에서 브라우저로의 기습 실행',
    summary:
      'SSR 환경에서 클라이언트 전용 API가 실행되어 타입 에러 발생. 조건 분기로 SSR-safe 처리하여 사건 종결.',
    quiz: {
      question:
        '다음 중 Nuxt에서 클라이언트 전용 API가 SSR 단계에서 실행될 때 발생할 수 있는 문제를 방지하는 방법으로 가장 적절한 것은?',
      options: [
        'API 호출을 컴포넌트 최상단에서 무조건 실행한다',
        '모든 데이터를 static으로 미리 정의해 둔다',
        '`process.client` 조건 분기로 클라이언트 환경에서만 실행되도록 분기한다',
        '서버에서 실패한 API는 자동으로 클라이언트에서 다시 호출되므로 신경 쓰지 않는다',
      ],
      answer: 2,
    },
    description:
      '수사 중 서버에서 클라이언트 API를 호출하려 한 흔적이 발견됐다. Nuxt 프로젝트에서 SSR 환경에서 실행되면 안 되는 `useContext`가 잘못 사용되어, 서버가 브라우저처럼 행동하려 하며 타입 에러가 연속적으로 발생한 것이다. 우리는 `process.client`를 통한 조건 분기로 사건을 종결지었다. 서버는 다시는 브라우저 행세를 하지 못하도록 감시망에 올랐다.',
    tech: ['Nuxt', 'SSR', 'process.client', '클라이언트 전용 API', '렌더링 조건 분기'],
    link: 'https://google.com',
  },
  {
    id: 2407,
    slug: 'double-fetch',
    title: 'API 도플갱어 추적기',
    subtitle: '중복 호출 미스터리',
    summary:
      'API 호출이 페이지 진입 시 두 번씩 발생. runWithContext로 호출 시점을 통제해 사건 해결.',
    quiz: {
      question:
        'Nuxt에서 `useFetch`를 사용한 API 호출이 예상보다 두 번 이상 발생하는 주요 원인은 무엇일까요?',
      options: [
        '브라우저의 캐시 정책 설정이 잘못되었기 때문',
        'API 응답 속도가 느려서 재호출이 발생함',
        'Nuxt 내부 컨텍스트에서 동일 훅이 중복 실행되었기 때문',
        '서버와 클라이언트의 timezone 설정이 달라서 생긴 오차',
      ],
      answer: 2,
    },
    description:
      '누군가 API를 두 번 호출하고 있었다. 동일한 시점, 동일한 요청. 범인은 바로 Nuxt의 SSR/CSR 컨텍스트 혼선. 수사관은 `runWithContext` 유틸을 이용해 호출 범위를 좁히고, 중복 실행된 훅을 격리 조치했다. 이후 중복 호출은 자취를 감췄고, 네트워크 자원은 평온을 되찾았다.',
    tech: ['Nuxt', 'useFetch', 'runWithContext', 'API 중복 호출 제어'],
    link: 'https://google.com',
  },
  {
    id: 2408,
    slug: 'auth-google-expire',
    title: '세션 증발 사건',
    subtitle: '로그인했는데 로그아웃된 기분',
    summary: 'Google 로그인 후 일정 시간 지나면 인증이 풀리는 문제. JWT 갱신 로직 추가로 해결.',
    quiz: {
      question:
        '다음 중 JWT 기반 인증 시스템에서 세션 유지 문제를 방지하기 위해 필요한 조치는 무엇일까요?',
      options: [
        '토큰을 로컬스토리지 대신 쿠키에 저장한다',
        'JWT의 만료 시간을 늘려 문제를 회피한다',
        '토큰 만료 시간을 확인해 자동 갱신 로직을 추가한다',
        '토큰 없이 사용자 정보를 세션에 저장한다',
      ],
      answer: 2,
    },
    description:
      '로그인한 사용자들이 예고 없이 인증을 잃고 있었다. 토큰은 만료되었지만, 시스템은 아무 말도 하지 않았다. 수사 결과, JWT 만료 시간을 확인하지 않은 채 토큰을 계속 사용하는 치명적 누락이 드러났다. 우리는 토큰 디코딩 후 만료 임계값에 도달하면 자동 갱신하는 감시 시스템을 추가했다. 인증은 다시 철통같이 유지되었다.',
    tech: ['JWT', 'Google OAuth', '토큰 갱신', '세션 관리'],
    link: 'https://google.com',
  },
  {
    id: 2409,
    slug: 'opt-update-race',
    title: '끝나지 않는 옵티미스틱',
    subtitle: 'UI 무한 루프의 늪',
    summary:
      'Optimistic UI 업데이트 직후 자동 refetch가 발생하며 무한 렌더링. 캐시만 갱신해 루프 차단.',
    quiz: {
      question: '다음 중 옵티미스틱 UI 구현 시 리렌더 무한 루프를 방지하는 방법으로 적절한 것은?',
      options: [
        'useEffect 안에서 setState를 호출해 즉시 반영한다',
        'mutate 직후 refetch를 강제로 트리거한다',
        'queryClient.invalidateQueries를 반복 호출한다',
        'queryClient.setQueryData로 캐시만 갱신하고 refetch를 피한다',
      ],
      answer: 3,
    },
    description:
      '사용자가 빠르게 반응하는 UI에 만족한 것도 잠시, 리렌더링이 끝없이 반복되며 시스템은 버벅이기 시작했다. 수사관은 무한 루프의 단서를 `invalidateQueries`에서 찾았다. 이 호출이 원인이 되어, 이미 반영된 변경사항이 계속해서 refetch되는 악순환이 시작된 것. 캐시만 업데이트하는 `setQueryData`로 전략을 전환한 후, 사건은 깔끔히 종결되었다.',
    tech: ['React Query', 'Optimistic UI', 'queryClient', '캐시 갱신'],
    link: 'https://google.com',
  },
  {
    id: 2410,
    slug: 'focus-inside-iframe',
    title: '포커스 실종 수사',
    subtitle: 'iframe 안의 진실을 추적하라',
    summary: 'iframe 내부 입력 중 blur 이벤트가 누락되는 문제. 외부 flag 로직으로 UX 복원.',
    quiz: {
      question:
        'iframe 내부 입력 요소와 상호작용할 때 blur 이벤트 누락을 방지하는 방법으로 가장 적절한 것은?',
      options: [
        'iframe 안에서 직접 blur 이벤트를 위임한다',
        'document.body에 이벤트 리스너를 등록한다',
        'iframe과 외부 DOM을 모두 감지하는 flag 기반 로직을 추가한다',
        'iframe에 allow-blur 속성을 추가한다',
      ],
      answer: 2,
    },
    description:
      '포커스가 사라졌다. 정확히는 감지되지 않았다. iframe 내부에서 입력 중이던 사용자가 포커스를 이동해도, 바깥 세상은 아무것도 몰랐다. 우리는 이 불통의 장벽을 우회하기로 했다. 포커스 상태를 flag로 관리하고, 키 입력 및 클릭 같은 활동을 통해 의심스러운 흐름을 추적했다. 덕분에 iframe 내부와 외부의 감각이 연결되었고, 수사는 성공적으로 마무리되었다.',
    tech: ['iframe', 'focus 이벤트', 'blur 보완 처리', 'UX 개선'],
    link: 'https://google.com',
  },
  {
    id: 2411,
    slug: 'download-octet',
    title: '다운로드 유실 사건',
    subtitle: '파일인가 페이지인가, 브라우저의 선택',
    summary: 'PDF 다운로드 시 Content-Type 누락으로 파일이 열리거나 오류 발생. 헤더 설정으로 복구.',
    quiz: {
      question:
        '다음 중 브라우저가 PDF 파일을 다운로드하도록 하기 위해 가장 중요한 응답 헤더 설정은 무엇일까요?',
      options: [
        'Cache-Control: no-cache',
        'Content-Type: text/plain',
        'Content-Type: application/octet-stream',
        'Access-Control-Allow-Origin: *',
      ],
      answer: 2,
    },
    description:
      '사용자는 다운로드를 눌렀는데, PDF가 열려버렸다. 혹은 아예 오류가 떴다. 수사관은 브라우저의 행동을 의심했고, 응답 헤더를 조사하던 중 Content-Type이 누락된 흔적을 발견했다. 진범은 `application/octet-stream`의 부재. 이를 명확히 명시하고, 필요 시 `Content-Disposition`도 설정하여 사건을 종결지었다. 이제 파일은 다시 올바르게 내려오고 있다.',
    tech: ['HTTP 응답 헤더', 'Content-Type', '파일 다운로드', '브라우저 호환성'],
    link: 'https://google.com',
  },
]

export const getCaseMeta = (id: number) => {
  return caseList.find((item) => item.id === id)
}
