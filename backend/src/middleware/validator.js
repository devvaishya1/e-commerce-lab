// Request validation middleware for e-commerce API

// Validate product ID parameter
function validateProductId(req, res, next) {
  const { id } = req.params;

  // Must be an integer greater than 0
  const parsedId = Number(id);
  if (!/^\d+$/.test(id) || !Number.isInteger(parsedId) || parsedId <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid product ID. The ID must be a positive integer.'
    });
  }

  req.validatedId = parsedId;
  next();
}

// Validate query parameters for product listing
function validateProductQueryParams(req, res, next) {
  const { search, category, sortBy } = req.query;

  if (search && typeof search === 'string' && search.length > 100) {
    return res.status(400).json({
      success: false,
      error: 'Search query is too long. Maximum allowed length is 100 characters.'
    });
  }

  if (category && typeof category === 'string' && category.length > 80) {
    return res.status(400).json({
      success: false,
      error: 'Category filter is too long. Maximum allowed length is 80 characters.'
    });
  }

  const allowedSortOptions = ['price_asc', 'price_desc', 'name_asc', 'name_desc', 'newest', 'rating'];
  if (sortBy && !allowedSortOptions.includes(sortBy)) {
    return res.status(400).json({
      success: false,
      error: `Invalid sortBy parameter. Allowed options: ${allowedSortOptions.join(', ')}`
    });
  }

  next();
}

module.exports = {
  validateProductId,
  validateProductQueryParams
};
