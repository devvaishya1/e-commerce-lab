import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, onSelectProduct }) {
  return (
    <div className="product-grid" role="region" aria-label="Product list">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={onSelectProduct}
        />
      ))}
    </div>
  );
}
