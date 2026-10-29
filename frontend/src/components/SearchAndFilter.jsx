import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Collections' },
  { id: 'Jackets & Outerwear', label: 'Jackets & Outerwear' },
  { id: 'Shirts & Tops', label: 'Shirts & Tops' },
  { id: 'Trousers & Bottoms', label: 'Trousers & Bottoms' },
  { id: 'Dresses & Silhouettes', label: 'Dresses & Silhouettes' },
  { id: 'Sneakers & Footwear', label: 'Sneakers & Footwear' },
  { id: 'Accessories & Leather', label: 'Accessories & Leather' }
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Curated Selection' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name_asc', label: 'Alphabetical: A to Z' },
  { value: 'name_desc', label: 'Alphabetical: Z to A' }
];

export default function SearchAndFilter({
  search,
  setSearch,
  category,
  setCategory,
  sortBy,
  setSortBy,
  totalResults,
  onReset
}) {
  const hasActiveFilters = (search && search.trim() !== '') || category !== 'all' || sortBy !== 'newest';

  return (
    <div className="controls-container">
      {/* Top search & sorting toolbar */}
      <div className="search-and-sort-bar">
        {/* Search input field */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon-inside" />
          <input
            type="text"
            className="search-input"
            placeholder="Search trench coats, silk shirts, trousers, boots, dresses, bags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search fashion pieces"
          />
          {search && (
            <button
              className="search-clear-btn"
              onClick={() => setSearch('')}
              aria-label="Clear search text"
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Sort by dropdown */}
        <div className="sort-select-wrapper">
          <label htmlFor="sort-select" className="sort-label">
            Sort by:
          </label>
          <select
            id="sort-select"
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="category-pills-row" role="tablist" aria-label="Fashion categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={category === cat.id}
            className={`filter-pill ${category === cat.id ? 'active' : ''}`}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results summary and active chip tags */}
      <div className="results-summary-row">
        <div>
          Displaying <strong>{totalResults}</strong> {totalResults === 1 ? 'fashion piece' : 'fashion pieces'}
          {category !== 'all' && <span> in <em>{category}</em></span>}
          {search.trim() && <span> matching "<em>{search.trim()}</em>"</span>}
        </div>

        {hasActiveFilters && (
          <div className="active-filters-badges">
            {search.trim() && (
              <span className="filter-tag-chip">
                "{search.trim()}"
                <button
                  className="filter-chip-remove"
                  onClick={() => setSearch('')}
                  title="Remove search filter"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            {category !== 'all' && (
              <span className="filter-tag-chip">
                {category}
                <button
                  className="filter-chip-remove"
                  onClick={() => setCategory('all')}
                  title="Reset category"
                >
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              onClick={onReset}
              className="card-view-btn"
              style={{ padding: '5px 12px', fontSize: '11px', background: 'transparent' }}
              title="Reset all filters"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
