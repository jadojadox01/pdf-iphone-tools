import Navbar from './components/Navbar';
import tools from '@/lib/tools';

export default function Home() {
  // Get the main tools for homepage CTA
  const mainTools = tools.slice(0, 2);

  return (
    <div style={styles.container}>
      <main style={styles.main}>
        <div style={styles.hero}>
          <div style={styles.card}>
            <h1 style={styles.title}>
              Free PDF Converter for iPhone
            </h1>
            
            <p style={styles.subtitle}>
              Convert PDF to Word or JPG directly on your iPhone. No app needed.
            </p>
            
            <div style={styles.buttonContainer}>
              {mainTools.map((tool) => (
                <a
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  style={styles.button}
                >
                  {tool.icon} {tool.feature}
                </a>
              ))}
            </div>
            
            <div style={styles.features}>
              {tools.map((tool) => (
                <div key={tool.slug} style={styles.feature}>
                  <div style={styles.featureIcon}>{tool.icon}</div>
                  <h3 style={styles.featureTitle}>{tool.feature}</h3>
                  <p style={styles.featureText}>{tool.intro.split('.')[0]}.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <section style={styles.infoSection}>
          <h2 style={styles.sectionTitle}>All Available Tools</h2>
          <div style={styles.toolsGrid}>
            {tools.map((tool) => (
              <a
                key={tool.slug}
                href={`/${tool.slug}`}
                style={styles.toolCard}
              >
                <div style={styles.toolIcon}>{tool.icon}</div>
                <h3 style={styles.toolTitle}>{tool.h1}</h3>
                <p style={styles.toolDescription}>{tool.description}</p>
                <span style={styles.toolLink}>Use Tool →</span>
              </a>
            ))}
          </div>
        </section>
        
        <section style={styles.howItWorks}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <div style={styles.steps}>
            <div style={styles.step}>
              <div style={styles.stepNumber}>1</div>
              <h3 style={styles.stepTitle}>Upload PDF</h3>
              <p style={styles.stepText}>Select your PDF file from your iPhone</p>
            </div>
            
            <div style={styles.step}>
              <div style={styles.stepNumber}>2</div>
              <h3 style={styles.stepTitle}>Choose Format</h3>
              <p style={styles.stepText}>Select Word or JPG as your output format</p>
            </div>
            
            <div style={styles.step}>
              <div style={styles.stepNumber}>3</div>
              <h3 style={styles.stepTitle}>Download</h3>
              <p style={styles.stepText}>Get your converted file instantly</p>
            </div>
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    padding: '2rem',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '3rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    maxWidth: '1000px',
    width: '100%',
    textAlign: 'center',
    border: '1px solid #E2E8F0',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: '#0F172A',
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#64748B',
    marginBottom: '3rem',
    lineHeight: 1.6,
  },
  buttonContainer: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '3rem',
  },
  button: {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    textDecoration: 'none',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.2s, background-color 0.2s',
    minWidth: '220px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  },
  feature: {
    padding: '1.5rem',
    textAlign: 'center',
  },
  featureIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  featureTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#0F172A',
  },
  featureText: {
    fontSize: '1rem',
    color: '#64748B',
    lineHeight: 1.5,
  },
  infoSection: {
    padding: '4rem 2rem',
    backgroundColor: '#FFFFFF',
    marginTop: '2rem',
    borderTop: '1px solid #E2E8F0',
    borderBottom: '1px solid #E2E8F0',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '3rem',
    color: '#0F172A',
  },
  toolsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  toolCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: '12px',
    padding: '2rem',
    border: '1px solid #E2E8F0',
    textDecoration: 'none',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  toolIcon: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  toolTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
    color: '#0F172A',
  },
  toolDescription: {
    fontSize: '1rem',
    color: '#64748B',
    lineHeight: 1.5,
    marginBottom: '1.5rem',
  },
  toolLink: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  howItWorks: {
    padding: '4rem 2rem',
    backgroundColor: '#F8FAFC',
  },
  steps: {
    display: 'flex',
    justifyContent: 'center',
    gap: '3rem',
    flexWrap: 'wrap',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  step: {
    flex: 1,
    minWidth: '250px',
    textAlign: 'center',
  },
  stepNumber: {
    width: '50px',
    height: '50px',
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: '0 auto 1.5rem',
  },
  stepTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#0F172A',
  },
  stepText: {
    fontSize: '1rem',
    color: '#64748B',
    lineHeight: 1.6,
  },
  
  // Hover effects
  'button:hover': {
    backgroundColor: '#1D4ED8',
    transform: 'translateY(-2px)',
  },
  'toolCard:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(37, 99, 235, 0.1)',
  },
  'toolCard:hover .toolLink': {
    color: '#1D4ED8',
  },
  
  // Responsive styles
  '@media (max-width: 768px)': {
    hero: {
      padding: '1rem',
      minHeight: '70vh',
    },
    card: {
      padding: '2rem',
    },
    title: {
      fontSize: '2rem',
    },
    subtitle: {
      fontSize: '1.1rem',
    },
    button: {
      minWidth: '100%',
      padding: '0.875rem 1.5rem',
    },
    buttonContainer: {
      flexDirection: 'column',
    },
    features: {
      gridTemplateColumns: '1fr',
      gap: '1.5rem',
    },
    infoSection: {
      padding: '3rem 1rem',
    },
    toolsGrid: {
      gridTemplateColumns: '1fr',
    },
    steps: {
      flexDirection: 'column',
      gap: '2rem',
    },
  },
};