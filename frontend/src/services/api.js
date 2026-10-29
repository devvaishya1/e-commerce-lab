// API Service Layer for GenZ Fits (VÉLORA Collection) E-Commerce Client

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Fetch product list with optional filters and sorting
 * @param {Object} params
 * @param {string} [params.search]
 * @param {string} [params.category]
 * @param {string} [params.sortBy]
 */
export async function fetchProducts({ search = '', category = 'all', sortBy = 'newest' } = {}) {
  const queryParams = new URLSearchParams();

  if (search && search.trim()) {
    queryParams.set('search', search.trim());
  }

  if (category && category !== 'all') {
    queryParams.set('category', category);
  }

  if (sortBy && sortBy !== 'default') {
    queryParams.set('sortBy', sortBy);
  }

  const queryString = queryParams.toString();
  const url = `${API_BASE}/products${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Failed to fetch products (HTTP ${response.status})`);
  }

  return data;
}

/**
 * Fetch single product details by numeric ID
 * @param {number|string} id
 */
export async function fetchProductById(id) {
  const url = `${API_BASE}/products/${id}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Failed to fetch product #${id} (HTTP ${response.status})`);
  }

  return data;
}

/**
 * Fetch backend and database health status
 */
export async function fetchHealth() {
  const url = `${API_BASE}/health`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Health check failed (HTTP ${response.status})`);
  }

  return data;
}
