import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconSearch, IconX } from '@tabler/icons-react'

import { useCaseSearch } from '@/hooks/useCaseSearch'
import { CaseMeta } from '@/lib/supabase'

import styles from './CaseSearch.module.scss'

interface CaseSearchProps {
  cases: CaseMeta[]
  activeFilters: string[]
  debouncedSearchQuery?: string
  onSearchChange?: (filteredCases: CaseMeta[]) => void
}

export default function CaseSearch({
  cases,
  activeFilters,
  debouncedSearchQuery: externalDebouncedQuery,
  onSearchChange,
}: CaseSearchProps) {
  const {
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
    setShowAutocomplete,
  } = useCaseSearch({ cases, activeFilters })

  React.useEffect(() => {
    if (onSearchChange) {
      onSearchChange(searchFilteredCases)
    }
  }, [searchFilteredCases, onSearchChange])

  const currentDebouncedQuery = externalDebouncedQuery ?? debouncedSearchQuery

  return (
    <div className={styles.searchSection}>
      <div className={styles.searchInputWrapper}>
        <div className={styles.searchInputContainer}>
          <IconSearch className={styles.searchIcon} size={20} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="사건 제목, 기술스택으로 검색"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            onFocus={() => searchQuery.trim() && setShowAutocomplete(true)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleSearchClear}
              className={styles.clearButton}
              aria-label="검색어 지우기"
            >
              <IconX size={16} />
            </button>
          )}
        </div>

        <AnimatePresence>
          {showAutocomplete && searchSuggestions.length > 0 && (
            <motion.div
              ref={autocompleteRef}
              className={styles.autocompleteDropdown}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {searchSuggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  type="button"
                  className={`${styles.suggestionItem} ${
                    index === selectedSuggestionIndex ? styles.selected : ''
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  whileHover={{ backgroundColor: 'var(--color-primary-10)' }}
                >
                  <IconSearch size={14} className={styles.suggestionIcon} />
                  <span>{suggestion}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {(currentDebouncedQuery || activeFilters.length > 0) && (
        <div className={styles.resultsCount}>
          <p>
            {searchFilteredCases.length}개의 사건이 발견되었습니다
            {currentDebouncedQuery && (
              <span className={styles.searchTerm}>&quot;{currentDebouncedQuery}&quot;</span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
