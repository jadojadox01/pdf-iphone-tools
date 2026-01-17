'use client';

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Other Tools', href: '/tools' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' }
  ];

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.navContainer}>
        {/* Logo */}
        <div style={styles.logo}>
          <a href="/" style={styles.logoLink}>
            Free PDF iPhone Tools
          </a>
        </div>

        {/* Desktop Menu */}
        <div style={styles.desktopMenu}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              style={styles.navLink}
              onClick={isMobile ? closeMenu : undefined}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          style={styles.menuButton}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span style={{
            ...styles.menuIcon,
            transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
            transition: 'transform 0.2s ease'
          }}></span>
          <span style={{
            ...styles.menuIcon,
            opacity: isMenuOpen ? 0 : 1,
            transition: 'opacity 0.2s ease'
          }}></span>
          <span style={{
            ...styles.menuIcon,
            transform: isMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none',
            transition: 'transform 0.2s ease'
          }}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        id="mobile-menu"
        style={{
          ...styles.mobileMenu,
          display: isMenuOpen ? 'flex' : 'none',
          maxHeight: isMenuOpen ? '300px' : '0',
          opacity: isMenuOpen ? 1 : 0,
          padding: isMenuOpen ? '1rem 2rem' : '0 2rem',
        }}
      >
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            style={styles.mobileLink}
            onClick={closeMenu}
          >
            {link.name}
          </a>
        ))}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    width: '100%',
    borderBottom: '1px solid #E2E8F0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative',
  },
  logo: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    zIndex: 1001,
  },
  logoLink: {
    color: '#0F172A',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '700',
    transition: 'color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  desktopMenu: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  navLink: {
    color: '#0F172A',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    padding: '0.5rem 0',
    position: 'relative',
  },
  menuButton: {
    display: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    zIndex: 1001,
    width: '40px',
    height: '40px',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  menuIcon: {
    display: 'block',
    width: '25px',
    height: '3px',
    backgroundColor: '#0F172A',
    margin: '3px 0',
    borderRadius: '2px',
    transition: 'all 0.3s ease',
  },
  mobileMenu: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid #E2E8F0',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1000,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  mobileLink: {
    color: '#0F172A',
    textDecoration: 'none',
    padding: '0.75rem 0',
    fontSize: '1rem',
    fontWeight: '500',
    borderBottom: '1px solid #F1F5F9',
    transition: 'all 0.2s ease',
    display: 'block',
    width: '100%',
  },

  // Pseudo-classes and responsive styles
  '@media (max-width: 768px)': {
    navContainer: {
      padding: '1rem',
    },
    desktopMenu: {
      display: 'none',
    },
    menuButton: {
      display: 'flex',
    },
    logoLink: {
      fontSize: '1rem',
    },
    mobileLink: {
      padding: '0.875rem 0',
      fontSize: '1rem',
      borderBottom: '1px solid #F1F5F9',
      '&:last-child': {
        borderBottom: 'none',
      },
    },
  },
  '@media (min-width: 769px)': {
    mobileMenu: {
      display: 'none !important',
    },
  },
};

// Inline styles for hover effects
const hoverStyles = {
  navLinkHover: {
    color: '#2563EB',
  },
  navLinkAfter: {
    content: '""',
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '0',
    height: '2px',
    backgroundColor: '#2563EB',
    transition: 'width 0.2s ease',
  },
  navLinkHoverAfter: {
    width: '100%',
  },
  mobileLinkHover: {
    color: '#2563EB',
    backgroundColor: '#F8FAFC',
    paddingLeft: '1rem',
  },
  logoLinkHover: {
    color: '#2563EB',
  },
  menuButtonHover: {
    backgroundColor: '#F8FAFC',
    borderRadius: '6px',
  },
};

// Helper function to combine styles
const combineStyles = (base, hover) => {
  return {
    ...base,
    ':hover': hover,
  };
};

