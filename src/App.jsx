import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Home, Key, TrendingUp, Shield, CheckCircle2, Quote, ArrowRight } from 'lucide-react';
import './index.css';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app">
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <div className="logo">
            <img src="/estate-removebg-preview.png" alt="Sampras Realty Group Logo" onError={(e) => {
              e.target.onerror = null; 
              e.target.src = "https://placehold.co/400x150/113c2b/d4af37?text=SAMPRAS+REAL+ESTATE";
            }} />
          </div>
          <ul className="nav-links">
            <li><a href="#home" className="nav-link">Home</a></li>
            <li><a href="#about" className="nav-link">About</a></li>
            <li><a href="#services" className="nav-link">Services</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
          </ul>
          <a href="tel:+17323977880" className="nav-contact">
            <Phone size={20} />
            <span>+1 (732) 397-7880</span>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <img src="/hero.png" alt="Luxury Real Estate Houston" className="hero-bg" />
        <div className="hero-overlay"></div>
        <motion.div 
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1 variants={fadeIn} className="hero-title">Luxury Real Estate.<br/>Exceptional Results.</motion.h1>
          <motion.p variants={fadeIn} className="hero-desc">
            At Sampras Realty Group, we specialize in helping buyers, sellers, and investors navigate Houston’s competitive real estate market with confidence, strategy, and personalized service. Whether you are searching for your dream home, selling a luxury property, or expanding your real estate portfolio, our team delivers a premium experience tailored to your goals.
          </motion.p>
          <motion.div variants={fadeIn} className="hero-buttons">
            <button className="btn btn-primary">Explore Properties</button>
            <button className="btn btn-outline">Schedule Consultation</button>
          </motion.div>
        </motion.div>
      </section>

      {/* Slogan Section */}
      <section className="stats-section">
        <div className="container">
          <motion.div 
            className="slogan-container"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="slogan-subtitle">SAMPRAS REALTY GROUP</p>
            <h2 className="slogan-text">"Where luxury meets integrity, and your real estate vision becomes reality."</h2>
            <div className="slogan-divider"></div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="container">
          <div className="about-grid">
            <motion.div 
              className="about-image"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img src="/about.png" alt="About Sampras Realty Group" />
            </motion.div>
            <motion.div 
              className="about-content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h4 variants={fadeIn} className="hero-subtitle" style={{ fontSize: '1rem', marginBottom: '0.5rem', textAlign: 'left', marginLeft: 0 }}>About Sampras Realty Group</motion.h4>
              <motion.h2 variants={fadeIn}>Delivering Premium Real Estate Experiences Across Houston</motion.h2>
              <motion.p variants={fadeIn}>
                Sampras Realty Group is committed to redefining the real estate experience through professionalism, market expertise, and client-first service. Our mission is to provide exceptional guidance, transparent communication, and results-driven strategies that help our clients succeed in every stage of their real estate journey.
              </motion.p>
              <motion.p variants={fadeIn}>
                With deep knowledge of Houston’s neighborhoods, luxury communities, investment opportunities, and market trends, we help buyers discover ideal homes, sellers maximize property value, and investors build long-term wealth through strategic real estate decisions.
              </motion.p>
              <motion.p variants={fadeIn}>
                Whether you are relocating, purchasing your first property, investing in luxury real estate, or selling a high-value home, Sampras Realty Group provides personalized solutions backed by experience, integrity, and dedication.
              </motion.p>
              <motion.div variants={fadeIn} style={{ marginTop: '2rem' }}>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Work With Our Team <ArrowRight size={18} />
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section services-section">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">Comprehensive Real Estate Solutions</p>
          </motion.div>
          
          <motion.div 
            className="services-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="service-card">
              <Home size={40} className="service-icon" />
              <h3>Buy A Home</h3>
              <p>Find the perfect property with expert guidance, exclusive opportunities, and personalized support tailored to your lifestyle, budget, and long-term goals. We simplify the home-buying process while ensuring you make informed decisions with confidence.</p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="service-card">
              <Key size={40} className="service-icon" />
              <h3>Sell Your Property</h3>
              <p>Our team combines premium marketing, luxury branding, professional presentation, digital exposure, and strategic negotiation to maximize your property’s visibility and value in Houston’s competitive market.</p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="service-card">
              <Shield size={40} className="service-icon" />
              <h3>Luxury Real Estate</h3>
              <p>Experience elevated service for luxury homes, exclusive communities, modern estates, waterfront properties, and high-end real estate opportunities across Houston and surrounding areas.</p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="service-card">
              <TrendingUp size={40} className="service-icon" />
              <h3>Investment Consulting</h3>
              <p>Build long-term wealth through smart real estate investments with guidance from Houston market specialists who understand emerging opportunities, rental potential, appreciation trends, and portfolio growth strategies.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section">
        <div className="container">
          <div className="why-grid">
            <motion.div 
              className="why-content"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h4 variants={fadeIn} className="hero-subtitle" style={{ fontSize: '1rem', marginBottom: '0.5rem', textAlign: 'left', marginLeft: 0 }}>Why Choose Us</motion.h4>
              <motion.h2 variants={fadeIn}>Real Estate Expertise Built On Trust & Results</motion.h2>
              <motion.p variants={fadeIn} style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                At Sampras Realty Group, we believe real estate is more than transactions — it is about relationships, trust, and creating opportunities for our clients to achieve their goals confidently.
              </motion.p>
              <motion.p variants={fadeIn} style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                Our approach combines personalized service, local expertise, data-driven strategies, luxury marketing, and professional negotiation to deliver seamless experiences and exceptional outcomes.
              </motion.p>
              <motion.p variants={fadeIn} style={{ fontWeight: 600, marginTop: '2rem' }}>We pride ourselves on:</motion.p>
              
              <motion.div variants={fadeIn} className="why-list">
                {[
                  "Personalized Client Experience",
                  "Luxury Property Marketing",
                  "Local Houston Market Knowledge",
                  "Professional Negotiation Strategies",
                  "Transparent Communication",
                  "End-To-End Transaction Support",
                  "Exclusive Buyer & Seller Representation",
                  "Long-Term Client Relationships"
                ].map((item, index) => (
                  <div key={index} className="why-item">
                    <CheckCircle2 size={20} className="why-item-icon" />
                    <span>{item}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ backgroundImage: 'url(/hero.png)', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '4px', minHeight: '400px' }}
            >
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section testimonials-section">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">What Our Clients Say</h2>
          </motion.div>
          
          <motion.div 
            className="testimonial-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeIn} className="testimonial-card">
              <Quote size={40} className="quote-icon" />
              <p className="testimonial-text">“Sampras Realty Group made the entire home-buying process seamless and stress-free. Their professionalism, responsiveness, and market expertise exceeded every expectation.”</p>
              <p className="testimonial-author">— Michael R., Houston</p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="testimonial-card">
              <Quote size={40} className="quote-icon" />
              <p className="testimonial-text">“Our property sold faster and above asking price thanks to their exceptional marketing strategy and negotiation skills. The experience was outstanding from start to finish.”</p>
              <p className="testimonial-author">— Jennifer T., Sugar Land</p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="testimonial-card">
              <Quote size={40} className="quote-icon" />
              <p className="testimonial-text">“The team was knowledgeable, professional, and genuinely invested in helping us find the perfect luxury home. We could not have asked for a better real estate experience.”</p>
              <p className="testimonial-author">— David & Sophia L.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Your Next Move Starts With Sampras Realty Group</h2>
            <p>Whether you are buying, selling, relocating, or investing, our team is ready to help you achieve your real estate goals with confidence, clarity, and exceptional service.</p>
            <button className="btn btn-primary">Get Started Today</button>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section contact-section">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Contact Us</h2>
            <p className="section-subtitle">Get in touch with our team of luxury real estate experts</p>
          </motion.div>
          
          <div className="contact-container">
            <motion.div 
              className="contact-form"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name <span>*</span></label>
                  <input type="text" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Email <span>*</span></label>
                  <input type="email" className="form-input" />
                </div>
              </div>
              <div className="form-group">
                <label>Phone <span>*</span></label>
                <input type="tel" className="form-input" />
              </div>
              <div className="form-group">
                <label>Subject <span>*</span></label>
                <input type="text" className="form-input" />
              </div>
              <div className="form-group">
                <label>Message <span>*</span></label>
                <textarea className="form-textarea"></textarea>
              </div>
              <button className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>Send Message</button>
            </motion.div>
            
            <motion.div 
              className="contact-info-block"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3>Sampras Realty Group Office</h3>
              <div className="contact-details">
                <p>1234 Luxury Estate Blvd, Suite 100<br/>Houston, Texas 77002</p>
                
                <a href="tel:+17323977880" className="contact-detail-item" style={{ marginTop: '1.5rem', textDecoration: 'none' }}>
                  <Phone size={20} className="contact-detail-icon" />
                  <span>+1 (732) 397-7880</span>
                </a>
                <div className="contact-detail-item">
                  <Mail size={20} className="contact-detail-icon" />
                  <span style={{ color: 'var(--accent-gold)' }}>info@samprasrealtygroup.com</span>
                </div>
              </div>
              
              <div className="social-links">
                <a href="#" className="social-icon" aria-label="Facebook"><svg xmlns="http://www.w3.org/0000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                <a href="#" className="social-icon" aria-label="Twitter"><svg xmlns="http://www.w3.org/0000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg></a>
                <a href="#" className="social-icon" aria-label="LinkedIn"><svg xmlns="http://www.w3.org/0000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
              </div>
              
              <div className="map-container">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110502.61185038317!2d-95.40129145000001!3d29.760426750000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640b8b4488d8501%3A0xca0d02def365053b!2sHouston%2C%20TX!5e0!3m2!1sen!2sus!4v1705608246328!5m2!1sen!2sus" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-about">
              <img src="/estate-removebg-preview.png" alt="Sampras Realty Group" style={{ height: '50px', filter: 'brightness(0) invert(1)' }} onError={(e) => { e.target.style.display = 'none'; }} />
              <h3 style={{ color: 'var(--accent-gold)', marginTop: '1rem', fontFamily: 'Outfit' }}>Let's Talk Real Estate</h3>
              <p>We are here to answer your questions, discuss your goals, and help you take the next step in your real estate journey.</p>
            </div>
            
            <div className="footer-links">
              <h4 className="footer-title">Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#services">Our Services</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            
            <div className="footer-contact">
              <h4 className="footer-title">Contact Us</h4>
              <ul className="contact-info">
                <li><MapPin size={18} className="contact-icon" /> Houston, Texas</li>
                <li><Mail size={18} className="contact-icon" /> info@samprasrealtygroup.com</li>
                <li>
                  <a href="tel:+17323977880" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Phone size={18} className="contact-icon" /> +1 (732) 397-7880
                  </a>
                </li>
                <li><Home size={18} className="contact-icon" /> www.samprasrealtygroup.com</li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© 2026 Sampras Realty Group. All Rights Reserved. Luxury Real Estate Services Across Houston, Texas.</p>
            <p>Developed by <a href="https://www.lykspire.com/" target="_blank" rel="noopener noreferrer" className="developer-link">LykSphere</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
