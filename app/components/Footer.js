export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.copyright}>
          © {currentYear} Free PDF iPhone Tools
        </p>
        <div style={styles.links}>
          {footerLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              style={styles.link}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#FFFFFF',
    color: '#0F172A',
    padding: '2rem 0',
    marginTop: 'auto',
    borderTop: '1px solid #E2E8F0',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    textAlign: 'center',
  },
  copyright: {
    fontSize: '1rem',
    marginBottom: '1rem',
    color: '#64748B',
  },
  links: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  link: {
    color: '#64748B',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.2s',
  },
  
  // Hover effects
  'link:hover': {
    color: '#2563EB',
  },
};