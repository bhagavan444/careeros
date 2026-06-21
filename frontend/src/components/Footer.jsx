import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Linkedin, Github, Twitter } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="apple-footer">
        <div className="apple-footer-content">
          <div className="footer-grid-flagship">
            
            {/* Brand Section */}
            <div className="footer-brand-section">
              <div className="footer-brand-title">CareerOS</div>
              <div className="footer-brand-subtitle">Professional Intelligence Operating System</div>
              <p className="footer-brand-desc">
                Helping professionals understand their strengths, discover opportunities, and make career decisions with confidence.
              </p>
            </div>

            {/* Links Sections */}
            <div className="footer-links-container">
              <div className="footer-link-group">
                <Link to="/intelligence" className="footer-link">Intelligence</Link>
                <Link to="/journey" className="footer-link">Journey</Link>
                <Link to="/tools" className="footer-link">Tools</Link>
                <Link to="/vision" className="footer-link">Vision</Link>
                <Link to="/conversations" className="footer-link">Conversations</Link>
              </div>
              <div className="footer-link-group">
                <Link to="/about" className="footer-link">About</Link>
                <Link to="/contact" className="footer-link">Contact</Link>
                <Link to="/privacy" className="footer-link">Privacy</Link>
                <Link to="/terms" className="footer-link">Terms</Link>
                <Link to="/careers" className="footer-link">Careers</Link>
              </div>
              
              {/* Social */}
              <div className="footer-social-group">
                <a href="#" className="footer-social-link" aria-label="LinkedIn"><Linkedin size={20} strokeWidth={1.5} /></a>
                <a href="#" className="footer-social-link" aria-label="GitHub"><Github size={20} strokeWidth={1.5} /></a>
                <a href="#" className="footer-social-link" aria-label="Twitter"><Twitter size={20} strokeWidth={1.5} /></a>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom-bar">
            <div className="footer-copyright">
              © 2026 CareerOS
            </div>
            <div className="footer-locale">
              Built in India. Designed for global talent.
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button 
        className={`apple-scroll-top ${showScroll ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </button>
    </>
  );
};

export default Footer;
