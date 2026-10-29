const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProductId, validateProductQueryParams } = require('../middleware/validator');

// GET /api/products - list all products with optional query filtering
router.get('/', validateProductQueryParams, productController.getAllProducts);

// GET /api/products/:id - get single product by ID
router.get('/:id', validateProductId, productController.getProductById);

module.exports = router;
