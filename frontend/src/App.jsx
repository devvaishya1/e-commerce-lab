import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import SearchAndFilter from './components/SearchAndFilter';
import ProductGrid from './components/ProductGrid';
import ProductDetailModal from './components/ProductDetailModal';
import { LoadingSkeletonGrid, EmptyState, ErrorState } from './components/StatusStates';
import Footer from './components/Footer';
import { fetchProducts, fetchProductById, fetchHealth } from './services/api';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [health, setHealth] = useState(null);

  // Debounce search input by 300ms to avoid spamming the backend API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch health status on mount
  useEffect(() => {
    let isMounted = true;
    async function checkHealth() {
      try {
        const res = await fetchHealth();
        if (isMounted) setHealth(res);
      } catch (err) {
        if (isMounted) setHealth({ status: 'error', error: err.message });
      }
    }
    checkHealth();
    return () => { isMounted = false; };
  }, []);

  // Fetch products when filters, category, or sorting changes
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchProducts({
        search: debouncedSearch,
        category,
        sortBy
      });
      setProducts(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to retrieve products from server.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, sortBy]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setCategory('all');
    setSortBy('newest');
  };

  // Open product details modal (and verify GET /api/products/:id)
  const handleSelectProduct = async (product) => {
    try {
      // Fetch full individual product detail from backend to verify endpoint
      const detailRes = await fetchProductById(product.id);
      setSelectedProduct(detailRes.data || product);
    } catch (err) {
      // Fallback to already present product data if detail endpoint had transient error
      setSelectedProduct(product);
    }
  };

  return (
    <div className="app-container">
      {/* Header and Brand Bar */}
      <Navbar health={health} onResetFilters={handleResetFilters} />

      {/* Editorial Hero Banner */}
      <HeroBanner totalProducts={products.length || 12} />

      {/* Main Content Area / Catalogue Section */}
      <main className="main-content" id="catalogue-section">
        {/* Search, Filter, Sort Controls */}
        <SearchAndFilter
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalResults={products.length}
          onReset={handleResetFilters}
        />

        {/* Error State Banner */}
        {error && (
          <ErrorState error={error} onRetry={loadProducts} />
        )}

        {/* Loading State Skeleton */}
        {loading && <LoadingSkeletonGrid count={6} />}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <EmptyState
            search={debouncedSearch}
            category={category}
            onReset={handleResetFilters}
          />
        )}

        {/* Product Catalog Grid */}
        {!loading && !error && products.length > 0 && (
          <ProductGrid
            products={products}
            onSelectProduct={handleSelectProduct}
          />
        )}
      </main>

      {/* Product Details Modal View */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
