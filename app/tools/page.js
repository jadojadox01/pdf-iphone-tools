import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import tools from '@/lib/tools';
export default function ToolsPage() {
  // Group tools by category or feature
  const pdfTools = tools.filter(tool => tool.slug.includes('pdf'));
  const conversionTools = tools.filter(tool => 
    tool.feature.includes('Conversion') || tool.feature.includes('Image')
  );
  const allTools = [...new Set([...pdfTools, ...conversionTools])];

  return (
    <div style={styles.container}>
      
      <main style={styles.main}>
        <div style={styles.hero}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>All Free iPhone Tools</h1>
            <p style={styles.heroSubtitle}>
              Discover our collection of free online tools designed specifically for iPhone users.
              No downloads, no installations – everything works directly in Safari.
            </p>
          </div>
        </div>

        <section style={styles.toolsSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>PDF Conversion Tools</h2>
            <p style={styles.sectionDescription}>
              Convert PDF files to various formats directly on your iPhone
            </p>
          </div>

          <div style={styles.toolsGrid}>
            {pdfTools.map((tool) => (
              <div key={tool.slug} style={styles.toolCard}>
                <div style={styles.toolCardHeader}>
                  <div style={styles.toolIcon}>{tool.icon}</div>
                  <div>
                    <h3 style={styles.toolTitle}>{tool.h1}</h3>
                    <span style={styles.toolCategory}>PDF Tool</span>
                  </div>
                </div>
                <p style={styles.toolDescription}>{tool.description}</p>
                <div style={styles.toolFeatures}>
                  <span style={styles.featureTag}>Free</span>
                  <span style={styles.featureTag}>No Signup</span>
                  <span style={styles.featureTag}>iPhone Optimized</span>
                </div>
                <a href={`/${tool.slug}`} style={styles.toolButton}>
                  Use Tool
                </a>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.browserToolsSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Browser-Based Tools</h2>
            <p style={styles.sectionDescription}>
              Tools that work directly in your iPhone browser – no apps required
            </p>
          </div>

          <div style={styles.toolsGrid}>
            {tools.map((tool) => (
              <div key={tool.slug} style={styles.toolCard}>
                <div style={styles.toolCardHeader}>
                  <div style={styles.toolIcon}>{tool.icon}</div>
                  <div>
                    <h3 style={styles.toolTitle}>{tool.h1}</h3>
                    <span style={styles.toolCategory}>{tool.feature}</span>
                  </div>
                </div>
                <p style={styles.toolDescription}>{tool.description}</p>
                <div style={styles.toolFeatures}>
                  <span style={styles.featureTag}>Browser-Based</span>
                  <span style={styles.featureTag}>Secure</span>
                  <span style={styles.featureTag}>Fast</span>
                </div>
                <a href={`/${tool.slug}`} style={styles.toolButton}>
                  Use Tool
                </a>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.featuresSection}>
          <h2 style={styles.featuresTitle}>Why Choose Our iPhone Tools?</h2>
          <div style={styles.featuresGrid}>
            <div style={styles.featureItem}>
              <div style={styles.featureIcon}>📱</div>
              <h3 style={styles.featureItemTitle}>iPhone Optimized</h3>
              <p style={styles.featureItemText}>
                Every tool is designed specifically for iPhone screens and Safari browser
              </p>
            </div>
            
            <div style={styles.featureItem}>
              <div style={styles.featureIcon}>🔒</div>
              <h3 style={styles.featureItemTitle}>100% Secure</h3>
              <p style={styles.featureItemText}>
                Your files are processed securely and deleted automatically
              </p>
            </div>
            
            <div style={styles.featureItem}>
              <div style={styles.featureIcon}>🎯</div>
              <h3 style={styles.featureItemTitle}>No Installation</h3>
              <p style={styles.featureItemText}>
                Use tools directly in Safari - no app downloads required
              </p>
            </div>
            
            <div style={styles.featureItem}>
              <div style={styles.featureIcon}>⚡</div>
              <h3 style={styles.featureItemTitle}>Fast Processing</h3>
              <p style={styles.featureItemText}>
                Quick conversions and processing times for all tools
              </p>
            </div>
          </div>
        </section>

        <section style={styles.ctaSection}>
          <div style={styles.ctaCard}>
            <h2 style={styles.ctaTitle}>Need a Different Tool?</h2>
            <p style={styles.ctaText}>
              We're constantly adding new tools for iPhone users. 
              Have a suggestion for a tool you'd like to see?
            </p>
            <a href="/contact" style={styles.ctaButton}>
              Suggest a Tool
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#F8FAFC',
  },
  main: {
    flex: 1,
    width: '100%',
  },
  hero: {
    padding: '4rem 2rem',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    borderBottom: '1px solid #E2E8F0',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: '1rem',
    lineHeight: 1.2,
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: '#64748B',
    lineHeight: 1.6,
    maxWidth: '600px',
    margin: '0 auto',
  },
  toolsSection: {
    padding: '4rem 2rem',
    backgroundColor: '#FFFFFF',
  },
  browserToolsSection: {
    padding: '4rem 2rem',
    backgroundColor: '#F8FAFC',
    borderTop: '1px solid #E2E8F0',
    borderBottom: '1px solid #E2E8F0',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: '1rem',
  },
  sectionDescription: {
    fontSize: '1.25rem',
    color: '#64748B',
    maxWidth: '600px',
    margin: '0 auto',
  },
  toolsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  toolCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '2rem',
    border: '1px solid #E2E8F0',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
  },
  toolCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  toolIcon: {
    fontSize: '2.5rem',
    minWidth: '60px',
    height: '60px',
    backgroundColor: '#EFF6FF',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '0.25rem',
  },
  toolCategory: {
    fontSize: '0.875rem',
    color: '#2563EB',
    fontWeight: '500',
    backgroundColor: '#EFF6FF',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
  },
  toolDescription: {
    fontSize: '1rem',
    color: '#64748B',
    lineHeight: 1.6,
    marginBottom: '1.5rem',
    flex: 1,
  },
  toolFeatures: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  featureTag: {
    fontSize: '0.75rem',
    color: '#475569',
    backgroundColor: '#F1F5F9',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontWeight: '500',
  },
  toolButton: {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    textDecoration: 'none',
    borderRadius: '8px',
    textAlign: 'center',
    transition: 'background-color 0.2s',
  },
  featuresSection: {
    padding: '4rem 2rem',
    backgroundColor: '#FFFFFF',
  },
  featuresTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: '3rem',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featureItem: {
    textAlign: 'center',
    padding: '2rem',
    borderRadius: '12px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
  },
  featureIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  featureItemTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '0.5rem',
  },
  featureItemText: {
    fontSize: '1rem',
    color: '#64748B',
    lineHeight: 1.6,
  },
  ctaSection: {
    padding: '4rem 2rem',
    backgroundColor: '#F8FAFC',
    borderTop: '1px solid #E2E8F0',
  },
  ctaCard: {
    backgroundColor: '#2563EB',
    borderRadius: '12px',
    padding: '4rem',
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto',
  },
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: '1rem',
  },
  ctaText: {
    fontSize: '1.25rem',
    color: '#E2E8F0',
    lineHeight: 1.6,
    marginBottom: '2rem',
    maxWidth: '600px',
    margin: '0 auto',
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    color: '#2563EB',
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    textDecoration: 'none',
    borderRadius: '8px',
    display: 'inline-block',
    transition: 'transform 0.2s',
  },

  // Hover effects
  'toolCard:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(37, 99, 235, 0.1)',
  },
  'toolButton:hover': {
    backgroundColor: '#1D4ED8',
  },
  'ctaButton:hover': {
    transform: 'translateY(-2px)',
    backgroundColor: '#F8FAFC',
  },

  // Responsive styles
  '@media (max-width: 768px)': {
    hero: {
      padding: '3rem 1rem',
    },
    heroTitle: {
      fontSize: '2.25rem',
    },
    heroSubtitle: {
      fontSize: '1.1rem',
    },
    toolsSection: {
      padding: '3rem 1rem',
    },
    browserToolsSection: {
      padding: '3rem 1rem',
    },
    sectionTitle: {
      fontSize: '2rem',
    },
    sectionDescription: {
      fontSize: '1.1rem',
    },
    toolsGrid: {
      gridTemplateColumns: '1fr',
    },
    featuresSection: {
      padding: '3rem 1rem',
    },
    featuresTitle: {
      fontSize: '2rem',
    },
    featuresGrid: {
      gridTemplateColumns: '1fr',
    },
    ctaSection: {
      padding: '3rem 1rem',
    },
    ctaCard: {
      padding: '2rem',
    },
    ctaTitle: {
      fontSize: '2rem',
    },
    ctaText: {
      fontSize: '1.1rem',
    },
    toolCardHeader: {
      flexDirection: 'column',
      textAlign: 'center',
      gap: '0.75rem',
    },
    toolIcon: {
      margin: '0 auto',
    },
  },
};

