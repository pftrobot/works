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
  thumbnail: string
  link?: string
}

export const caseList: CaseMeta[] = [
  {
    id: 1134,
    slug: 'thumbnail-delay',
    title: '썸네일 실종 미스터리',
    subtitle: '이미지가 안뜨는 사이트의 비밀',
    summary:
      '누구보다 빠르게 보여줘야 할 썸네일이, 가장 느리다. 성격 급한 사용자들을 지키기 위한 이미지 최적화 수사가 시작됐다.',
    quiz: {
      question: '이미지 로딩 성능을 개선하기 위한 실무적 기술 조합으로 가장 적절한 것은?',
      options: [
        'JWT 인증 처리로 사용자 세션 유지',
        'WebP 이미지 포맷과 Intersection Observer 기반 Lazy Load',
        'Service Worker로 푸시 알림 구현',
        'SASS로 스타일 파일을 컴포넌트 단위로 분리',
      ],
      answer: 1,
    },
    description:
      '사용자 이탈률 급증. 현장엔 수십 개의 이미지가 동시에 요청되고 있었고, 브라우저는 버거워했다. 수사관은 즉시 lazy-loading을 투입, WebP로 압축 포맷을 교체하고, Intersection Observer로 실제 보이는 것만 불러오게 조치했다. 또, aspect-ratio로 비율을 고정하고, Skeleton UI로 레이아웃을 안정화시켰다. 최종 보고서엔 “로딩 속도 약 34% 단축, 성능 회복 완료”가 적혔다.',
    tech: [
      '이미지',
      '성능',
      'Intersection Observer',
      'Skeleton UI',
      'Lazy Loading',
      'WebP',
      '렌더링',
    ],
    thumbnail: '/imgs/case3.png',
  },
  {
    id: 6001,
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
        '토큰 만료로 발생하는 인증 오류',
        '브라우저별 렌더링 방식 차이',
      ],
      answer: 1,
    },
    description:
      '한 버튼이 화면마다 다르게 생겼다. 디자인 실종 사건의 전말은 ‘비슷하지만 다른’ 공통 컴포넌트의 난립이었다. 수사관은 디자인 시스템을 재정립하고, 시각 가이드를 표준화했다. 그 핵심 증거는 바로 Storybook. 개발자와 디자이너 간 브리핑 라인을 만들고, 각 컴포넌트의 외형과 동작을 정조준할 수 있게 했다. 그날 이후, 유사 컴포넌트는 자취를 감췄다.',
    tech: ['Storybook', '디자인 시스템', '컴포넌트', 'DX'],
    thumbnail: '/imgs/case2.png',
  },
  {
    id: 2147,
    slug: 'chart-missing',
    title: '차트 유기 의혹',
    subtitle: '보이지 않는 대시보드',
    summary:
      '차트는 존재했지만, 처음엔 안 보였다. SSR 단계와 인증 지연 사이의 타이밍 범인이 밝혀진 순간, 무언가로 그들을 감쌌다.',
    quiz: {
      question: 'SSR 환경에서 인증 지연으로 인해 데이터 렌더링이 실패하는 경우 가장 적절한 대응은?',
      options: [
        '초기 렌더링을 CSR 방식으로 모두 전환한다',
        '필요한 모든 데이터를 사전 static 파일로 처리한다',
        'Suspense와 조건 분기로 인증 완료 후 로딩 처리한다',
        '차트를 이미지로 캡처해 표시한다',
      ],
      answer: 2,
    },
    description:
      '첫 진입 시 차트가 없었다. 새로고침하면 나타나는 차트, 그 사이에 숨어 있는 건 인증 지연이었다. SSR 단계에서는 인증이 완료되지 않아 API 호출이 무력화되고 있었다. 수사관은 Suspense를 사용해 인증이 완료될 때까지 기다리도록 했고, 인증 상태를 감지해 안전하게 분기 처리했다. 차트는 다시 제 자리를 찾았으며 범인은 “타이밍”이었다.',
    tech: ['Next', 'Suspense', 'SSR-safe', '렌더링', '인증'],
    thumbnail: '/imgs/case5.png',
  },
  {
    id: 1138,
    slug: 'opt-update-race',
    title: '끝나지 않는 옵티미스틱',
    subtitle: 'UI 무한 루프의 늪',
    summary:
      'Optimistic UI를 적용한 뒤 예상치 못한 리렌더링 현상이 반복 발생했다. 수사관은 클라이언트 상태와 네트워크 요청 간의 엇갈린 흐름을 추적하기 시작했다.',
    quiz: {
      question:
        '다음 중 React Query로 Optimistic UI를 구현할 때 무한 리렌더링을 방지하기 위한 적절한 방법은?',
      options: [
        'useEffect 안에서 setState를 호출해 즉시 반영한다',
        'mutate 직후 refetch를 강제로 트리거한다',
        'queryClient.invalidateQueries를 반복 호출한다',
        'queryClient.setQueryData로 캐시만 갱신하고 refetch를 피한다',
      ],
      answer: 3,
    },
    description:
      '사용자의 클릭과 동시에 UI는 빠르게 반응했지만, 곧이어 화면이 끊임없이 깜빡이기 시작했다. 수사관은 상태 변경 직후 발생한 자동 refetch가 또 다른 상태 변경을 유발하고, 그로 인해 mutation이 반복 실행되는 악순환 구조를 포착했다. 이 리렌더링 루프는 `invalidateQueries`가 매번 새 요청을 유도하면서 벌어진 일이었다. 수사관은 서버 응답을 기다리지 않고, 클라이언트 캐시만 직접 갱신하는 전략으로 전환했다. `setQueryData`를 활용해 서버 통신 없이 상태를 조정하자, 무한 루프는 단번에 끊어졌다.',
    tech: ['렌더링', 'React Query', 'Optimistic UI', '캐시'],
    thumbnail: '/imgs/case9.png',
  },
  {
    id: 5178,
    slug: 'ai-description-error',
    title: 'AI 요약문 왜곡 스캔들',
    subtitle: 'AI 요약문과 상품의 불일치',
    summary:
      '현장에서는 분명 면도기였는데, AI는 자꾸 냉장고라고 주장한다. 텍스트 생성의 단서가 이미지였음을 밝히기까지, 수사는 쉽지 않았다.',
    quiz: {
      question:
        '상품 상세 설명이 이미지로만 구성되어 있을 경우, AI 요약을 위해 어떤 도구 조합이 가장 유효할까?',
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
    tech: ['AI', 'OpenCV', 'OCR', '프롬프트', '이미지'],
    thumbnail: '/imgs/case1.png',
  },
  {
    id: 3120,
    slug: 'npc-silent',
    title: 'NPC 침묵 사건',
    subtitle: '말 없는 NPC의 반란',
    summary:
      '사용자는 분명 클릭했지만 NPC는 반응하지 않는다. WebGL 속에서 발생한 침묵의 원인을 쫓는 인터랙션 추적기.',
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
      'NPC는 클릭에 전혀 반응하지 않았다. 원인은 마우스 좌표가 WebGL 캔버스의 내부 좌표계와 불일치했던 것. 수사관은 화면 좌표를 정규화하고, NPC 객체의 충돌 범위를 다시 계산했다. 이후 인터랙션이 정상 작동하며 NPC는 다시 반응하기 시작했다. 좌표 하나가 인터랙션을 막는 핵심 변수로 작동한, 전형적인 UI-좌표계 충돌 사례였다.',
    tech: ['WebGL', 'Canvas', '좌표', '인터랙션'],
    thumbnail: '/imgs/case4.png',
  },
  {
    id: 4125,
    slug: 'nuxt-ssr-context-error',
    title: 'SSR 위장 실행 사건',
    subtitle: '서버에서 브라우저로의 기습 실행',
    summary:
      '브라우저에서만 돌아야 할 코드가 SSR 단계에서 실행됐다. 환경 체크 없이 API를 호출한 댓가는 꽤 컸다.',
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
      '클라이언트 전용 훅인 `useContext`가 아무 조건 없이 실행되며 SSR 환경에서 타입 에러가 발생했다. 문제는 해당 훅 내부에서 `localStorage`를 사용하고 있었던 것. 서버에는 존재하지 않는 API 호출로 인해 Nuxt는 렌더링을 포기했고, 사용자는 하얀 화면만 보게 되었다. 수사관은 `process.client` 조건 분기를 추가해 훅이 클라이언트에서만 실행되도록 처리했다. 이번 사건은 “훅의 실행 시점과 환경”이 얼마나 중요한지를 보여주는 전형적인 사례였다.',
    tech: ['Nuxt', 'SSR', '환경 분기', '에러 방지', '개발환경'],
    thumbnail: '/imgs/case6.png',
  },
  {
    id: 5142,
    slug: 'double-fetch',
    title: 'API 도플갱어 추적기',
    subtitle: '중복 호출 미스터리',
    summary:
      '페이지 진입 시 동일한 API가 두 번 호출되는 이상 현상 발생. 호출 시점 통제를 통해 문제를 추적해 나갔다.',
    quiz: {
      question:
        'Nuxt에서 `useFetch`를 사용한 API가 예상보다 여러 번 호출되는 주요 원인은 무엇인가요?',
      options: [
        '브라우저의 캐시 정책 설정이 잘못되었기 때문',
        'API 응답이 느려서 재시도됨',
        'SSR과 CSR 모두에서 훅이 실행되었기 때문',
        '서버와 클라이언트의 timezone 설정이 달라서 생긴 오차',
      ],
      answer: 2,
    },
    description:
      '`useFetch`로 데이터를 불러오던 페이지에서 동일 API가 두 번 호출되었다. 한 번은 서버에서, 한 번은 클라이언트에서. 문제는 Nuxt의 SSR/CSR 컨텍스트가 중첩되며 훅이 두 번 실행된 것이었다. 수사관은 `runWithContext`를 통해 클라이언트 진입 시점 이후로 호출 타이밍을 제한했고, API 호출은 정상적으로 단일화되었다. 이 사건은 SSR 기반 프레임워크에서 데이터 호출 타이밍 제어가 얼마나 중요한지를 보여준다.',
    tech: ['데이터', 'Nuxt', 'useFetch', '중복 호출', 'SSR'],
    thumbnail: '/imgs/case7.png',
  },
  {
    id: 2122,
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
      '사건은 한 사용자의 제보로 시작되었다. Google 로그인을 마친 직후엔 정상적으로 인증된 상태였지만, 일정 시간이 지나자 페이지를 새로고침할 때마다 로그아웃 상태가 반복되었다. 범인은 JWT였다.\n\n프론트엔드는 access token만 받아 클라이언트 상태를 유지하고 있었지만, 이 토큰엔 유효기간이 있었다. 백엔드는 refresh token을 갖고 있었지만, 프론트에선 만료된 token을 감지하지 못해, 백엔드 API 호출이 계속 401로 실패하고 있었다.\n\n수사관은 JWT 내부의 `exp` 필드를 decode해 만료 시간을 감지하고, 일정 임계값 이전에 백엔드에 refresh 요청을 보내도록 자동 갱신 로직을 추가했다. 이제 access token은 만료 전에 미리 갱신되고, 사용자는 끊김 없는 인증 경험을 누리게 되었다.\n\n이번 사건은 OAuth 흐름에 대한 백엔드와 프론트엔드 간의 긴밀한 협력이 얼마나 중요한지를 보여준 대표 사례였다.',
    tech: ['인증', 'JWT', 'Google OAuth', '세션'],
    thumbnail: '/imgs/case8.png',
  },
  {
    id: 3139,
    slug: 'focus-inside-iframe',
    title: '포커스 실종 수사',
    subtitle: 'iframe 안의 진실을 추적하라',
    summary:
      '입력을 멈췄는데도 화면은 여전히 입력 중처럼 반응한다. iframe 내부 입력 중 발생한 의문의 포커스 이상 징후, 단서는 어디에 있을까.',
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
      '사용자는 분명 입력을 마쳤지만, 시스템은 여전히 입력 중으로 인식하고 있었다. 문제는 iframe 내부에서 발생한 포커스 이동이 외부에 감지되지 않는 구조였다. 외부 UI는 blur 이벤트를 놓친 채 상태를 갱신하지 못하고 있었다.\n\n수사관은 내부 iframe에 포커스 이동 감지를 위한 스크립트를 삽입하고, `postMessage`를 통해 부모 프레임과의 통신을 구현했다. 이를 통해 내부의 입력 종료를 감지하고 외부 UI와의 상태 동기화를 복구함으로써, 사용자 경험은 안정적으로 회복되었다.',
    tech: ['iframe', 'focus', 'blur', '인터랙션'],
    thumbnail: '/imgs/case10.png',
  },
  {
    id: 5175,
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
    tech: ['HTTP', 'Content-Type', '다운로드', '브라우저', '데이터'],
    thumbnail: '/imgs/case10.png',
  },
]
