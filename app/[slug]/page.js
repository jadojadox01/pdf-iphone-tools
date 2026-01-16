import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import tools from '@/lib/tools';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return tools.map(tool => ({
    slug: tool.slug
  }));
}

export default async function ToolPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const tool = tools.find(t => t.slug === slug);

  if (!tool) {
    notFound();
  }

  const relatedTools = tools.filter(t => t.slug !== slug).slice(0, 3);

  return (
    <div style={styles.container}>      
      <main style={styles.main}>
        {/* Tool Hero Section */}
        <section style={styles.heroSection}>
          <div style={styles.heroContent}>
            <div style={styles.toolBadge}>
              <span style={styles.toolIcon}>{tool.icon}</span>
              <span style={styles.toolFeature}>{tool.feature}</span>
            </div>
            <h1 style={styles.heroTitle}>{tool.h1}</h1>
            <p style={styles.heroDescription}>{tool.intro}</p>
            <div style={styles.heroStats}>
              <div style={styles.stat}>
                <span style={styles.statNumber}>100%</span>
                <span style={styles.statLabel}>Free</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statIcon}>⚡</span>
                <span style={styles.statLabel}>Fast</span>
              </div>
              <div style={styles.stat}>
                <span style={styles.statIcon}>🔒</span>
                <span style={styles.statLabel}>Secure</span>
              </div>
            </div>
          </div>
        </section>

        {/* Converter Section */}
        <section style={styles.converterSection}>
          <div style={styles.converterCard}>
            <h2 style={styles.converterTitle}>Convert Your PDF</h2>
            <p style={styles.converterSubtitle}>Upload your PDF file and convert it instantly</p>
            
            {/* Upload Area */}
            <div style={styles.uploadArea}>
              <div style={styles.uploadBox}>
                <div style={styles.uploadIcon}>📄</div>
                <h3 style={styles.uploadTitle}>Drop PDF here or click to upload</h3>
                <p style={styles.uploadText}>Supports PDF files up to 50MB</p>
                <input 
                  type="file" 
                  accept="application/pdf" 
                  style={styles.fileInput}
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" style={styles.uploadButton}>
                  Choose PDF File
                </label>
                <p style={styles.uploadHint}>No files are stored on our servers</p>
              </div>
            </div>

            {/* Conversion Options */}
            <div style={styles.optionsSection}>
              <h3 style={styles.optionsTitle}>Conversion Settings</h3>
              <div style={styles.optionsGrid}>
                <div style={styles.optionCard}>
                  <div style={styles.optionIcon}>🎯</div>
                  <h4 style={styles.optionTitle}>Output Format</h4>
                  <div style={styles.optionValue}>
                    {tool.feature === 'Word Conversion' ? 'Microsoft Word (.docx)' : 'JPG Image (.jpg)'}
                  </div>
                </div>
                <div style={styles.optionCard}>
                  <div style={styles.optionIcon}>⚙️</div>
                  <h4 style={styles.optionTitle}>Quality</h4>
                  <div style={styles.optionValue}>High (Recommended)</div>
                </div>
                <div style={styles.optionCard}>
                  <div style={styles.optionIcon}>📱</div>
                  <h4 style={styles.optionTitle}>Device</h4>
                  <div style={styles.optionValue}>iPhone Optimized</div>
                </div>
              </div>
            </div>

            {/* Convert Button */}
            <div style={styles.convertButtonContainer}>
              <button style={styles.convertButton}>
                <span style={styles.convertIcon}>⚡</span>
                Convert Now
              </button>
              <p style={styles.convertNote}>Conversion starts immediately after upload</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section style={styles.howItWorksSection}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <div style={styles.steps}>
            <div style={styles.step}>
              <div style={styles.stepNumber}>1</div>
              <div style={styles.stepContent}>
                <h3 style={styles.stepTitle}>Upload PDF</h3>
                <p style={styles.stepText}>Select your PDF file from your iPhone. No size limits.</p>
              </div>
            </div>
            <div style={styles.step}>
              <div style={styles.stepNumber}>2</div>
              <div style={styles.stepContent}>
                <h3 style={styles.stepTitle}>Auto Conversion</h3>
                <p style={styles.stepText}>Our system automatically converts to your chosen format.</p>
              </div>
            </div>
            <div style={styles.step}>
              <div style={styles.stepNumber}>3</div>
              <div style={styles.stepContent}>
                <h3 style={styles.stepTitle}>Download</h3>
                <p style={styles.stepText}>Get your converted file instantly. No watermarks.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section style={styles.featuresSection}>
          <h2 style={styles.sectionTitle}>Why Use This Tool?</h2>
          <div style={styles.featuresGrid}>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>📱</div>
              <h3 style={styles.featureTitle}>iPhone Friendly</h3>
              <p style={styles.featureText}>Optimized for Safari on all iPhone models</p>
            </div>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>🔒</div>
              <h3 style={styles.featureTitle}>Privacy First</h3>
              <p style={styles.featureText}>Files deleted automatically after conversion</p>
            </div>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>⚡</div>
              <h3 style={styles.featureTitle}>Instant Results</h3>
              <p style={styles.featureText}>No waiting, conversions happen in seconds</p>
            </div>
            <div style={styles.feature}>
              <div style={styles.featureIcon}>🎯</div>
              <h3 style={styles.featureTitle}>High Quality</h3>
              <p style={styles.featureText}>Preserves original formatting and quality</p>
            </div>
          </div>
        </section>

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <section style={styles.relatedToolsSection}>
            <div style={styles.relatedHeader}>
              <h2 style={styles.sectionTitle}>You Might Also Need</h2>
              <a href="/tools" style={styles.viewAllLink}>View All Tools →</a>
            </div>
            <div style={styles.relatedGrid}>
              {relatedTools.map((relatedTool) => (
                <a
                  key={relatedTool.slug}
                  href={`/${relatedTool.slug}`}
                  style={styles.relatedCard}
                >
                  <div style={styles.relatedCardIcon}>{relatedTool.icon}</div>
                  <div style={styles.relatedCardContent}>
                    <h3 style={styles.relatedCardTitle}>{relatedTool.h1}</h3>
                    <p style={styles.relatedCardDescription}>{relatedTool.description}</p>
                    <span style={styles.relatedCardLink}>Try this tool →</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section style={styles.faqSection}>
          <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div style={styles.faqGrid}>
            <div style={styles.faqItem}>
              <h3 style={styles.faqQuestion}>Is this really free?</h3>
              <p style={styles.faqAnswer}>Yes, completely free. No hidden charges, no watermarks, no registration required.</p>
            </div>
            <div style={styles.faqItem}>
              <h3 style={styles.faqQuestion}>Do you store my files?</h3>
              <p style={styles.faqAnswer}>No. All files are deleted immediately after conversion for your privacy.</p>
            </div>
            <div style={styles.faqItem}>
              <h3 style={styles.faqQuestion}>What iPhone models are supported?</h3>
              <p style={styles.faqAnswer}>Works on all iPhone models running iOS 12 or later with Safari browser.</p>
            </div>
            <div style={styles.faqItem}>
              <h3 style={styles.faqQuestion}>Is an app required?</h3>
              <p style={styles.faqAnswer}>No app needed. Works directly in Safari browser on your iPhone.</p>
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
  
  // Hero Section
  heroSection: {
    padding: '4rem 2rem',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E2E8F0',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
  toolBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#EFF6FF',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    marginBottom: '1.5rem',
  },
  toolIcon: {
    fontSize: '1.25rem',
  },
  toolFeature: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: '0.875rem',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: '1rem',
    lineHeight: 1.2,
  },
  heroDescription: {
    fontSize: '1.25rem',
    color: '#64748B',
    lineHeight: 1.6,
    marginBottom: '2rem',
    maxWidth: '600px',
    margin: '0 auto 2rem',
  },
  heroStats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '3rem',
    marginTop: '2rem',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2563EB',
  },
  statIcon: {
    fontSize: '1.5rem',
    marginBottom: '0.25rem',
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#64748B',
    marginTop: '0.25rem',
  },
  
  // Converter Section
  converterSection: {
    padding: '4rem 2rem',
    backgroundColor: '#F8FAFC',
  },
  converterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '3rem',
    boxShadow: '0 4px 25px rgba(0, 0, 0, 0.08)',
    maxWidth: '900px',
    margin: '0 auto',
    border: '1px solid #E2E8F0',
  },
  converterTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  converterSubtitle: {
    fontSize: '1.125rem',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: '3rem',
  },
  
  // Upload Area
  uploadArea: {
    marginBottom: '3rem',
  },
  uploadBox: {
    backgroundColor: '#F8FAFC',
    border: '2px dashed #CBD5E1',
    borderRadius: '12px',
    padding: '3rem 2rem',
    textAlign: 'center',
    transition: 'border-color 0.2s',
  },
  uploadIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  uploadTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '0.5rem',
  },
  uploadText: {
    fontSize: '1rem',
    color: '#64748B',
    marginBottom: '1.5rem',
  },
  fileInput: {
    display: 'none',
  },
  uploadButton: {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-block',
    transition: 'background-color 0.2s',
  },
  uploadHint: {
    fontSize: '0.875rem',
    color: '#94A3B8',
    marginTop: '1rem',
  },
  
  // Options Section
  optionsSection: {
    marginBottom: '3rem',
  },
  optionsTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '1.5rem',
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  optionCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid #E2E8F0',
  },
  optionIcon: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  optionTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '0.5rem',
  },
  optionValue: {
    fontSize: '1rem',
    color: '#2563EB',
    fontWeight: '500',
  },
  
  // Convert Button
  convertButtonContainer: {
    textAlign: 'center',
  },
  convertButton: {
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    padding: '1rem 3rem',
    fontSize: '1.25rem',
    fontWeight: '600',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'background-color 0.2s, transform 0.2s',
  },
  convertIcon: {
    fontSize: '1.5rem',
  },
  convertNote: {
    fontSize: '0.875rem',
    color: '#64748B',
    marginTop: '1rem',
  },
  
  // How It Works
  howItWorksSection: {
    padding: '4rem 2rem',
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid #E2E8F0',
    borderBottom: '1px solid #E2E8F0',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: '3rem',
  },
  steps: {
    display: 'flex',
    justifyContent: 'center',
    gap: '3rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  step: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1.5rem',
  },
  stepNumber: {
    width: '48px',
    height: '48px',
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '0.5rem',
  },
  stepText: {
    fontSize: '1rem',
    color: '#64748B',
    lineHeight: 1.6,
  },
  
  // Features
  featuresSection: {
    padding: '4rem 2rem',
    backgroundColor: '#F8FAFC',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  feature: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '2rem',
    textAlign: 'center',
    border: '1px solid #E2E8F0',
  },
  featureIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
  },
  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '0.5rem',
  },
  featureText: {
    fontSize: '1rem',
    color: '#64748B',
    lineHeight: 1.5,
  },
  
  // Related Tools
  relatedToolsSection: {
    padding: '4rem 2rem',
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid #E2E8F0',
  },
  relatedHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    maxWidth: '1000px',
    margin: '0 auto 2rem',
  },
  viewAllLink: {
    color: '#2563EB',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
  },
  relatedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  relatedCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid #E2E8F0',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  relatedCardIcon: {
    fontSize: '2rem',
    backgroundColor: '#EFF6FF',
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  relatedCardContent: {
    flex: 1,
  },
  relatedCardTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '0.5rem',
  },
  relatedCardDescription: {
    fontSize: '0.875rem',
    color: '#64748B',
    lineHeight: 1.5,
    marginBottom: '1rem',
  },
  relatedCardLink: {
    color: '#2563EB',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  
  // FAQ
  faqSection: {
    padding: '4rem 2rem',
    backgroundColor: '#F8FAFC',
    borderTop: '1px solid #E2E8F0',
  },
  faqGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid #E2E8F0',
  },
  faqQuestion: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '0.75rem',
  },
  faqAnswer: {
    fontSize: '1rem',
    color: '#64748B',
    lineHeight: 1.6,
  },
  
  // Hover Effects
  'uploadButton:hover': {
    backgroundColor: '#1D4ED8',
  },
  'convertButton:hover': {
    backgroundColor: '#0EA271',
    transform: 'translateY(-2px)',
  },
  'relatedCard:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(37, 99, 235, 0.1)',
  },
  'viewAllLink:hover': {
    color: '#1D4ED8',
  },
  'uploadBox:hover': {
    borderColor: '#2563EB',
  },
  
  // Responsive Styles
  '@media (max-width: 768px)': {
    heroSection: {
      padding: '3rem 1rem',
    },
    heroTitle: {
      fontSize: '2.25rem',
    },
    heroDescription: {
      fontSize: '1.125rem',
    },
    heroStats: {
      flexDirection: 'column',
      gap: '1.5rem',
    },
    converterSection: {
      padding: '3rem 1rem',
    },
    converterCard: {
      padding: '2rem',
    },
    converterTitle: {
      fontSize: '1.75rem',
    },
    steps: {
      flexDirection: 'column',
      gap: '2rem',
    },
    step: {
      flexDirection: 'column',
      textAlign: 'center',
      alignItems: 'center',
    },
    stepNumber: {
      marginBottom: '1rem',
    },
    howItWorksSection: {
      padding: '3rem 1rem',
    },
    featuresSection: {
      padding: '3rem 1rem',
    },
    featuresGrid: {
      gridTemplateColumns: '1fr',
    },
    relatedToolsSection: {
      padding: '3rem 1rem',
    },
    relatedHeader: {
      flexDirection: 'column',
      textAlign: 'center',
      gap: '1rem',
    },
    relatedGrid: {
      gridTemplateColumns: '1fr',
    },
    faqSection: {
      padding: '3rem 1rem',
    },
    faqGrid: {
      gridTemplateColumns: '1fr',
    },
    sectionTitle: {
      fontSize: '2rem',
    },
    optionsGrid: {
      gridTemplateColumns: '1fr',
    },
    uploadBox: {
      padding: '2rem 1rem',
    },
    convertButton: {
      width: '100%',
      justifyContent: 'center',
    },
  },
};