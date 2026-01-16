import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div style={styles.container}>
      
      <main style={styles.main}>
        <div style={styles.hero}>
          <div style={styles.heroContent}>
            <h1 style={styles.title}>Privacy Policy</h1>
            <p style={styles.subtitle}>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        <div style={styles.content}>
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>1. Information We Collect</h2>
            <p style={styles.paragraph}>
              At Free PDF iPhone Tools, we are committed to protecting your privacy. Our services are designed to be 
              used without collecting personal information. Here's what we do and don't collect:
            </p>
            
            <div style={styles.listContainer}>
              <h3 style={styles.listTitle}>We DO NOT collect:</h3>
              <ul>
                {[
                  'Personal identification information (name, email, phone number)',
                  'Location data or IP addresses',
                  'Payment information (our services are completely free)',
                  'Contact lists or address book information',
                  'Any information that can identify you personally'
                ].map((item, index) => (
                  <li key={index} style={styles.listItem}>
                    <span style={styles.bullet}>•</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div style={styles.listContainer}>
              <h3 style={styles.listTitle}>We DO collect (anonymous):</h3>
              <ul>
                {[
                  'Aggregate usage statistics (tool usage counts)',
                  'Browser type and version (for compatibility)',
                  'Device type (iPhone model information)',
                  'Conversion success/failure rates (to improve services)'
                ].map((item, index) => (
                  <li key={index} style={styles.listItem}>
                    <span style={styles.bullet}>•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>2. File Processing and Storage</h2>
            <p style={styles.paragraph}>
              Your privacy is our top priority when you use our conversion tools:
            </p>
            
            <div style={styles.listContainer}>
              <h3 style={styles.listTitle}>For uploaded files:</h3>
              <ul>
                {[
                  'Files are processed in temporary memory only',
                  'No files are permanently stored on our servers',
                  'Files are automatically deleted after conversion',
                  'We do not access or view the content of your files',
                  'Conversion happens locally when possible'
                ].map((item, index) => (
                  <li key={index} style={styles.listItem}>
                    <span style={styles.bullet}>•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>3. Third-Party Services</h2>
            <p style={styles.paragraph}>
              We use minimal third-party services to operate our website:
            </p>
            
            <div style={styles.listContainer}>
              <ul>
                {[
                  'Hosting Provider: Anonymous server logs for security and maintenance',
                  'Analytics: Anonymous usage statistics to improve our services',
                  'No Advertising: We do not use advertising networks or trackers'
                ].map((item, index) => (
                  <li key={index} style={styles.listItem}>
                    <span style={styles.bullet}>•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>4. Cookies and Tracking</h2>
            <p style={styles.paragraph}>
              We use minimal cookies to provide essential functionality:
            </p>
            
            <div style={styles.listContainer}>
              <ul>
                {[
                  'Essential Cookies: Required for basic website functionality',
                  'No Tracking Cookies: We do not use cookies for tracking or advertising',
                  'Session-Based: Cookies expire when you close your browser'
                ].map((item, index) => (
                  <li key={index} style={styles.listItem}>
                    <span style={styles.bullet}>•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>5. Children's Privacy</h2>
            <p style={styles.paragraph}>
              Our services are not directed to individuals under the age of 13. We do not knowingly 
              collect personal information from children under 13. If you are a parent or guardian 
              and you believe your child has provided us with personal information, please contact 
              us so we can delete such information.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>6. Security</h2>
            <p style={styles.paragraph}>
              We implement security measures designed to protect your information:
            </p>
            
            <div style={styles.listContainer}>
              <ul>
                {[
                  'HTTPS encryption for all data transmission',
                  'Secure file processing environment',
                  'Regular security updates and monitoring',
                  'Automatic file deletion after processing'
                ].map((item, index) => (
                  <li key={index} style={styles.listItem}>
                    <span style={styles.bullet}>•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>7. Changes to This Policy</h2>
            <p style={styles.paragraph}>
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last Updated" date. 
              You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>8. Contact Us</h2>
            <p style={styles.paragraph}>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            
            <div style={styles.contactInfo}>
              <p style={styles.contactText}>
                <strong>Email:</strong> privacy@freepdfiphonetools.com
              </p>
              <p style={styles.contactText}>
                <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </section>
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
  listTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '1rem',
  },
  listItem: {
    fontSize: '1.125rem',
    color: '#475569',
    lineHeight: 1.7,
    marginBottom: '0.75rem',
    paddingLeft: '0.5rem',
    display: 'flex',
    alignItems: 'flex-start',
  },
  bullet: {
    color: '#2563EB',
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
};