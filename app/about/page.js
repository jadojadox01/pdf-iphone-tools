import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#F8FAFC'
    }}>
      <main style={{ 
        flex: 1, 
        padding: '2rem', 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        marginTop: '2rem',
        marginBottom: '2rem',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        padding: '3rem'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '1rem',
          color: '#0F172A'
        }}>
          About Us
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          lineHeight: 1.6, 
          color: '#64748B',
          marginBottom: '1.5rem'
        }}>
          We provide free, easy-to-use online tools specifically designed for iPhone users.
          Our mission is to make file conversion and manipulation accessible to everyone.
        </p>
        <p style={{ 
          fontSize: '1.1rem', 
          lineHeight: 1.6, 
          color: '#64748B' 
        }}>
          All our tools work directly in your iPhone browser - no downloads or installations required.
          We prioritize security, speed, and ease of use in everything we build.
        </p>
      </main>
    </div>
  );
}