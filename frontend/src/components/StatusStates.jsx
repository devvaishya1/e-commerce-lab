import React from 'react';
import { AlertCircle, Shirt, RefreshCw } from 'lucide-react';

/**
 * Loading Skeleton Grid
 * Displays an elegant shimmer skeleton while waiting for API response
 */
export function LoadingSkeletonGrid({ count = 6 }) {
  return (
    <div className="product-grid" aria-label="Loading fashion catalogue">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-line short"></div>
            <div className="skeleton-line medium"></div>
            <div className="skeleton-line full"></div>
            <div className="skeleton-line short" style={{ marginTop: '12px' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Empty State
 * Displayed when no fashion items match the search or category filters
 */
export function EmptyState({ search, category, onReset }) {
  return (
    <div className="empty-state-card" role="status">
      <div className="empty-icon-wrap">
        <Shirt size={32} />
      </div>
      <h3 className="empty-heading">No Pieces Found</h3>
      <p className="empty-subtext">
        {search
          ? `We couldn't locate any pieces matching "${search}" in ${
              category === 'all' ? 'the current collection' : category
            }. Try refining your search terms or clearing active filters.`
          : `No silhouettes are currently catalogued in the "${category}" category.`}
      </p>
      <button className="reset-filters-btn" onClick={onReset}>
        Clear Filters & View All
      </button>
    </div>
  );
}

/**
 * Error State
 * Displayed when an API request fails, offering explanation and retry button
 */
export function ErrorState({ error, onRetry }) {
  return (
    <div className="error-state-banner" role="alert">
      <div className="error-icon-box">
        <AlertCircle size={24} />
      </div>
      <div className="error-info-body">
        <h4 className="error-title">Unable to Connect to Fashion Catalogue Service</h4>
        <p className="error-message">
          {error || 'An error occurred while communicating with the Express API. Please ensure the backend server is running on port 5000.'}
        </p>
        <button className="retry-action-btn" onClick={onRetry}>
          <RefreshCw size={13} />
          <span>Retry Connection</span>
        </button>
      </div>
    </div>
  );
}
