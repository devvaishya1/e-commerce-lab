const db = require('../config/db');
const initialProducts = require('../data/initialProducts');

// Helper to filter and sort fallback memory data if database is offline
function queryFallbackProducts({ search, category, sortBy }) {
  let results = [...initialProducts];

  if (category && category.toLowerCase() !== 'all') {
    results = results.filter(
      p => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    results = results.filter(
      p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  if (sortBy) {
    switch (sortBy) {
      case 'price_asc':
        results.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price_desc':
        results.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'name_asc':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        results.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating':
        results.sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
      case 'newest':
      default:
        results.sort((a, b) => a.id - b.id);
        break;
    }
  }

  return results;
}

// GET /api/products
// Retrieves list of products with optional search, category filter, and sorting
async function getAllProducts(req, res, next) {
  const { search, category, sortBy } = req.query;
  const allowFallback = process.env.USE_FALLBACK_ON_DB_ERROR !== 'false';

  try {
    // 1. Attempt PostgreSQL Query
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category.toLowerCase() !== 'all') {
      params.push(category);
      sql += ` AND LOWER(category) = LOWER($${params.length})`;
    }

    if (search && search.trim() !== '') {
      params.push(`%${search.trim().toLowerCase()}%`);
      sql += ` AND (LOWER(name) LIKE $${params.length} OR LOWER(description) LIKE $${params.length})`;
    }

    // Dynamic sorting
    switch (sortBy) {
      case 'price_asc':
        sql += ' ORDER BY price ASC';
        break;
      case 'price_desc':
        sql += ' ORDER BY price DESC';
        break;
      case 'name_asc':
        sql += ' ORDER BY name ASC';
        break;
      case 'name_desc':
        sql += ' ORDER BY name DESC';
        break;
      case 'rating':
        sql += ' ORDER BY rating DESC';
        break;
      case 'newest':
      default:
        sql += ' ORDER BY id ASC';
        break;
    }

    const { rows } = await db.query(sql, params);

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
      meta: {
        source: 'postgresql',
        filters: { search: search || null, category: category || 'all', sortBy: sortBy || 'default' }
      }
    });
  } catch (err) {
    if (allowFallback) {
      console.warn(`[API Notice] Serving fallback dataset due to database error: ${err.message}`);
      const fallbackData = queryFallbackProducts({ search, category, sortBy });
      return res.status(200).json({
        success: true,
        count: fallbackData.length,
        data: fallbackData,
        meta: {
          source: 'fallback_catalog',
          notice: 'Serving offline seed catalog. PostgreSQL was unreachable at request time.',
          filters: { search: search || null, category: category || 'all', sortBy: sortBy || 'default' }
        }
      });
    }

    // Strict mode
    return next(err);
  }
}

// GET /api/products/:id
// Retrieves single product by its numeric ID
async function getProductById(req, res, next) {
  const productId = req.validatedId;
  const allowFallback = process.env.USE_FALLBACK_ON_DB_ERROR !== 'false';

  try {
    const { rows } = await db.query('SELECT * FROM products WHERE id = $1', [productId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Product not found with ID: ${productId}`
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
      meta: { source: 'postgresql' }
    });
  } catch (err) {
    if (allowFallback) {
      console.warn(`[API Notice] Serving fallback detail due to database error: ${err.message}`);
      const product = initialProducts.find(p => p.id === productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Product not found with ID: ${productId}`
        });
      }

      return res.status(200).json({
        success: true,
        data: product,
        meta: {
          source: 'fallback_catalog',
          notice: 'Serving offline seed item. PostgreSQL was unreachable at request time.'
        }
      });
    }

    return next(err);
  }
}

// GET /api/health
// System and database status endpoint
async function getHealth(req, res) {
  const dbStatus = db.getDbStatus();

  res.status(200).json({
    success: true,
    status: 'ok',
    service: 'genz-fits-api',
    collection: 'VÉLORA Contemporary Fashion',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    database: {
      type: 'PostgreSQL',
      configuredHost: dbStatus.host,
      connected: dbStatus.connected,
      statusMessage: dbStatus.connected
        ? 'Connected to PostgreSQL database'
        : dbStatus.lastError || 'Disconnected (Fallback mode active)'
    }
  });
}

module.exports = {
  getAllProducts,
  getProductById,
  getHealth
};
