export interface CaseMeta {
  id: number
  slug: string
  title: string
  subtitle: string
  summary: string
  description?: string
  tech?: string[]
  link?: string
}

export const caseList: CaseMeta[] = [
  {
    id: 2400,
    slug: 'ai-description-error',
    title: '이 버튼은 어디서 왔나',
    subtitle: '디자인 오차 발생 사건',
    summary:
      '디자인 가이드의 불일치로 유사한 컴포넌트가 중복 생성되면서 일부 화면에서 오차 발생. Storybook 기반 디자인 시스템 도입으로 해결.',
    description:
      '공통 요소를 수정했지만 일부 컴포넌트에만 반영되는 문제가 발생했습니다. 기존에 미묘하게 다른 스타일의 컴포넌트가 중복 생성되어 있었고, 디자인 의도와 구현물이 어긋나는 사례도 있었습니다. 이를 해결하기 위해 디자인 시스템을 패키지화하고, Storybook을 도입해 디자이너와의 협업을 표준화했습니다.',
    tech: ['Storybook', '디자인 시스템'],
    link: 'https://google.com',
  },
  {
    id: 2401,
    slug: 'state-overlap',
    title: '이 버튼은 어디서 왔나',
    subtitle: '디자인 오차 발생 사건',
    summary:
      '디자인 가이드의 불일치로 유사한 컴포넌트가 중복 생성되면서 일부 화면에서 오차 발생. Storybook 기반 디자인 시스템 도입으로 해결.',
    description:
      '공통 요소를 수정했지만 일부 컴포넌트에만 반영되는 문제가 발생했습니다. 기존에 미묘하게 다른 스타일의 컴포넌트가 중복 생성되어 있었고, 디자인 의도와 구현물이 어긋나는 사례도 있었습니다. 이를 해결하기 위해 디자인 시스템을 패키지화하고, Storybook을 도입해 디자이너와의 협업을 표준화했습니다.',
    tech: ['Storybook', '디자인 시스템'],
    link: 'https://google.com',
  },
  {
    id: 2402,
    slug: 'design-gap',
    title: '이 버튼은 어디서 왔나',
    subtitle: '디자인 오차 발생 사건',
    summary:
      '디자인 가이드의 불일치로 유사한 컴포넌트가 중복 생성되면서 일부 화면에서 오차 발생. Storybook 기반 디자인 시스템 도입으로 해결.',
    description:
      '공통 요소를 수정했지만 일부 컴포넌트에만 반영되는 문제가 발생했습니다. 기존에 미묘하게 다른 스타일의 컴포넌트가 중복 생성되어 있었고, 디자인 의도와 구현물이 어긋나는 사례도 있었습니다. 이를 해결하기 위해 디자인 시스템을 패키지화하고, Storybook을 도입해 디자이너와의 협업을 표준화했습니다.',
    tech: ['Storybook', '디자인 시스템'],
    link: 'https://google.com',
  },
  {
    id: 2403,
    slug: 'thumbnail-delay',
    title: '이 버튼은 어디서 왔나',
    subtitle: '디자인 오차 발생 사건',
    summary:
      '디자인 가이드의 불일치로 유사한 컴포넌트가 중복 생성되면서 일부 화면에서 오차 발생. Storybook 기반 디자인 시스템 도입으로 해결.',
    description:
      '공통 요소를 수정했지만 일부 컴포넌트에만 반영되는 문제가 발생했습니다. 기존에 미묘하게 다른 스타일의 컴포넌트가 중복 생성되어 있었고, 디자인 의도와 구현물이 어긋나는 사례도 있었습니다. 이를 해결하기 위해 디자인 시스템을 패키지화하고, Storybook을 도입해 디자이너와의 협업을 표준화했습니다.',
    tech: ['Storybook', '디자인 시스템'],
    link: 'https://google.com',
  },
  {
    id: 2404,
    slug: 'npc-silent',
    title: '이 버튼은 어디서 왔나',
    subtitle: '디자인 오차 발생 사건',
    summary:
      '디자인 가이드의 불일치로 유사한 컴포넌트가 중복 생성되면서 일부 화면에서 오차 발생. Storybook 기반 디자인 시스템 도입으로 해결.',
    description:
      '공통 요소를 수정했지만 일부 컴포넌트에만 반영되는 문제가 발생했습니다. 기존에 미묘하게 다른 스타일의 컴포넌트가 중복 생성되어 있었고, 디자인 의도와 구현물이 어긋나는 사례도 있었습니다. 이를 해결하기 위해 디자인 시스템을 패키지화하고, Storybook을 도입해 디자이너와의 협업을 표준화했습니다.',
    tech: ['Storybook', '디자인 시스템'],
    link: 'https://google.com',
  },
  {
    id: 2405,
    slug: 'chart-missing',
    title: '이 버튼은 어디서 왔나',
    subtitle: '디자인 오차 발생 사건',
    summary:
      '디자인 가이드의 불일치로 유사한 컴포넌트가 중복 생성되면서 일부 화면에서 오차 발생. Storybook 기반 디자인 시스템 도입으로 해결.',
    description:
      '공통 요소를 수정했지만 일부 컴포넌트에만 반영되는 문제가 발생했습니다. 기존에 미묘하게 다른 스타일의 컴포넌트가 중복 생성되어 있었고, 디자인 의도와 구현물이 어긋나는 사례도 있었습니다. 이를 해결하기 위해 디자인 시스템을 패키지화하고, Storybook을 도입해 디자이너와의 협업을 표준화했습니다.',
    tech: ['Storybook', '디자인 시스템'],
    link: 'https://google.com',
  },
]

export const getCaseMeta = (id: number) => {
  return caseList.find((item) => item.id === id)
}
