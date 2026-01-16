import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function TermsOfService() {
  return (
    <div style={styles.container}>      
      <main style={styles.main}>
        <div style={styles.hero}>
          <div style={styles.heroContent}>
            <h1 style={styles.title}>Terms of Service</h1>
            <p style={styles.subtitle}>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        <div style={styles.content}>
          <section style={styles.section}>
            <p style={styles.intro}>
              Welcome to Free PDF iPhone Tools. By accessing or using our website and services, 
              you agree to be bound by these Terms of Service. Please read them carefully.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>1. Acceptance of Terms</h2>
            <p style={styles.paragraph}>
              By accessing and using Free PDF iPhone Tools ("Service"), you accept and agree to 
              be bound by the terms and provision of this agreement. If you do not agree to 
              abide by these terms, please do not use this Service.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>2. Description of Service</h2>
            <p style={styles.paragraph}>
              Free PDF iPhone Tools provides free online tools for converting PDF files to various 
              formats, specifically optimized for iPhone users. Our services include:
            </p>
            
            <div style={styles.listContainer}>
              <ul>
                {[
                  'PDF to Word conversion',
                  'PDF to JPG conversion',
                  'Browser-based tools for iPhone users',
                  'Other file conversion and manipulation tools'
                ].map((item, index) => (
                  <li key={index} style={styles.listItem}>
                    <span style={styles.bullet}>•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>3. User Responsibilities</h2>
            <p style={styles.paragraph}>
              As a user of our Service, you agree to:
            </p>
            
            <div style={styles.listContainer}>
              <ul>
                {[
                  'Use the Service only for lawful purposes',
                  'Not upload malicious files or viruses',
                  'Not attempt to disrupt or interfere with the Service',
                  'Comply with all applicable laws and regulations',
                  'Respect the intellectual property rights of others'
                ].map((item, index) => (
                  <li key={index} style={styles.listItem}>
                    <span style={styles.bullet}>•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>4. Intellectual Property</h2>
            <p style={styles.paragraph}>
              The Service and its original content, features, and functionality are owned by 
              Free PDF iPhone Tools and are protected by international copyright, trademark, 
              patent, trade secret, and other intellectual property laws.
            </p>
            
            <p style={styles.paragraph}>
              You retain all rights to the files you upload and convert through our Service. 
              We do not claim ownership over your original files or converted outputs.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>5. Disclaimer of Warranties</h2>
            <p style={styles.paragraph}>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Free PDF iPhone 
              Tools expressly disclaims all warranties of any kind, whether express or implied, 
              including, but not limited to the implied warranties of merchantability, fitness 
              for a particular purpose, and non-infringement.
            </p>
            
            <div style={styles.warningBox}>
              <p style={styles.warningText}>
                <strong>Important:</strong> We do not guarantee that:
              </p>
              <ul>
                {[
                  'The Service will meet your specific requirements',
                  'The Service will be uninterrupted, timely, or error-free',
                  'The results from using the Service will be accurate or reliable',
                  'Any errors in the Service will be corrected'
                ].map((item, index) => (
                  <li key={index} style={styles.warningItem}>
                    <span style={styles.warningIcon}>⚠</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>6. Limitation of Liability</h2>
            <p style={styles.paragraph}>
              Free PDF iPhone Tools shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages, including without limitation, loss of profits, 
              data, use, goodwill, or other intangible losses, resulting from:
            </p>
            
            <div style={styles.listContainer}>
              <ul>
                {[
                  'Your use or inability to use the Service',
                  'Any unauthorized access to or use of our servers',
                  'Any interruption or cessation of transmission to or from the Service',
                  'Any bugs, viruses, or similar that may be transmitted through the Service',
                  'Any errors or omissions in any content or for any loss or damage incurred'
                ].map((item, index) => (
                  <li key={index} style={styles.listItem}>
                    <span style={styles.bullet}>•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>7. Service Modifications</h2>
            <p style={styles.paragraph}>
              We reserve the right to modify or discontinue, temporarily or permanently, the 
              Service (or any part thereof) with or without notice. We shall not be liable 
              to you or to any third party for any modification, suspension, or discontinuance 
              of the Service.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>8. Governing Law</h2>
            <p style={styles.paragraph}>
              These Terms shall be governed and construed in accordance with the laws of the 
              United States, without regard to its conflict of law provisions. Our failure to 
              enforce any right or provision of these Terms will not be considered a waiver 
              of those rights.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>9. Changes to Terms</h2>
            <p style={styles.paragraph}>
              We reserve the right, at our sole discretion, to modify or replace these Terms 
              at any time. If a revision is material, we will try to provide at least 30 days' 
              notice prior to any new terms taking effect. What constitutes a material change 
              will be determined at our sole discretion.
            </p>
            
            <p style={styles.paragraph}>
              By continuing to access or use our Service after those revisions become effective, 
              you agree to be bound by the revised terms.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>10. Contact Information</h2>
            <p style={styles.paragraph}>
              If you have any questions about these Terms, please contact us:
            </p>
            
            <div style={styles.contactInfo}>
              <p style={styles.contactText}>
                <strong>Email:</strong> legal@freepdfiphonetools.com
              </p>
              <p style={styles.contactText}>
                <strong>Website:</strong> freepdfiphonetools.com
              </p>
            </div>
          </section>

          <div style={styles.noticeBox}>
            <p style={styles.noticeText}>
              <strong>Important Notice:</strong> These tools are provided for personal, non-commercial use. 
              For commercial use or large-scale conversions, please contact us for appropriate licensing.
            </p>
          </div>
        </div>
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
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: '0.5rem',
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#64748B',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '4rem 2rem',
  },
  section: {
    marginBottom: '3rem',
  },
  intro: {
    fontSize: '1.25rem',
    color: '#475569',
    lineHeight: 1.7,
    fontStyle: 'italic',
    padding: '1.5rem',
    backgroundColor: '#F0F9FF',
    borderRadius: '8px',
    borderLeft: '4px solid #2563EB',
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #E2E8F0',
  },
  paragraph: {
    fontSize: '1.125rem',
    color: '#475569',
    lineHeight: 1.7,
    marginBottom: '1.5rem',
  },
  listContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '2rem',
    border: '1px solid #E2E8F0',
  },
  listItem: {
    fontSize: '1.125rem',
    color: '#475569',
    lineHeight: 1.7,
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'flex-start',
  },
  bullet: {
    color: '#2563EB',
    fontWeight: 'bold',
    marginRight: '0.75rem',
    flexShrink: 0,
  },
  warningBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: '8px',
    padding: '1.5rem',
    border: '1px solid #FECACA',
    marginBottom: '2rem',
  },
  warningText: {
    fontSize: '1.125rem',
    color: '#DC2626',
    lineHeight: 1.7,
    marginBottom: '1rem',
  },
  warningItem: {
    fontSize: '1.125rem',
    color: '#7F1D1D',
    lineHeight: 1.7,
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'flex-start',
  },
  warningIcon: {
    color: '#DC2626',
    fontWeight: 'bold',
    marginRight: '0.75rem',
    flexShrink: 0,
  },
  contactInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    padding: '1.5rem',
    border: '1px solid #E2E8F0',
  },
  contactText: {
    fontSize: '1.125rem',
    color: '#475569',
    lineHeight: 1.7,
    marginBottom: '0.75rem',
  },
  noticeBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: '8px',
    padding: '1.5rem',
    border: '1px solid #FDE68A',
    marginTop: '3rem',
  },
  noticeText: {
    fontSize: '1.125rem',
    color: '#92400E',
    lineHeight: 1.7,
    textAlign: 'center',
  },
};