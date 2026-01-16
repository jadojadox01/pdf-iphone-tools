import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { blogPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }) {
  // Unwrap params promise
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  // Function to render formatted content
  const renderContent = (content) => {
    return content.split('\n\n').map((paragraph, index) => {
      // Check for headings
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} style={styles.sectionTitle}>
            {paragraph.replace('## ', '')}
          </h2>
        );
      } else if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} style={styles.subsectionTitle}>
            {paragraph.replace('### ', '')}
          </h3>
        );
      } else if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
        const items = paragraph.split('\n');
        return (
          <ul key={index} style={styles.list}>
            {items.map((item, i) => {
              const text = item.replace(/^[1-9]\.\s+|\-\s+/, '');
              // Handle bold text in list items
              const parts = text.split(/\*\*(.*?)\*\*/g);
              return (
                <li key={i} style={styles.listItem}>
                  <span style={styles.bullet}>•</span> 
                  {parts.map((part, idx) => 
                    idx % 2 === 0 ? part : <strong key={idx}>{part}</strong>
                  )}
                </li>
              );
            })}
          </ul>
        );
      } else if (paragraph.includes('|')) {
        // Simple table rendering
        const rows = paragraph.split('\n');
        return (
          <div key={index} style={styles.tableContainer}>
            <table style={styles.table}>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} style={styles.tableRow}>
                    {row.split('|').filter(cell => cell.trim()).map((cell, j) => {
                      const parts = cell.trim().split(/\*\*(.*?)\*\*/g);
                      return (
                        <td key={j} style={styles.tableCell}>
                          {parts.map((part, idx) => 
                            idx % 2 === 0 ? part : <strong key={idx}>{part}</strong>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      } else {
        // Handle bold text in paragraphs
        const parts = paragraph.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={index} style={styles.paragraph}>
            {parts.map((part, idx) => 
              idx % 2 === 0 ? part : <strong key={idx} style={styles.boldText}>{part}</strong>
            )}
          </p>
        );
      }
    });
  };

  return (
    <div style={styles.container}>
      <Navbar />
      
      <main style={styles.main}>
        {/* Article Header */}
        <article style={styles.article}>
          <header style={styles.articleHeader}>
            <div style={styles.headerContent}>
              <div style={styles.breadcrumb}>
                <a href="/blog" style={styles.breadcrumbLink}>Blog</a>
                <span style={styles.breadcrumbSeparator}>/</span>
                <span style={styles.breadcrumbCurrent}>{post.title}</span>
              </div>
              
              <h1 style={styles.articleTitle}>{post.title}</h1>
              
              <div style={styles.articleMeta}>
                <div style={styles.authorInfo}>
                  <div style={styles.authorAvatar}>
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <div style={styles.authorName}>{post.author}</div>
                    <div style={styles.authorRole}>{post.authorRole}</div>
                  </div>
                </div>
                
                <div style={styles.metaInfo}>
                  <div style={styles.metaItem}>
                    <span style={styles.metaIcon}>📅</span>
                    <span style={styles.metaText}>{post.date}</span>
                  </div>
                  <div style={styles.metaItem}>
                    <span style={styles.metaIcon}>⏱️</span>
                    <span style={styles.metaText}>{post.readTime}</span>
                  </div>
                  <div style={styles.metaItem}>
                    <span style={styles.metaIcon}>👁️</span>
                    <span style={styles.metaText}>1.2K views</span>
                  </div>
                </div>
              </div>
              
              <div style={styles.tagsContainer}>
                <span style={styles.categoryBadge}>{post.category}</span>
                <div style={styles.tagsList}>
                  {post.tags.map((tag) => (
                    <span key={tag} style={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div style={styles.featuredImage}>
              <div style={styles.imagePlaceholder}>
                {post.title.charAt(0)}
                <div style={styles.imageOverlay}>Featured Image</div>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div style={styles.articleContent}>
            <div style={styles.contentWrapper}>
              {/* Table of Contents */}
              <aside style={styles.tableOfContents}>
                <h3 style={styles.tocTitle}>Table of Contents</h3>
                <nav style={styles.tocNav}>
                  <ul style={styles.tocList}>
                    <li style={styles.tocItem}><a href="#section1" style={styles.tocLink}>Introduction</a></li>
                    <li style={styles.tocItem}><a href="#section2" style={styles.tocLink}>Why Convert PDF to Word?</a></li>
                    <li style={styles.tocItem}><a href="#section3" style={styles.tocLink}>Step-by-Step Guide</a></li>
                    <li style={styles.tocItem}><a href="#section4" style={styles.tocLink}>Common Issues</a></li>
                    <li style={styles.tocItem}><a href="#section5" style={styles.tocLink}>Best Practices</a></li>
                    <li style={styles.tocItem}><a href="#section6" style={styles.tocLink}>Conclusion</a></li>
                  </ul>
                </nav>
              </aside>

              {/* Main Article Text */}
              <div style={styles.mainText}>
                <div style={styles.contentSection}>
                  {renderContent(post.content)}
                </div>

                {/* Call to Action */}
                <div style={styles.articleCta}>
                  <h3 style={styles.ctaTitle}>Try Our Free PDF Tools</h3>
                  <p style={styles.ctaText}>
                    Experience the tools we write about. Convert PDF to Word or JPG instantly.
                  </p>
                  <div style={styles.ctaButtons}>
                    <a href="/free-pdf-to-word-iphone" style={styles.ctaButton}>
                      Convert PDF to Word
                    </a>
                    <a href="/convert-pdf-to-jpg-iphone" style={styles.secondaryButton}>
                      Convert PDF to JPG
                    </a>
                  </div>
                </div>

                {/* Author Bio */}
                <div style={styles.authorBio}>
                  <div style={styles.authorBioAvatar}>
                    {post.author.charAt(0)}
                  </div>
                  <div style={styles.authorBioContent}>
                    <h4 style={styles.authorBioName}>{post.author}</h4>
                    <p style={styles.authorBioRole}>{post.authorRole}</p>
                    <p style={styles.authorBioText}>
                      {post.author} is an expert in PDF tools and iPhone productivity. 
                      With years of experience in digital document management, they provide 
                      practical tips and insights for mobile users.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section style={styles.relatedSection}>
            <div style={styles.relatedHeader}>
              <h2 style={styles.relatedTitle}>Related Articles</h2>
              <p style={styles.relatedSubtitle}>You might also be interested in</p>
            </div>
            
            <div style={styles.relatedGrid}>
              {relatedPosts.map((relatedPost) => (
                <a
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  style={styles.relatedCard}
                >
                  <div style={styles.relatedImage}>
                    <div style={styles.relatedImagePlaceholder}>
                      {relatedPost.title.charAt(0)}
                    </div>
                  </div>
                  <div style={styles.relatedContent}>
                    <span style={styles.relatedCategory}>{relatedPost.category}</span>
                    <h3 style={styles.relatedPostTitle}>{relatedPost.title}</h3>
                    <p style={styles.relatedExcerpt}>{relatedPost.excerpt}</p>
                    <div style={styles.relatedMeta}>
                      <span style={styles.relatedDate}>{relatedPost.date}</span>
                      <span style={styles.relatedReadTime}>{relatedPost.readTime}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Comments Section */}
        <section style={styles.commentsSection}>
          <div style={styles.commentsHeader}>
            <h2 style={styles.commentsTitle}>Comments (3)</h2>
            <p style={styles.commentsSubtitle}>Join the discussion</p>
          </div>
          
          <div style={styles.commentsList}>
            {/* Sample Comments */}
            {[
              {
                id: 1,
                author: "Alex Johnson",
                date: "2 days ago",
                content: "Great tutorial! The step-by-step guide was very helpful. I successfully converted my PDF to Word using your tool.",
                avatar: "A"
              },
              {
                id: 2,
                author: "Maria Garcia",
                date: "1 week ago",
                content: "Thanks for the security tips. I was worried about uploading sensitive documents, but your explanation put me at ease.",
                avatar: "M"
              },
              {
                id: 3,
                author: "David Kim",
                date: "2 weeks ago",
                content: "Would love to see a tutorial about batch conversions. Is that something you're planning to add?",
                avatar: "D"
              }
            ].map((comment) => (
              <div key={comment.id} style={styles.comment}>
                <div style={styles.commentAvatar}>
                  {comment.avatar}
                </div>
                <div style={styles.commentContent}>
                  <div style={styles.commentHeader}>
                    <span style={styles.commentAuthor}>{comment.author}</span>
                    <span style={styles.commentDate}>{comment.date}</span>
                  </div>
                  <p style={styles.commentText}>{comment.content}</p>
                  <button style={styles.replyButton}>Reply</button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Comment Form */}
          <form style={styles.commentForm}>
            <h3 style={styles.formTitle}>Leave a Comment</h3>
            <div style={styles.formGrid}>
              <input 
                type="text" 
                placeholder="Your Name" 
                style={styles.formInput}
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                style={styles.formInput}
              />
            </div>
            <textarea 
              placeholder="Write your comment..." 
              rows="5" 
              style={styles.formTextarea}
            ></textarea>
            <button type="submit" style={styles.submitButton}>
              Post Comment
            </button>
          </form>
        </section>
      </main>
      
      <Footer />
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
  
  // Article Styles
  article: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  
  // Article Header
  articleHeader: {
    padding: '4rem 0',
    borderBottom: '1px solid #E2E8F0',
  },
  headerContent: {
    maxWidth: '800px',
    margin: '0 auto 3rem',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
    color: '#64748B',
  },
  breadcrumbLink: {
    color: '#2563EB',
    textDecoration: 'none',
  },
  breadcrumbSeparator: {
    color: '#CBD5E1',
  },
  breadcrumbCurrent: {
    color: '#475569',
    fontWeight: '500',
  },
  articleTitle: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    color: '#0F172A',
    lineHeight: 1.1,
    marginBottom: '2rem',
  },
  articleMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1.5rem',
  },
  authorInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  authorAvatar: {
    width: '56px',
    height: '56px',
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  authorName: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#0F172A',
  },
  authorRole: {
    fontSize: '0.875rem',
    color: '#64748B',
  },
  metaInfo: {
    display: 'flex',
    gap: '1.5rem',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#64748B',
  },
  metaIcon: {
    fontSize: '1rem',
  },
  metaText: {
    fontSize: '0.875rem',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: '#EFF6FF',
    color: '#2563EB',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  tagsList: {
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
  featuredImage: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  imagePlaceholder: {
    height: '400px',
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '4rem',
    fontWeight: 'bold',
    position: 'relative',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: '1rem',
    right: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#FFFFFF',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontSize: '0.875rem',
  },
  
  // Article Content
  articleContent: {
    padding: '4rem 0',
  },
  contentWrapper: {
    display: 'grid',
    gridTemplateColumns: '250px 1fr',
    gap: '3rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  
  // Table of Contents
  tableOfContents: {
    position: 'sticky',
    top: '2rem',
    alignSelf: 'start',
  },
  tocTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '1rem',
  },
  tocNav: {
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    padding: '1.5rem',
    border: '1px solid #E2E8F0',
  },
  tocList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  tocItem: {
    marginBottom: '0.75rem',
  },
  tocLink: {
    color: '#475569',
    textDecoration: 'none',
    fontSize: '0.875rem',
    transition: 'color 0.2s',
  },
  
  // Main Text
  mainText: {
    fontSize: '1.125rem',
    lineHeight: 1.8,
    color: '#1E293B',
  },
  contentSection: {
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#0F172A',
    margin: '2.5rem 0 1.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #E2E8F0',
  },
  subsectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#0F172A',
    margin: '2rem 0 1rem',
  },
  paragraph: {
    fontSize: '1.125rem',
    color: '#475569',
    lineHeight: 1.8,
    marginBottom: '1.5rem',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#0F172A',
  },
  list: {
    margin: '1.5rem 0',
    paddingLeft: '0',
    listStyle: 'none',
  },
  listItem: {
    fontSize: '1.125rem',
    color: '#475569',
    lineHeight: 1.8,
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'flex-start',
  },
  bullet: {
    color: '#2563EB',
    fontWeight: 'bold',
    marginRight: '0.5rem',
    flexShrink: 0,
  },
  tableContainer: {
    margin: '2rem 0',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '1rem',
  },
  tableRow: {
    borderBottom: '1px solid #E2E8F0',
  },
  tableCell: {
    padding: '1rem',
    textAlign: 'left',
    verticalAlign: 'top',
  },
  
  // Article CTA
  articleCta: {
    backgroundColor: '#EFF6FF',
    borderRadius: '12px',
    padding: '2.5rem',
    margin: '3rem 0',
    textAlign: 'center',
    border: '1px solid #BFDBFE',
  },
  ctaTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: '1rem',
  },
  ctaText: {
    fontSize: '1.125rem',
    color: '#475569',
    marginBottom: '2rem',
    maxWidth: '500px',
    margin: '0 auto 2rem',
  },
  ctaButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaButton: {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    padding: '1rem 2rem',
    fontSize: '1rem',
    fontWeight: '600',
    textDecoration: 'none',
    borderRadius: '8px',
    transition: 'background-color 0.2s',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    color: '#2563EB',
    padding: '1rem 2rem',
    fontSize: '1rem',
    fontWeight: '600',
    textDecoration: 'none',
    borderRadius: '8px',
    border: '2px solid #2563EB',
    transition: 'background-color 0.2s',
  },
  
  // Author Bio
  authorBio: {
    display: 'flex',
    gap: '1.5rem',
    padding: '2rem',
    backgroundColor: '#F8FAFC',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    margin: '3rem 0',
  },
  authorBioAvatar: {
    width: '64px',
    height: '64px',
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  authorBioContent: {
    flex: 1,
  },
  authorBioName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '0.25rem',
  },
  authorBioRole: {
    fontSize: '0.875rem',
    color: '#64748B',
    marginBottom: '1rem',
  },
  authorBioText: {
    fontSize: '1rem',
    color: '#475569',
    lineHeight: 1.6,
  },
  
  // Related Posts
  relatedSection: {
    padding: '4rem 0',
    borderTop: '1px solid #E2E8F0',
    borderBottom: '1px solid #E2E8F0',
  },
  relatedHeader: {
    maxWidth: '1000px',
    margin: '0 auto 3rem',
    textAlign: 'center',
  },
  relatedTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: '0.5rem',
  },
  relatedSubtitle: {
    fontSize: '1.125rem',
    color: '#64748B',
  },
  relatedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  relatedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    overflow: 'hidden',
    textDecoration: 'none',
    border: '1px solid #E2E8F0',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  relatedImage: {
    height: '180px',
    backgroundColor: '#F1F5F9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  relatedImagePlaceholder: {
    width: '80px',
    height: '80px',
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  relatedContent: {
    padding: '1.5rem',
  },
  relatedCategory: {
    display: 'inline-block',
    backgroundColor: '#F1F5F9',
    color: '#475569',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '500',
    marginBottom: '1rem',
  },
  relatedPostTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '0.75rem',
    lineHeight: 1.4,
  },
  relatedExcerpt: {
    fontSize: '0.875rem',
    color: '#64748B',
    lineHeight: 1.6,
    marginBottom: '1rem',
  },
  relatedMeta: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.75rem',
    color: '#94A3B8',
  },
  
  // Comments Section
  commentsSection: {
    padding: '4rem 0',
    maxWidth: '800px',
    margin: '0 auto',
  },
  commentsHeader: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  commentsTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: '0.5rem',
  },
  commentsSubtitle: {
    fontSize: '1.125rem',
    color: '#64748B',
  },
  commentsList: {
    marginBottom: '3rem',
  },
  comment: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid #E2E8F0',
  },
  commentAvatar: {
    width: '48px',
    height: '48px',
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  commentAuthor: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#0F172A',
  },
  commentDate: {
    fontSize: '0.875rem',
    color: '#64748B',
  },
  commentText: {
    fontSize: '1rem',
    color: '#475569',
    lineHeight: 1.6,
    marginBottom: '0.75rem',
  },
  replyButton: {
    backgroundColor: 'transparent',
    color: '#2563EB',
    border: 'none',
    padding: '0.25rem 0.75rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  commentForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '2rem',
    border: '1px solid #E2E8F0',
  },
  formTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '1.5rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1rem',
  },
  formInput: {
    padding: '0.875rem 1rem',
    fontSize: '1rem',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  formTextarea: {
    padding: '0.875rem 1rem',
    fontSize: '1rem',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    marginBottom: '1.5rem',
    width: '100%',
    transition: 'border-color 0.2s',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    padding: '1rem 2rem',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  
  // Hover Effects
  'breadcrumbLink:hover': {
    textDecoration: 'underline',
  },
  'tocLink:hover': {
    color: '#2563EB',
  },
  'ctaButton:hover': {
    backgroundColor: '#1D4ED8',
  },
  'secondaryButton:hover': {
    backgroundColor: '#EFF6FF',
  },
  'relatedCard:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  },
  'replyButton:hover': {
    backgroundColor: '#F1F5F9',
  },
  'formInput:hover': {
    borderColor: '#CBD5E1',
  },
  'formTextarea:hover': {
    borderColor: '#CBD5E1',
  },
  'submitButton:hover': {
    backgroundColor: '#1D4ED8',
  },
  
  // Responsive Styles
  '@media (max-width: 1024px)': {
    contentWrapper: {
      gridTemplateColumns: '1fr',
    },
    tableOfContents: {
      position: 'static',
      order: 2,
    },
  },
  
  '@media (max-width: 768px)': {
    article: {
      padding: '0 1rem',
    },
    articleHeader: {
      padding: '3rem 0',
    },
    articleTitle: {
      fontSize: '2.5rem',
    },
    articleMeta: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    metaInfo: {
      flexWrap: 'wrap',
    },
    imagePlaceholder: {
      height: '300px',
      fontSize: '3rem',
    },
    articleContent: {
      padding: '3rem 0',
    },
    contentWrapper: {
      gap: '2rem',
    },
    sectionTitle: {
      fontSize: '1.75rem',
    },
    subsectionTitle: {
      fontSize: '1.25rem',
    },
    articleCta: {
      padding: '2rem',
    },
    ctaButtons: {
      flexDirection: 'column',
    },
    authorBio: {
      flexDirection: 'column',
      textAlign: 'center',
    },
    authorBioAvatar: {
      margin: '0 auto',
    },
    relatedSection: {
      padding: '3rem 0',
    },
    relatedTitle: {
      fontSize: '2rem',
    },
    relatedGrid: {
      gridTemplateColumns: '1fr',
    },
    commentsSection: {
      padding: '3rem 1rem',
    },
    formGrid: {
      gridTemplateColumns: '1fr',
    },
  },
  
  '@media (max-width: 480px)': {
    articleTitle: {
      fontSize: '2rem',
    },
    imagePlaceholder: {
      height: '200px',
      fontSize: '2rem',
    },
    relatedTitle: {
      fontSize: '1.75rem',
    },
    commentsTitle: {
      fontSize: '1.75rem',
    },
  },
};