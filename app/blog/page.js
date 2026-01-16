import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { blogPosts, categories, popularTags } from '@/lib/blog';

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const recentPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={styles.container}>
      
      <main style={styles.main}>
        {/* Hero Section */}
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>PDF Tools Blog</h1>
            <p style={styles.heroSubtitle}>
              Expert guides, tutorials, and insights for iPhone users working with PDFs.
              Stay updated with the latest tools, tips, and techniques.
            </p>
            <div style={styles.searchBox}>
              <input 
                type="text" 
                placeholder="Search articles..." 
                style={styles.searchInput}
              />
              <button style={styles.searchButton}>Search</button>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section style={styles.featuredSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Featured Articles</h2>
            <p style={styles.sectionDescription}>Must-read guides and tutorials</p>
          </div>
          
          <div style={styles.featuredGrid}>
            {featuredPosts.map((post) => (
              <a key={post.id} href={`/blog/${post.slug}`} style={styles.featuredCard}>
                <div style={styles.featuredImage}>
                  <div style={styles.imagePlaceholder}>
                    {post.title.charAt(0)}
                  </div>
                </div>
                <div style={styles.featuredContent}>
                  <span style={styles.categoryBadge}>{post.category}</span>
                  <h3 style={styles.featuredTitle}>{post.title}</h3>
                  <p style={styles.featuredExcerpt}>{post.excerpt}</p>
                  <div style={styles.postMeta}>
                    <span style={styles.author}>{post.author}</span>
                    <span style={styles.date}>{post.date}</span>
                    <span style={styles.readTime}>{post.readTime}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <div style={styles.contentGrid}>
          {/* Main Content */}
          <div style={styles.mainContent}>
            {/* Recent Posts */}
            <section style={styles.recentSection}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Recent Articles</h2>
              </div>
              
              <div style={styles.postsGrid}>
                {recentPosts.map((post) => (
                  <article key={post.id} style={styles.postCard}>
                    <a href={`/blog/${post.slug}`} style={styles.postLink}>
                      <div style={styles.postImage}>
                        <div style={styles.imagePlaceholder}>
                          {post.title.charAt(0)}
                        </div>
                      </div>
                      <div style={styles.postContent}>
                        <div style={styles.postHeader}>
                          <span style={styles.categoryBadge}>{post.category}</span>
                          <h3 style={styles.postTitle}>{post.title}</h3>
                        </div>
                        <p style={styles.postExcerpt}>{post.excerpt}</p>
                        <div style={styles.postMeta}>
                          <div style={styles.metaLeft}>
                            <span style={styles.author}>{post.author}</span>
                            <span style={styles.date}>{post.date}</span>
                          </div>
                          <div style={styles.metaRight}>
                            <span style={styles.readTime}>{post.readTime}</span>
                          </div>
                        </div>
                        <div style={styles.tags}>
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} style={styles.tag}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside style={styles.sidebar}>
            {/* Categories */}
            <div style={styles.sidebarWidget}>
              <h3 style={styles.widgetTitle}>Categories</h3>
              <ul style={styles.categoryList}>
                {categories.map((category) => (
                  <li key={category} style={styles.categoryItem}>
                    <a href={`/blog/category/${category.toLowerCase()}`} style={styles.categoryLink}>
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Tags */}
            <div style={styles.sidebarWidget}>
              <h3 style={styles.widgetTitle}>Popular Tags</h3>
              <div style={styles.tagsCloud}>
                {popularTags.map((tag) => (
                  <a key={tag} href={`/blog/tag/${tag.toLowerCase()}`} style={styles.tagLink}>
                    {tag}
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div style={styles.newsletterWidget}>
              <h3 style={styles.widgetTitle}>Stay Updated</h3>
              <p style={styles.newsletterText}>
                Get the latest PDF tips and tutorials delivered to your inbox.
              </p>
              <form style={styles.newsletterForm}>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  style={styles.newsletterInput}
                />
                <button type="submit" style={styles.newsletterButton}>
                  Subscribe
                </button>
              </form>
              <p style={styles.newsletterNote}>
                No spam. Unsubscribe anytime.
              </p>
            </div>

            {/* Popular Posts */}
            <div style={styles.sidebarWidget}>
              <h3 style={styles.widgetTitle}>Popular Posts</h3>
              <div style={styles.popularPosts}>
                {featuredPosts.slice(0, 3).map((post) => (
                  <a key={post.id} href={`/blog/${post.slug}`} style={styles.popularPost}>
                    <div style={styles.popularImage}>
                      <div style={styles.smallImagePlaceholder}>
                        {post.title.charAt(0)}
                      </div>
                    </div>
                    <div style={styles.popularContent}>
                      <h4 style={styles.popularTitle}>{post.title}</h4>
                      <div style={styles.popularMeta}>
                        <span style={styles.popularDate}>{post.date}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* CTA Section */}
        <section style={styles.ctaSection}>
          <div style={styles.ctaCard}>
            <h2 style={styles.ctaTitle}>Have a PDF Question?</h2>
            <p style={styles.ctaText}>
              Submit your questions or suggest topics for our next blog post.
            </p>
            <a href="/contact" style={styles.ctaButton}>
              Contact Us
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
  
  // Hero Section
  hero: {
    padding: '6rem 2rem',
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    textAlign: 'center',
    position: 'relative',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '4rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    lineHeight: 1.1,
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: '#CBD5E1',
    lineHeight: 1.6,
    marginBottom: '2.5rem',
    maxWidth: '600px',
    margin: '0 auto 2.5rem',
  },
  searchBox: {
    display: 'flex',
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
  },
  searchInput: {
    flex: 1,
    padding: '1rem 1.5rem',
    fontSize: '1rem',
    border: 'none',
    outline: 'none',
  },
  searchButton: {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    padding: '1rem 2rem',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  
  // Featured Section
  featuredSection: {
    padding: '4rem 2rem',
    backgroundColor: '#FFFFFF',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: '0.5rem',
  },
  sectionDescription: {
    fontSize: '1.125rem',
    color: '#64748B',
  },
  featuredGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featuredCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid #E2E8F0',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s, box-shadow 0.3s',
  },
  featuredImage: {
    height: '250px',
    backgroundColor: '#F1F5F9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    width: '100px',
    height: '100px',
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    fontWeight: 'bold',
  },
  featuredContent: {
    padding: '2rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  categoryBadge: {
    display: 'inline-block',
    backgroundColor: '#EFF6FF',
    color: '#2563EB',
    padding: '0.375rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '600',
    marginBottom: '1rem',
    alignSelf: 'flex-start',
  },
  featuredTitle: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: '1rem',
    lineHeight: 1.3,
  },
  featuredExcerpt: {
    fontSize: '1.125rem',
    color: '#64748B',
    lineHeight: 1.6,
    marginBottom: '1.5rem',
    flex: 1,
  },
  postMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '0.875rem',
    color: '#94A3B8',
  },
  
  // Content Grid
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '4rem',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '4rem 2rem',
  },
  
  // Main Content
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3rem',
  },
  
  // Recent Posts
  recentSection: {
    marginBottom: '3rem',
  },
  postsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #E2E8F0',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  postLink: {
    textDecoration: 'none',
    display: 'block',
  },
  postImage: {
    height: '200px',
    backgroundColor: '#F1F5F9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postContent: {
    padding: '1.5rem',
  },
  postHeader: {
    marginBottom: '1rem',
  },
  postTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#0F172A',
    margin: '1rem 0',
    lineHeight: 1.4,
  },
  postExcerpt: {
    fontSize: '1rem',
    color: '#64748B',
    lineHeight: 1.6,
    marginBottom: '1rem',
  },
  postMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    fontSize: '0.875rem',
  },
  metaLeft: {
    display: 'flex',
    gap: '1rem',
    color: '#94A3B8',
  },
  metaRight: {
    color: '#64748B',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  tag: {
    backgroundColor: '#F1F5F9',
    color: '#475569',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  
  // Sidebar
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  sidebarWidget: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid #E2E8F0',
  },
  widgetTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: '1.5rem',
    paddingBottom: '0.75rem',
    borderBottom: '2px solid #E2E8F0',
  },
  categoryList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  categoryItem: {
    marginBottom: '0.75rem',
  },
  categoryLink: {
    color: '#475569',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'color 0.2s',
    display: 'block',
    padding: '0.5rem 0',
  },
  tagsCloud: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  tagLink: {
    backgroundColor: '#F1F5F9',
    color: '#475569',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
  },
  newsletterWidget: {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    borderRadius: '12px',
    padding: '2rem',
    textAlign: 'center',
  },
  newsletterText: {
    fontSize: '1rem',
    color: '#E2E8F0',
    lineHeight: 1.6,
    marginBottom: '1.5rem',
  },
  newsletterForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  newsletterInput: {
    padding: '0.875rem 1rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '8px',
    outline: 'none',
  },
  newsletterButton: {
    backgroundColor: '#FFFFFF',
    color: '#2563EB',
    padding: '0.875rem 1rem',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  newsletterNote: {
    fontSize: '0.75rem',
    color: '#CBD5E1',
    marginTop: '1rem',
  },
  popularPosts: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  popularPost: {
    display: 'flex',
    gap: '1rem',
    textDecoration: 'none',
    alignItems: 'flex-start',
  },
  popularImage: {
    flexShrink: 0,
  },
  smallImagePlaceholder: {
    width: '60px',
    height: '60px',
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  popularContent: {
    flex: 1,
  },
  popularTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '0.25rem',
    lineHeight: 1.4,
  },
  popularMeta: {
    fontSize: '0.75rem',
    color: '#94A3B8',
  },
  
  // CTA Section
  ctaSection: {
    padding: '4rem 2rem',
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid #E2E8F0',
  },
  ctaCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: '16px',
    padding: '4rem',
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto',
    border: '1px solid #E2E8F0',
  },
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: '1rem',
  },
  ctaText: {
    fontSize: '1.25rem',
    color: '#64748B',
    lineHeight: 1.6,
    marginBottom: '2rem',
    maxWidth: '600px',
    margin: '0 auto 2rem',
  },
  ctaButton: {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    padding: '1rem 2rem',
    fontSize: '1.125rem',
    fontWeight: '600',
    textDecoration: 'none',
    borderRadius: '8px',
    display: 'inline-block',
    transition: 'background-color 0.2s',
  },
  
  // Hover Effects
  'searchButton:hover': {
    backgroundColor: '#1D4ED8',
  },
  'featuredCard:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  },
  'postCard:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  },
  'categoryLink:hover': {
    color: '#2563EB',
  },
  'tagLink:hover': {
    backgroundColor: '#E2E8F0',
  },
  'newsletterButton:hover': {
    backgroundColor: '#F1F5F9',
  },
  'popularPost:hover .popularTitle': {
    color: '#2563EB',
  },
  'ctaButton:hover': {
    backgroundColor: '#1D4ED8',
  },
  
  // Responsive Styles
  '@media (max-width: 1024px)': {
    contentGrid: {
      gridTemplateColumns: '1fr',
    },
    featuredGrid: {
      gridTemplateColumns: '1fr',
    },
    heroTitle: {
      fontSize: '3rem',
    },
  },
  
  '@media (max-width: 768px)': {
    hero: {
      padding: '4rem 1rem',
    },
    heroTitle: {
      fontSize: '2.5rem',
    },
    heroSubtitle: {
      fontSize: '1.125rem',
    },
    searchBox: {
      flexDirection: 'column',
    },
    searchInput: {
      width: '100%',
      marginBottom: '0',
    },
    searchButton: {
      width: '100%',
    },
    featuredSection: {
      padding: '3rem 1rem',
    },
    sectionTitle: {
      fontSize: '2rem',
    },
    contentGrid: {
      padding: '3rem 1rem',
      gap: '3rem',
    },
    postsGrid: {
      gridTemplateColumns: '1fr',
    },
    featuredGrid: {
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
    featuredImage: {
      height: '200px',
    },
  },
  
  '@media (max-width: 480px)': {
    heroTitle: {
      fontSize: '2rem',
    },
    heroSubtitle: {
      fontSize: '1rem',
    },
    sectionTitle: {
      fontSize: '1.75rem',
    },
    featuredTitle: {
      fontSize: '1.5rem',
    },
    postTitle: {
      fontSize: '1.25rem',
    },
  },
};