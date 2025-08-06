import { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { debounce } from 'radash'
import { CaseMeta } from 'lib/supabase'

interface UseCaseSearchProps {
  cases: CaseMeta[]
  activeFilters: string[]
}

export function useCaseSearch({ cases, activeFilters }: UseCaseSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [finalQuery, setFinalQuery] = useState('') // 실제 검색에 사용되는 쿼리
  const [autoCompleteQuery, setAutoCompleteQuery] = useState('') // 자동완성 추천용 쿼리
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<HTMLDivElement>(null)

  const debouncedSetSearchQuery = useMemo(
    () =>
      debounce({ delay: 300 }, (query: string) => {
        setAutoCompleteQuery(query)
      }),
    [],
  )

  useEffect(() => {
    debouncedSetSearchQuery(searchQuery)
  }, [searchQuery, debouncedSetSearchQuery])

  // 스택 필터 + 최종 검색어 기반 필터링
  const searchFilteredCases = useMemo(() => {
    let filtered = cases

    if (activeFilters.length > 0) {
      filtered = filtered.filter((caseItem) =>
        activeFilters.some((filter) => caseItem.tech.some((tech) => tech.includes(filter))),
      )
    }

    if (finalQuery.trim()) {
      const query = finalQuery.toLowerCase()
      filtered = filtered.filter(
        (caseItem) =>
          caseItem.title.toLowerCase().includes(query) ||
          caseItem.subtitle.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [cases, activeFilters, finalQuery])

  const generateSuggestions = useCallback(
    (query: string) => {
      if (!query.trim()) return []

      const searchTerm = query.toLowerCase()
      const suggestions = new Set<string>()

      // 실제 매칭되는 케이스들 먼저 찾기 (제목, 부제목)
      const matchingCases = cases.filter(
        (caseItem) =>
          caseItem.title.toLowerCase().includes(searchTerm) ||
          caseItem.subtitle.toLowerCase().includes(searchTerm),
      )

      // 매칭되는 케이스들에서 실제로 매칭되는 텍스트만 추출
      matchingCases.forEach((caseItem) => {
        if (caseItem.title.toLowerCase().includes(searchTerm)) {
          suggestions.add(caseItem.title)
        }
        if (caseItem.subtitle.toLowerCase().includes(searchTerm)) {
          suggestions.add(caseItem.subtitle)
        }
      })

      return Array.from(suggestions).slice(0, 8)
    },
    [cases],
  )

  const searchSuggestions = useMemo(() => {
    return generateSuggestions(autoCompleteQuery)
  }, [generateSuggestions, autoCompleteQuery])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setShowAutocomplete(value.trim().length > 0)
    setSelectedSuggestionIndex(-1)
  }, [])

  const handleSearchClear = useCallback(() => {
    setSearchQuery('')
    setFinalQuery('')
    setAutoCompleteQuery('')
    setShowAutocomplete(false)
    setSelectedSuggestionIndex(-1)
    searchInputRef.current?.focus()
  }, [])

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearchQuery(suggestion)
    setFinalQuery(suggestion)
    setShowAutocomplete(false)
    setSelectedSuggestionIndex(-1)
    searchInputRef.current?.blur()
  }, [])

  const handleSearchSubmit = useCallback(() => {
    setFinalQuery(searchQuery.trim())
    setShowAutocomplete(false)
    setSelectedSuggestionIndex(-1)
  }, [searchQuery])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showAutocomplete || searchSuggestions.length === 0) {
        if (e.key === 'Enter') {
          e.preventDefault()
          handleSearchSubmit()
        }
        return
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedSuggestionIndex((prev) => (prev < searchSuggestions.length - 1 ? prev + 1 : 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : searchSuggestions.length - 1))
          break
        case 'Enter':
          e.preventDefault()
          if (selectedSuggestionIndex >= 0) {
            handleSuggestionClick(searchSuggestions[selectedSuggestionIndex])
          } else {
            handleSearchSubmit()
          }
          break
        case 'Escape':
          setShowAutocomplete(false)
          setSelectedSuggestionIndex(-1)
          break
      }
    },
    [
      showAutocomplete,
      searchSuggestions,
      selectedSuggestionIndex,
      handleSuggestionClick,
      handleSearchSubmit,
    ],
  )

  const resetSearch = useCallback(() => {
    setSearchQuery('')
    setFinalQuery('')
    setAutoCompleteQuery('')
    setShowAutocomplete(false)
    setSelectedSuggestionIndex(-1)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node) &&
        !searchInputRef.current?.contains(event.target as Node)
      ) {
        setShowAutocomplete(false)
        setSelectedSuggestionIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return {
    searchQuery,
    finalQuery,
    autoCompleteQuery,
    showAutocomplete,
    selectedSuggestionIndex,
    searchSuggestions,
    searchFilteredCases,

    searchInputRef,
    autocompleteRef,

    handleSearchChange,
    handleSearchClear,
    handleSuggestionClick,
    handleKeyDown,
    handleSearchSubmit,
    resetSearch,
    setShowAutocomplete,
  }
}
