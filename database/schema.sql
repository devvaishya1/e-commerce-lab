-- ==============================================================================
-- GENZ FITS (VÉLORA COLLECTION) - PostgreSQL Schema
-- Contemporary Fashion & Streetwear Catalogue Database Schema
-- ==============================================================================

-- Drop table if exists to allow clean resets
DROP TABLE IF EXISTS products CASCADE;

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) UNIQUE NOT NULL,
    category VARCHAR(80) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    image_url TEXT NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 4.8 CHECK (rating >= 0 AND rating <= 5.0),
    reviews_count INTEGER DEFAULT 0 CHECK (reviews_count >= 0),
    material VARCHAR(150),
    dimensions VARCHAR(120), -- Used for sizes / dimensions (e.g. "Sizes: S, M, L, XL")
    origin VARCHAR(100) DEFAULT 'Vélora Studio',
    in_stock BOOLEAN GENERATED ALWAYS AS (stock > 0) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optimize search and filtering operations
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_name ON products(LOWER(name));
CREATE INDEX idx_products_price ON products(price);
