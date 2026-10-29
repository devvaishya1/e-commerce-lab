import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand-title">GENZ FITS</div>
          <p className="footer-description">
            VÉLORA Contemporary Atelier. Redefining modern menswear and womenswear through
            architectural drape, organic fabrication, and understated luxury.
            Built as a robust full-stack laboratory implementation showcasing clean 3-tier architecture:
            React Client → Express REST API → PostgreSQL Database.
          </p>
        </div>

        <div>
          <div className="footer-col-heading">System Architecture</div>
          <ul className="footer-link-list">
            <li>• Frontend: React 18 + Vite</li>
            <li>• Backend: Node.js + Express</li>
            <li>• Database: PostgreSQL (pg pool)</li>
            <li>• Security: Zero direct DB exposure</li>
          </ul>
        </div>

        <div>
          <div className="footer-col-heading">Lab Assignment</div>
          <ul className="footer-link-list">
            <li>• MNIT Programming Lab</li>
            <li>• Lab Assignment 9 (Part 1)</li>
            <li>• Fashion Catalogue & Search</li>
            <li>• REST API & Seed Scripts</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div>
          © {new Date().getFullYear()} GENZ FITS · VÉLORA Editions. Academic Laboratory Assignment.
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>PostgreSQL 14+</span>
          <span>Express 4.x</span>
          <span>Vite 5.x</span>
        </div>
      </div>
    </footer>
  );
}
