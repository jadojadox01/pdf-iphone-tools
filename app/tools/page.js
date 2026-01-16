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

// Add this to your existing tools.js or create a separate blogs.js file
export const blogPosts = [
  {
    id: 1,
    slug: "how-to-convert-pdf-to-word-on-iphone",
    title: "How to Convert PDF to Word on iPhone - Complete Guide 2024",
    excerpt: "Learn the easiest methods to convert PDF files to editable Word documents directly on your iPhone. No computer needed!",
    content: `In today's mobile-first world, being able to convert documents on your iPhone is essential. Whether you're a student, professional, or just someone who needs to edit a PDF, this guide will show you exactly how to convert PDF to Word on your iPhone.

## Why Convert PDF to Word on iPhone?

1. **Edit Anywhere**: Make changes to documents while on the go
2. **No Computer Needed**: Complete the entire process on your iPhone
3. **Preserve Formatting**: Maintain the original layout and styling
4. **Fast Processing**: Convert files in seconds

## Method 1: Using Our Free Online Tool

Our free PDF to Word converter is specifically optimized for iPhone users:

### Step-by-Step Guide:
1. Open Safari on your iPhone
2. Visit Free PDF iPhone Tools
3. Select "PDF to Word Converter"
4. Upload your PDF file
5. Click "Convert Now"
6. Download your Word document

**Pro Tip**: Use iCloud Drive or Files app to upload PDFs quickly.

## Method 2: Alternative Apps

While our online tool is free and requires no installation, here are some popular apps:

- **Adobe Acrobat Reader**: Free with premium features
- **Microsoft Office Lens**: Great for scanning and converting
- **PDF Expert**: Powerful editing capabilities

## Common Issues and Solutions

### File Size Limitations
Most free tools have size limits (usually 50MB). For larger files:
- Compress the PDF first
- Use desktop software
- Split the PDF into smaller parts

### Formatting Problems
If formatting gets messed up:
- Check if the PDF contains complex layouts
- Try converting to .docx instead of .doc
- Use "preserve formatting" option if available

## Best Practices

1. **Backup First**: Always keep a copy of your original PDF
2. **Check Quality**: Review the converted document for accuracy
3. **Use Secure Tools**: Ensure your data privacy is protected
4. **Regular Updates**: Keep your browser updated for best performance

## Conclusion

Converting PDF to Word on iPhone is now easier than ever. With our free online tool, you can complete the process in minutes without downloading any apps. Remember to choose the method that best fits your needs and always prioritize security when handling important documents.

Need help? Check our [FAQ section](/faq) or contact our support team.`,
    author: "John Smith",
    authorRole: "Tech Editor",
    date: "2024-03-15",
    readTime: "5 min read",
    category: "Tutorials",
    tags: ["PDF", "Word", "iPhone", "Tutorial", "Conversion"],
    image: "/blog/pdf-to-word.jpg",
    featured: true
  },
  {
    id: 2,
    slug: "best-free-pdf-tools-for-ios",
    title: "10 Best Free PDF Tools for iOS in 2024",
    excerpt: "Discover the top free PDF tools available for iPhone and iPad users. Edit, convert, and manage PDFs without spending a dime.",
    content: `As an iPhone user, you might need to work with PDF files regularly. Fortunately, there are excellent free tools available. Here are our top picks for 2024.

## Our Top 10 Free PDF Tools for iOS

### 1. Free PDF iPhone Tools (Our Platform)
- **Best for**: Quick online conversions
- **Features**: PDF to Word, PDF to JPG, no installation required
- **Why we love it**: Works directly in Safari, no app downloads

### 2. Apple Files + Preview
- **Best for**: Basic viewing and markup
- **Features**: Built into iOS, annotation tools
- **Why we love it**: Already installed, integrates with iCloud

### 3. Adobe Acrobat Reader
- **Best for**: Professional users
- **Features**: View, sign, comment, fill forms
- **Why we love it**: Industry standard, reliable

### 4. Microsoft Office Lens
- **Best for**: Scanning documents to PDF
- **Features**: Document scanning, PDF creation
- **Why we love it**: Excellent scanning quality

### 5. PDF Viewer by PSPDFKit
- **Best for**: Advanced users
- **Features**: Annotation, form filling, merging
- **Why we love it**: Powerful free tier

### 6. Xodo PDF Reader & Editor
- **Best for**: Cross-platform users
- **Features**: Edit, annotate, sign PDFs
- **Why we love it**: Works on all platforms

### 7. Foxit PDF Reader
- **Best for**: Business users
- **Features**: Cloud integration, collaboration
- **Why we love it**: Enterprise features in free version

### 8. PDFelement
- **Best for**: Editing PDFs
- **Features**: Edit text, images, pages
- **Why we love it**: Great editing capabilities

### 9. GoodReader
- **Best for**: PDF management
- **Features**: File management, sync, annotation
- **Why we love it**: Excellent file organization

### 10. Kami
- **Best for**: Education
- **Features**: Classroom tools, collaboration
- **Why we love it**: Great for teachers and students

## How to Choose the Right Tool

Consider these factors:
1. **Your Needs**: What do you need to do with PDFs?
2. **Frequency**: How often will you use it?
3. **Privacy**: Where are your files stored?
4. **Integration**: Does it work with your other apps?

## Privacy Considerations

When using free PDF tools:
- Check privacy policies
- Avoid tools that upload to unknown servers
- Use tools with local processing when possible
- Consider offline alternatives

## Future Trends

The PDF tools market is evolving:
- More AI-powered features
- Better mobile optimization
- Enhanced security features
- Cloud-native solutions

## Final Thoughts

You don't need to pay for expensive PDF software. With these free tools, you can handle most PDF tasks on your iPhone. For quick conversions without installation, our platform remains the top choice.

Remember: The best tool is the one that fits your specific needs and workflow.`,
    author: "Sarah Johnson",
    authorRole: "Digital Tools Expert",
    date: "2024-03-10",
    readTime: "7 min read",
    category: "Reviews",
    tags: ["Tools", "iOS", "Review", "Free", "PDF"],
    image: "/blog/pdf-tools.jpg",
    featured: true
  },
  {
    id: 3,
    slug: "privacy-security-pdf-conversion",
    title: "Privacy & Security in PDF Conversion: What You Need to Know",
    excerpt: "Protect your sensitive documents when converting PDFs online. Essential security tips every iPhone user should follow.",
    content: `When converting PDF files online, security should be your top priority. Here's what you need to know to protect your documents.

## The Risks of Online PDF Conversion

### Data Privacy Concerns
1. **File Storage**: Where are your files stored?
2. **Data Access**: Who can access your documents?
3. **Third-Party Sharing**: Are files shared with other companies?
4. **Data Retention**: How long are files kept?

### Security Threats
- Malware injection
- Data interception
- Phishing attacks
- Unauthorized access

## How Our Platform Protects You

At Free PDF iPhone Tools, we prioritize your security:

### Our Security Measures:
1. **No Permanent Storage**: Files deleted immediately after processing
2. **Encrypted Transfers**: HTTPS encryption for all uploads/downloads
3. **Local Processing**: Files processed in temporary memory
4. **No Third-Party Sharing**: Your files stay with us
5. **Regular Audits**: Security checks performed regularly

## Best Practices for Safe PDF Conversion

### Before Conversion:
1. **Remove Sensitive Data**: Delete personal information if possible
2. **Use Strong Passwords**: Password-protect sensitive PDFs
3. **Check File Sources**: Only convert trusted documents
4. **Scan for Viruses**: Use antivirus software

### During Conversion:
1. **Use Secure Connections**: Look for HTTPS in the URL
2. **Check Privacy Policies**: Read the service's security statements
3. **Avoid Public Wi-Fi**: Use secure networks for sensitive documents
4. **Monitor Uploads**: Watch for any suspicious activity

### After Conversion:
1. **Delete Files**: Remove files from the service if possible
2. **Check Downloads**: Scan downloaded files for malware
3. **Clear Browser Cache**: Remove temporary files
4. **Change Passwords**: If you uploaded password-protected files

## Signs of a Secure PDF Converter

Look for these indicators:
- **HTTPS Encryption**: Secure connection
- **Clear Privacy Policy**: Transparent data handling
- **No Registration Required**: Less data collection
- **File Deletion Policy**: Automatic file removal
- **Reputable Provider**: Established service with good reviews

## Advanced Security Tips

### For Business Users:
1. **Use Enterprise Solutions**: Dedicated secure platforms
2. **Implement DLP**: Data Loss Prevention tools
3. **Employee Training**: Security awareness programs
4. **Regular Audits**: Security compliance checks

### For Personal Use:
1. **Local Software**: Consider desktop applications
2. **VPN Usage**: Additional encryption layer
3. **File Encryption**: Encrypt before uploading
4. **Regular Updates**: Keep software current

## The Future of PDF Security

Emerging technologies:
- **Blockchain Verification**: Tamper-proof document tracking
- **AI Security**: Intelligent threat detection
- **Zero-Knowledge Proofs**: Privacy-preserving verification
- **Quantum Encryption**: Unbreakable security protocols

## Conclusion

Your document security is crucial. Always choose PDF conversion services that prioritize privacy and follow security best practices. Our platform is designed with your security in mind, offering safe conversion without compromising your data.

Stay safe, stay secure, and always protect your digital documents.`,
    author: "Michael Chen",
    authorRole: "Security Analyst",
    date: "2024-03-05",
    readTime: "6 min read",
    category: "Security",
    tags: ["Security", "Privacy", "PDF", "Safety", "Data"],
    image: "/blog/security.jpg",
    featured: false
  },
  {
    id: 4,
    slug: "ios-17-pdf-features",
    title: "iOS 17 New PDF Features: What's Changed for iPhone Users",
    excerpt: "Explore the latest PDF capabilities in iOS 17. Enhanced tools, better integration, and new features for PDF management.",
    content: `Apple's iOS 17 brings significant improvements to PDF handling on iPhone. Let's explore what's new and how it benefits you.

## Major PDF Enhancements in iOS 17

### 1. Built-in PDF Editor
For the first time, iOS includes a native PDF editor:
- **Text Editing**: Modify text directly in PDFs
- **Image Insertion**: Add images to documents
- **Form Filling**: Complete forms without third-party apps
- **Signature Capture**: Sign documents with ease

### 2. Improved Files App Integration
- **PDF Thumbnails**: Better visual organization
- **Search Within PDFs**: Find text inside documents
- **Quick Actions**: Convert, merge, split with fewer taps
- **Cloud Integration**: Seamless iCloud Drive support

### 3. Enhanced Markup Tools
- **New Annotation Types**: More markup options
- **Pressure Sensitivity**: Better Apple Pencil support
- **Custom Stamps**: Create personalized stamps
- **Collaboration Features**: Real-time co-editing

## Step-by-Step: Using New PDF Features

### How to Edit PDF Text in iOS 17:
1. Open PDF in Files app
2. Tap "Edit" in top-right corner
3. Select text to modify
4. Use keyboard to make changes
5. Tap "Done" to save

### How to Fill PDF Forms:
1. Open form PDF
2. Tap on form fields
3. Enter required information
4. Use digital signature if needed
5. Save or share completed form

## Comparison: iOS 16 vs iOS 17

| Feature | iOS 16 | iOS 17 |
|---------|---------|---------|
| Text Editing | Limited | Full editing |
| Form Filling | Basic | Advanced |
| Markup Tools | Standard | Enhanced |
| Integration | Good | Excellent |
| Performance | Fast | Faster |

## Tips for Maximum Productivity

### Workflow Optimization:
1. **Use Shortcuts**: Automate PDF tasks
2. **Siri Integration**: Voice commands for PDF actions
3. **Focus Modes**: Custom PDF workflows
4. **Back Tap**: Quick actions with phone taps

### Organization Strategies:
1. **Smart Folders**: Auto-organize PDFs by type
2. **Tags System**: Categorize documents
3. **Quick Notes**: Attach notes to PDFs
4. **Reminders**: Set PDF-related reminders

## Compatibility with Third-Party Apps

iOS 17 improves compatibility:
- **Better API Support**: Enhanced developer tools
- **Shared Features**: Common tools across apps
- **File Handoff**: Seamless app switching
- **Universal Clipboard**: Copy-paste between apps

## Potential Issues and Solutions

### Common Problems:
1. **Formatting Loss**: Some complex PDFs may not edit perfectly
2. **App Conflicts**: Third-party apps may need updates
3. **Storage Issues**: Large PDF collections need management

### Solutions:
- Update all PDF-related apps
- Use cloud storage for large collections
- Convert complex PDFs to simpler formats
- Regular iOS updates for bug fixes

## Future Predictions

Based on Apple's roadmap:
1. **AI Integration**: Smart document analysis
2. **AR Features**: Augmented reality document viewing
3. **Blockchain**: Secure document verification
4. **Cross-Platform**: Better Mac-iPad-iPhone sync

## Conclusion

iOS 17 represents a significant leap forward for PDF handling on iPhone. With built-in editing, improved organization, and enhanced tools, you can manage PDFs more efficiently than ever before.

Whether you're a student, professional, or casual user, these new features will streamline your document workflow.`,
    author: "Emma Wilson",
    authorRole: "Apple Specialist",
    date: "2024-02-28",
    readTime: "8 min read",
    category: "iOS Updates",
    tags: ["iOS 17", "Apple", "Update", "PDF", "Features"],
    image: "/blog/ios17.jpg",
    featured: true
  }
];

export const categories = [
  "Tutorials",
  "Reviews",
  "Security",
  "iOS Updates",
  "Tips & Tricks",
  "News"
];

export const popularTags = [
  "PDF", "iPhone", "Tutorial", "Security", "iOS", 
  "Free", "Tools", "Conversion", "Privacy", "How-to"
];