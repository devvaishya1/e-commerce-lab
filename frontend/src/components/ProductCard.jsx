import React from 'react';
import { ArrowUpRight, Star } from 'lucide-react';

export default function ProductCard({ product, onSelect }) {
  // Format price in Indian Rupee (INR)
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.price);

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock === 0;

  return (
    <article
      className="product-card"
      onClick={() => onSelect(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(product);
        }
      }}
      aria-label={`Inspect ${product.name}`}
    >
      <div className="card-image-container">
        <img
          src={product.image_url}
          alt={product.name}
          className="card-product-img"
          loading="lazy"
        />
        <span className="card-category-badge">{product.category}</span>
        <span className="card-stock-pill">
          {isOutOfStock
            ? 'Archive Only'
            : isLowStock
            ? `Limited: ${product.stock} pieces`
            : `${product.stock} available`}
        </span>
      </div>

      <div className="card-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
          <Star size={13} fill="#c9931b" stroke="#c9931b" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {product.rating || '4.9'}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            ({product.reviews_count || 48} reviews)
          </span>
        </div>

        <h3 className="card-title">{product.name}</h3>
        <p className="card-description">{product.description}</p>

        <div className="card-meta-row">
          <div className="card-price-block">
            <span className="card-price-label">Price</span>
            <span className="card-price-value">{formattedPrice}</span>
          </div>

          <button
            className="card-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            aria-label={`View silhouette of ${product.name}`}
          >
            <span>View Piece</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
