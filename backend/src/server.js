const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/apiRoutes');
const { testConnection } = require('./config/db');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing
app.use(cors({
  origin: '*', // Allow frontend development server
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse incoming JSON payloads
app.use(express.json());

// Request logger for development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Root informational endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'GenZ Fits API',
    collection: 'VÉLORA Editorial Fashion Catalogue',
    description: 'College E-Commerce Lab Assignment REST Backend',
    version: '1.0.0',
    documentation: {
      health: '/api/health',
      products: '/api/products',
      productById: '/api/products/:id'
    }
  });
});

// Mount API routes under /api
app.use('/api', apiRoutes);

// 404 Handler for undefined routes
app.use(notFoundHandler);

// Centralized error handling
app.use(globalErrorHandler);

// Start server and check database connection
const server = app.listen(PORT, async () => {
  console.log('====================================================');
  console.log(`  GenZ Fits (VÉLORA) Backend Server Running          `);
  console.log(`  Local URL: http://localhost:${PORT}              `);
  console.log(`  API Health: http://localhost:${PORT}/api/health   `);
  console.log(`  Products:   http://localhost:${PORT}/api/products `);
  console.log('====================================================');

  await testConnection();
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nGracefully shutting down server...');
  server.close(() => {
    console.log('Backend server terminated.');
    process.exit(0);
  });
});

module.exports = app;
