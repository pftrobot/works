import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IconSearch, IconX } from '@tabler/icons-react'

import { useCaseSearch } from 'hooks/useCaseSearch'
import { CaseMeta } from 'lib/supabase'

import styles from './CaseSearch.module.scss'

interface CaseSearchProps {
  cases: CaseMeta[]
  activeFilters: string[]
  onSearchChange?: (filteredCases: CaseMeta[]) => void
}

export default function CaseSearch({ cases, activeFilters, onSearchChange }: CaseSearchProps) {
  const {
    searchQuery,
    finalQuery,
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
    setShowAutocomplete,
  } = useCaseSearch({ cases, activeFilters })

  React.useEffect(() => {
    if (onSearchChange) {
      onSearchChange(searchFilteredCases)
    }
  }, [searchFilteredCases, onSearchChange])

  return (
    <div className={styles.searchSection}>
      <div className={styles.searchInputWrapper}>
        <div className={styles.searchInputContainer}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="사건 제목으로 검색"
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
          <button
            type="button"
            onClick={handleSearchSubmit}
            className={styles.searchButton}
            aria-label="검색하기"
          >
            <IconSearch size={16} />
          </button>
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

      {(finalQuery || activeFilters.length > 0) && (
        <div className={styles.resultsCount}>
          <p>
            {searchFilteredCases.length}개의 사건이 발견되었습니다
            {finalQuery && <span className={styles.searchTerm}>&quot;{finalQuery}&quot;</span>}
          </p>
        </div>
      )}
    </div>
  )
}
