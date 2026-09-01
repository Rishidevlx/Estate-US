import React from 'react';
import { MapPin, Phone, Mail, Home } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-about">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
              <img src={settings?.logo || "/estate-removebg-preview.png"} alt="Sampras Realty Group Logo" style={{ height: '45px' }} onError={(e) => { e.target.style.display = 'none'; }} />
              <img src="/homesmart-logo-red-wht.png" alt="HomeSmart Logo" style={{ height: '45px' }} />
            </div>
            <h3 style={{ color: 'var(--accent-gold)', marginTop: '1rem', fontFamily: 'Outfit' }}>Let's Talk Real Estate</h3>
            <p>We are here to answer your questions, discuss your goals, and help you take the next step in your real estate journey.</p>
          </div>
          
          <div className="footer-links">
            <h4 className="footer-title">Quick Links</h4>
            <ul>
              <li><a href="/#home">Home</a></li>
              <li><a href="/#about">About Us</a></li>
              <li><a href="/#services">Our Services</a></li>
              <li><a href="/#contact">Contact</a></li>
              <li><a href="/blog">Blog</a></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h4 className="footer-title">Contact Us</h4>
            <ul className="contact-info">
              <li><MapPin size={18} className="contact-icon" /> <span style={{ whiteSpace: 'pre-line' }}>{settings.address || 'Houston, Texas'}</span></li>
              <li>
                <a href={`mailto:${settings.email || 'homes@samprasrealty.com'}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Mail size={18} className="contact-icon" /> {settings.email || 'homes@samprasrealty.com'}
                </a>
              </li>
              <li>
                <a href={`tel:${settings.phone?.replace(/[^0-9+]/g, '')}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Phone size={18} className="contact-icon" /> {settings.phone || '+1 979 600 2124'}
                </a>
              </li>
              <li><Home size={18} className="contact-icon" /> www.samprasrealtygroup.com</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2026 Sampras Realty Group. All Rights Reserved. Luxury Real Estate Services Across Houston, Texas.</p>
          <p>Developed by <a href="https://www.lykspire.com/" target="_blank" rel="noopener noreferrer" className="developer-link">Lykspire</a></p>
        </div>
      </div>
    </footer>
  );
}
