import { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { debounce } from 'radash'
import { CaseMeta } from '@/lib/supabase'

interface UseCaseSearchProps {
  cases: CaseMeta[]
  activeFilters: string[]
}

export function useCaseSearch({ cases, activeFilters }: UseCaseSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)

  const searchInputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<HTMLDivElement>(null)

  const debouncedSetSearchQuery = useMemo(
    () =>
      debounce({ delay: 300 }, (query: string) => {
        setDebouncedSearchQuery(query)
      }),
    [],
  )

  useEffect(() => {
    debouncedSetSearchQuery(searchQuery)
  }, [searchQuery, debouncedSetSearchQuery])

  const searchSuggestions = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return []

    const query = debouncedSearchQuery.toLowerCase()
    const suggestions = new Set<string>()

    cases.forEach((caseItem) => {
      if (caseItem.title.toLowerCase().includes(query)) {
        suggestions.add(caseItem.title)
      }

      if (caseItem.subtitle.toLowerCase().includes(query)) {
        suggestions.add(caseItem.subtitle)
      }

      caseItem.tech.forEach((tech) => {
        if (tech.toLowerCase().includes(query)) {
          suggestions.add(tech)
        }
      })

      if (caseItem.slug.toLowerCase().includes(query)) {
        suggestions.add(caseItem.slug)
      }
    })

    return Array.from(suggestions).slice(0, 8) // limit: 8
  }, [cases, debouncedSearchQuery])

  const searchFilteredCases = useMemo(() => {
    let filtered = cases

    if (activeFilters.length > 0) {
      filtered = filtered.filter((caseItem) =>
        activeFilters.some((filter) => caseItem.tech.some((tech) => tech.includes(filter))),
      )
    }

    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase()
      filtered = filtered.filter(
        (caseItem) =>
          caseItem.title.toLowerCase().includes(query) ||
          caseItem.subtitle.toLowerCase().includes(query) ||
          caseItem.slug.toLowerCase().includes(query) ||
          caseItem.tech.some((tech) => tech.toLowerCase().includes(query)),
      )
    }

    return filtered
  }, [cases, activeFilters, debouncedSearchQuery])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setShowAutocomplete(value.trim().length > 0)
    setSelectedSuggestionIndex(-1)
  }, [])

  const handleSearchClear = useCallback(() => {
    setSearchQuery('')
    setDebouncedSearchQuery('')
    setShowAutocomplete(false)
    setSelectedSuggestionIndex(-1)
    searchInputRef.current?.focus()
  }, [])

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearchQuery(suggestion)
    setShowAutocomplete(false)
    setSelectedSuggestionIndex(-1)
    searchInputRef.current?.blur()
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showAutocomplete || searchSuggestions.length === 0) return

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
          }
          break
        case 'Escape':
          setShowAutocomplete(false)
          setSelectedSuggestionIndex(-1)
          break
      }
    },
    [showAutocomplete, searchSuggestions, selectedSuggestionIndex, handleSuggestionClick],
  )

  const resetSearch = useCallback(() => {
    setSearchQuery('')
    setDebouncedSearchQuery('')
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
    debouncedSearchQuery,
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
    resetSearch,
    setShowAutocomplete,
  }
}
