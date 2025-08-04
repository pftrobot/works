import { create } from 'zustand'
import { supabase, CaseMeta } from '@/lib/supabase'

interface CaseState {
  cases: CaseMeta[]
  filteredCases: CaseMeta[]
  activeFilters: string[]
  isLoading: boolean
  error: string | null

  fetchCases: () => Promise<void>
  setActiveFilters: (filters: string[]) => void
  filterCases: (filters: string[]) => void
  getCaseById: (id: number) => CaseMeta | undefined
}

export const useCaseStore = create<CaseState>((set, get) => ({
  cases: [],
  filteredCases: [],
  activeFilters: [],
  isLoading: false,
  error: null,

  fetchCases: async () => {
    set({ isLoading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        console.error('Supabase Error::', error)
        throw error
      }

      set({
        cases: data || [],
        filteredCases: data || [],
        isLoading: false,
      })
    } catch (error) {
      console.error('Fetch error:: Case List::', error)
      set({
        error: error instanceof Error ? error.message : 'Error',
        isLoading: false,
      })
    }
  },

  setActiveFilters: (filters: string[]) => {
    set({ activeFilters: filters })
    get().filterCases(filters)
  },

  filterCases: (filters: string[]) => {
    const { cases } = get()

    if (filters.length === 0) {
      set({ filteredCases: cases })
      return
    }

    const filtered = cases.filter((caseItem) =>
      filters.every((filter) => caseItem.tech.some((tech) => tech.includes(filter))),
    )

    set({ filteredCases: filtered })
  },

  getCaseById: (id: number) => {
    const { cases } = get()
    return cases.find((caseItem) => caseItem.id === id)
  },
}))

export const FILTER_KEYWORDS = [
  '전체',
  '렌더링',
  '인증',
  '인터랙션',
  'SSR',
  '데이터',
  '컴포넌트',
] as const
export type FilterKeyword = (typeof FILTER_KEYWORDS)[number]
