import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ContactPage() {
  return (
    <div style={styles.container}>
      
      <main style={styles.main}>
        <div style={styles.hero}>
          <div style={styles.heroContent}>
            <h1 style={styles.title}>Contact Us</h1>
            <p style={styles.subtitle}>
              Have questions, suggestions, or need support? We're here to help.
            </p>
          </div>
        </div>

        <div style={styles.content}>
          <div style={styles.grid}>
            <div style={styles.formSection}>
              <h2 style={styles.sectionTitle}>Send us a Message</h2>
              <form style={styles.form}>
                <div style={styles.formGroup}>
                  <label htmlFor="name" style={styles.label}>Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    style={styles.input}
                    placeholder="Enter your name"
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label htmlFor="email" style={styles.label}>Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    style={styles.input}
                    placeholder="Enter your email"
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label htmlFor="subject" style={styles.label}>Subject</label>
                  <select id="subject" style={styles.select}>
                    <option value="">Select a topic</option>
                    <option value="support">Technical Support</option>
                    <option value="suggestion">Tool Suggestion</option>
                    <option value="privacy">Privacy Question</option>
                    <option value="business">Business Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label htmlFor="message" style={styles.label}>Message</label>
                  <textarea 
                    id="message" 
                    rows="6" 
                    style={styles.textarea}
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                <button type="submit" style={styles.submitButton}>
                  Send Message
                </button>
              </form>
            </div>

            <div style={styles.infoSection}>
              <h2 style={styles.sectionTitle}>Get in Touch</h2>
              
              <div style={styles.contactInfo}>
                <div style={styles.contactItem}>
                  <div style={styles.contactIcon}>📧</div>
                  <div>
                    <h3 style={styles.contactTitle}>Email</h3>
                    <p style={styles.contactText}>support@freepdfiphonetools.com</p>
                    <p style={styles.contactSubtext}>Response within 24 hours</p>
                  </div>
                </div>
                
                <div style={styles.contactItem}>
                  <div style={styles.contactIcon}>🔧</div>
                  <div>
                    <h3 style={styles.contactTitle}>Technical Support</h3>
                    <p style={styles.contactText}>help@freepdfiphonetools.com</p>
                    <p style={styles.contactSubtext}>For tool-related issues</p>
                  </div>
                </div>
                
                <div style={styles.contactItem}>
                  <div style={styles.contactIcon}>💡</div>
                  <div>
                    <h3 style={styles.contactTitle}>Suggestions</h3>
                    <p style={styles.contactText}>ideas@freepdfiphonetools.com</p>
                    <p style={styles.contactSubtext}>New tool ideas welcome</p>
                  </div>
                </div>
              </div>

              <div style={styles.faqSection}>
                <h3 style={styles.faqTitle}>Frequently Asked</h3>
                <div style={styles.faqItem}>
                  <h4 style={styles.faqQuestion}>How long does file conversion take?</h4>
                  <p style={styles.faqAnswer}>Most conversions complete in under 30 seconds.</p>
                </div>
                <div style={styles.faqItem}>
                  <h4 style={styles.faqQuestion}>Are my files secure?</h4>
                  <p style={styles.faqAnswer}>Yes, files are deleted immediately after processing.</p>
                </div>
                <div style={styles.faqItem}>
                  <h4 style={styles.faqQuestion}>Do you offer paid services?</h4>
                  <p style={styles.faqAnswer}>All tools are completely free with no hidden costs.</p>
                </div>
              </div>
            </div>
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
    fontSize: '1.25rem',
    color: '#64748B',
    maxWidth: '600px',
    margin: '0 auto',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '4rem 2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '4rem',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '2rem',
    border: '1px solid #E2E8F0',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '2rem',
    border: '1px solid #E2E8F0',
  },
  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#0F172A',
  },
  input: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    transition: 'border-color 0.2s',
  },
  select: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    transition: 'border-color 0.2s',
  },
  textarea: {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    transition: 'border-color 0.2s',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    padding: '1rem 2rem',
    fontSize: '1.125rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '1rem',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#F8FAFC',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
  },
  contactIcon: {
    fontSize: '2rem',
    flexShrink: 0,
  },
  contactTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '0.25rem',
  },
  contactText: {
    fontSize: '1rem',
    color: '#2563EB',
    fontWeight: '500',
    marginBottom: '0.25rem',
  },
  contactSubtext: {
    fontSize: '0.875rem',
    color: '#64748B',
  },
  faqSection: {
    marginTop: '2rem',
  },
  faqTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '1.5rem',
  },
  faqItem: {
    marginBottom: '1.5rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #E2E8F0',
  },
  faqQuestion: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '0.5rem',
  },
  faqAnswer: {
    fontSize: '1rem',
    color: '#64748B',
    lineHeight: 1.6,
  },

  // Hover effects
  'input:hover': {
    borderColor: '#2563EB',
  },
  'select:hover': {
    borderColor: '#2563EB',
  },
  'textarea:hover': {
    borderColor: '#2563EB',
  },
  'submitButton:hover': {
    backgroundColor: '#1D4ED8',
  },

  // Responsive styles
  '@media (max-width: 768px)': {
    hero: {
      padding: '3rem 1rem',
    },
    title: {
      fontSize: '2.25rem',
    },
    subtitle: {
      fontSize: '1.125rem',
    },
    content: {
      padding: '3rem 1rem',
    },
    grid: {
      gridTemplateColumns: '1fr',
      gap: '2rem',
    },
    sectionTitle: {
      fontSize: '1.5rem',
    },
    contactItem: {
      flexDirection: 'column',
      textAlign: 'center',
      alignItems: 'center',
    },
    contactIcon: {
      marginBottom: '0.5rem',
    },
  },
};