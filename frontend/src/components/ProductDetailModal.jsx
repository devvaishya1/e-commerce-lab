import React, { useEffect } from 'react';
import { X, Star, CheckCircle2, ShoppingBag, Sparkles } from 'lucide-react';

export default function ProductDetailModal({ product, onClose }) {
  // Close modal on Escape key press
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  // Format price in Indian Rupee (INR)
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(product.price);

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock === 0;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close fashion details modal"
        >
          <X size={18} />
        </button>

        {/* Gallery / Fashion Image Pane */}
        <div className="modal-gallery">
          <img
            src={product.image_url}
            alt={product.name}
            className="modal-main-img"
          />
        </div>

        {/* Product Details Content */}
        <div className="modal-content-pane">
          <div className="modal-category-eyebrow">
            <Sparkles size={14} />
            <span>GENZ FITS · VÉLORA / {product.category}</span>
          </div>

          <h2 id="modal-title" className="modal-product-title">
            {product.name}
          </h2>

          <div className="modal-rating-row">
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={15}
                  fill={i < Math.floor(product.rating || 5) ? '#c9931b' : 'none'}
                  stroke="#c9931b"
                />
              ))}
            </div>
            <span>
              <strong>{product.rating || 4.9}</strong> ({product.reviews_count || 50} verified editorial reviews)
            </span>
          </div>

          <div className="modal-price-tag">{formattedPrice}</div>

          <p className="modal-description-text">{product.description}</p>

          {/* Technical Specifications Table */}
          <table className="modal-specs-table">
            <tbody>
              <tr>
                <th>Availability</th>
                <td>
                  <span
                    className={`stock-status-pill ${
                      isOutOfStock
                        ? 'out-of-stock'
                        : isLowStock
                        ? 'low-stock'
                        : 'in-stock'
                    }`}
                  >
                    <CheckCircle2 size={12} />
                    {isOutOfStock
                      ? 'Archived (Out of stock)'
                      : isLowStock
                      ? `Limited Run: Only ${product.stock} pieces left`
                      : `In Stock (${product.stock} pieces in atelier)`}
                  </span>
                </td>
              </tr>
              {product.material && (
                <tr>
                  <th>Fabrication</th>
                  <td>{product.material}</td>
                </tr>
              )}
              {product.dimensions && (
                <tr>
                  <th>Sizing & Cut</th>
                  <td>{product.dimensions}</td>
                </tr>
              )}
              {product.origin && (
                <tr>
                  <th>Atelier / Origin</th>
                  <td>{product.origin}</td>
                </tr>
              )}
              <tr>
                <th>Reference SKU</th>
                <td>GZF-{product.id.toString().padStart(4, '0')}</td>
              </tr>
            </tbody>
          </table>

          {/* Action button */}
          <div className="modal-actions-bar">
            <button
              className="btn-primary-action"
              onClick={() => alert(`Piece recorded for your wardrobe: ${product.name} (SKU: GZF-${product.id.toString().padStart(4, '0')}). Note: Part 1 focuses on catalog, search, and API inspection.`)}
            >
              <ShoppingBag size={16} />
              <span>Add to Wardrobe</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
