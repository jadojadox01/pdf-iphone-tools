import tools from '@/lib/tools';
import { blogPosts } from '@/lib/blog';

export async function GET() {
  const baseUrl = 'https://pdftoword-ten.vercel.app';

  // Static pages (only real pages)
  const staticPages = [
    '',        // homepage
    'about',
    'contact',
    'privacy',
    'terms',
    'blog',    // blog listing page
  ];

  const staticUrls = staticPages
    .map(page => `<url><loc>${baseUrl}/${page}</loc></url>`)
    .join('');

  // Tools pages (each tool slug directly under root)
  const toolUrls = tools
    .map(tool => `<url><loc>${baseUrl}/${tool.slug}</loc></url>`)
    .join('');

  // Blog posts
  const blogUrls = blogPosts
    .map(post => `<url><loc>${baseUrl}/blog/${post.slug}</loc></url>`)
    .join('');

  // Combine all
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${toolUrls}
  ${blogUrls}
</urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
