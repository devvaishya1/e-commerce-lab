import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function Navbar({ health, onResetFilters }) {
  const isConnected = health?.database?.connected;
  const isHealthy = health?.status === 'ok';

  return (
    <>
      {/* Top micro announcement bar */}
      <div className="announcement-bar">
        <div className="announcement-content">
          <span className="announcement-dot"></span>
          <span>COMPLIMENTARY EXPRESS SHIPPING | VÉLORA AUTUMN / WINTER COLLECTION</span>
        </div>
      </div>

      {/* Main sticky navigation header */}
      <header className="site-header">
        <div className="header-inner">
          <div className="brand-wrapper" onClick={onResetFilters} role="button" tabIndex={0} aria-label="GenZ Fits Home">
            <div className="brand-mark">V</div>
            <div className="brand-text-block">
              <span className="brand-title">GENZ FITS</span>
              <span className="brand-subtext">VÉLORA EDITIONS · ATELIER</span>
            </div>
          </div>

          <div className="header-actions">
            {/* System / Database connection indicator */}
            <div
              className="status-indicator-badge"
              title={health?.database?.statusMessage || 'Checking API connection...'}
            >
              <span
                className={`status-dot ${
                  isConnected ? 'online' : isHealthy ? 'fallback' : 'offline'
                }`}
              ></span>
              <span>
                {isConnected
                  ? 'PostgreSQL Active'
                  : isHealthy
                  ? 'Catalog Live'
                  : 'Connecting...'}
              </span>
            </div>

            {/* Wardrobe preview indicator (Assignment Part 1 scope) */}
            <button
              className="card-view-btn"
              style={{ padding: '8px 14px', fontSize: '11.5px' }}
              onClick={() => alert('Wardrobe & Checkout are reserved for Part 2 per assignment specifications.')}
              aria-label="View fashion wardrobe"
            >
              <ShoppingBag size={14} />
              <span>Wardrobe (0)</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
