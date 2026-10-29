import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';

export default function HeroBanner({ totalProducts = 12 }) {
  const scrollToCatalogue = (e) => {
    e.preventDefault();
    const section = document.getElementById('catalogue-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-inner">
        <div>
          <div className="hero-tag">
            <Sparkles size={13} />
            <span>Autumn / Winter Editorial Edit</span>
          </div>

          <h1 className="hero-heading">
            Discover Your Style. <em>Tailored for the new era.</em>
          </h1>

          <p className="hero-description">
            GENZ FITS introduces the VÉLORA collection—a study in architectural silhouettes,
            fluid wool tailoring, Japanese selvedge denim, and minimalist leather craftsmanship.
            Designed with quiet confidence for the contemporary wardrobe.
          </p>

          <div className="hero-cta-group">
            <a
              href="#catalogue-section"
              onClick={scrollToCatalogue}
              className="btn-hero-primary"
              id="explore-collection-btn"
            >
              <span>Explore Collection</span>
              <ArrowDown size={15} />
            </a>
          </div>

          <div className="hero-meta-badges">
            <div className="hero-meta-item">
              <span className="hero-meta-number">{totalProducts}</span>
              <span className="hero-meta-label">Curated Silhouettes</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-number">100%</span>
              <span className="hero-meta-label">Virgin & Organic Fabrics</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-number">0%</span>
              <span className="hero-meta-label">Direct DB Exposure</span>
            </div>
          </div>
        </div>

        {/* Feature spotlight card */}
        <div className="hero-feature-card">
          <div className="hero-feature-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1000&q=80"
              alt="Oversized Wool Trench Coat editorial look"
              className="hero-feature-img"
            />
            <span className="hero-feature-badge">Editorial Highlight</span>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--burgundy-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              VÉLORA Atelier · Outerwear
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '21px', fontWeight: 700, color: '#111111', marginTop: '3px' }}>
              Oversized Wool Trench Coat
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.5' }}>
              Heavyweight virgin wool blend with structured drop shoulders and detachable cinch belt.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
