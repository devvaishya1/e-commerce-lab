const express = require('express');
const router = express.Router();
const productRoutes = require('./productRoutes');
const { getHealth } = require('../controllers/productController');

// Health check endpoint: GET /api/health
router.get('/health', getHealth);

// Product catalog routes: /api/products
router.use('/products', productRoutes);

module.exports = router;
