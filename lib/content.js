import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import remarkGfm from 'remark-gfm'

const contentDirectory = path.join(process.cwd(), 'content')

// Map Jekyll filenames to Next.js friendly slugs
const fileNameMapping = {
  'Delegatecall-History.md': 'delegatecall-history',
  'Proxies-List.md': 'proxies-list', 
  'Proxies-Storage.md': 'proxies-storage',
  'Proxies-Table.md': 'proxies-table',
  'Proxy-Basics.md': 'proxy-basics',
  'Proxy-Identification.md': 'proxy-identification',
  'Security-Guide.md': 'security-guide'
}

export function getAllContentSlugs() {
  try {
    const fileNames = fs.readdirSync(contentDirectory)
    return fileNames
      .filter((name) => name.endsWith('.md'))
      .map((fileName) => {
        // Convert filename to slug
        return fileName.replace(/\.md$/, '').toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
      })
  } catch (error) {
    console.warn('Content directory not found, using fallback content')
    return []
  }
}

export async function getContentData(slug) {
  try {
    const fileName = `${slug}.md`
    const fullPath = path.join(contentDirectory, fileName)
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Content file not found for slug: ${slug}`)
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)
    
    // Enhanced markdown processing with better options
    const processedContent = await remark()
      .use(remarkGfm) // GitHub Flavored Markdown
      .use(html, { 
        sanitize: false, // Allow HTML in markdown
        allowDangerousHtml: true // Allow dangerous HTML for full compatibility
      })
      .process(matterResult.content)
    
    let contentHtml = processedContent.toString()
    
    // Post-process HTML for better styling and functionality
    contentHtml = enhanceMarkdownHtml(contentHtml)

    return {
      slug,
      contentHtml,
      title: matterResult.data.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      ...matterResult.data,
    }
  } catch (error) {
    console.error(`Error loading content for ${slug}:`, error)
    return null
  }
}

// Enhanced HTML post-processing for better styling and Jekyll-style TOC
function enhanceMarkdownHtml(html) {
  // Process Jekyll-style table of contents
  html = processJekyllTOC(html);
  
  // Remove Jekyll directives and liquid tags
  html = html
    // Remove Jekyll attribute directives
    .replace(/\{:\s*\.[\w\s\-\.]*\s*\}/g, '')
    
    // Remove Jekyll liquid tags
    .replace(/\{%[\s\S]*?%\}/g, '')
    
    // Remove Jekyll variable references that didn't get processed
    .replace(/\{\{[\s\S]*?\}\}/g, '')
    
    // Remove common Jekyll front matter that leaked through
    .replace(/^---[\s\S]*?---/m, '')
    
    // Clean up multiple line breaks
    .replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Add classes for better styling
  html = html
    // Style tables
    .replace(/<table>/g, '<table class="markdown-table">')
    
    // Style code blocks with syntax highlighting classes
    .replace(/<pre><code>/g, '<pre class="code-block"><code class="code-content">')
    
    // Style inline code
    .replace(/<code>/g, '<code class="inline-code">')
    
    // Style blockquotes
    .replace(/<blockquote>/g, '<blockquote class="markdown-blockquote">')
    
    // Add proper links styling and external link handling
    .replace(/<a href="([^"]*)"([^>]*)>/g, (match, href, attrs) => {
      const isExternal = href.startsWith('http') || href.startsWith('//');
      const externalAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      const className = isExternal ? ' class="external-link"' : ' class="internal-link"';
      return `<a href="${href}"${className}${externalAttrs}${attrs}>`;
    })
    
    // Style headers with anchor links for TOC
    .replace(/<h([1-6])([^>]*)>(.*?)<\/h[1-6]>/g, (match, level, attrs, content) => {
      const id = content.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      return `<h${level} id="${id}" class="markdown-heading markdown-h${level}"${attrs}>
        <a href="#${id}" class="header-anchor" aria-hidden="true">#</a>
        ${content}
      </h${level}>`;
    })
    
    // Style lists
    .replace(/<ul>/g, '<ul class="markdown-list">')
    .replace(/<ol>/g, '<ol class="markdown-list ordered">')
    
    // Add wrapper for paragraphs
    .replace(/<p>/g, '<p class="markdown-paragraph">');

  return html;
}

// Process Jekyll-style {:toc} table of contents
function processJekyllTOC(html) {
  // Look for Jekyll TOC pattern: 1. TOC\n{:toc} or just {:toc}
  const tocPattern = /1\.\s*TOC\s*\{:toc\}|\{:toc\}/gi;
  
  if (!tocPattern.test(html)) {
    return html;
  }
  
  // Extract all headings from the HTML (after the TOC marker)
  const headingRegex = /<h([2-6])[^>]*>(.*?)<\/h[2-6]>/g;
  const headings = [];
  let match;
  
  // Reset regex
  html.replace(headingRegex, (fullMatch, level, title) => {
    const cleanTitle = title.replace(/<[^>]*>/g, '').trim();
    const id = cleanTitle.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    headings.push({
      level: parseInt(level),
      title: cleanTitle,
      id,
      href: `#${id}`
    });
    return fullMatch;
  });
  
  if (headings.length === 0) {
    return html;
  }
  
  // Generate the TOC HTML
  let tocHtml = '<div class="jekyll-toc">\n<ol class="toc-list">\n';
  
  headings.forEach((heading, index) => {
    const { level, title, href } = heading;
    
    if (level === 2) {
      // Main section
      tocHtml += `  <li class="toc-item"><a href="${href}" class="toc-link">${title}</a>\n`;
      
      // Look for subsections (h3) that follow this h2
      const subsections = headings.slice(index + 1).filter(h => h.level === 3);
      const nextH2Index = headings.slice(index + 1).findIndex(h => h.level === 2);
      const relevantSubsections = nextH2Index === -1 ? subsections : subsections.slice(0, nextH2Index);
      
      if (relevantSubsections.length > 0) {
        tocHtml += '    <ol class="toc-sublist">\n';
        relevantSubsections.forEach(sub => {
          tocHtml += `      <li class="toc-item"><a href="${sub.href}" class="toc-link">${sub.title}</a></li>\n`;
        });
        tocHtml += '    </ol>\n';
      }
      
      tocHtml += '  </li>\n';
    }
  });
  
  tocHtml += '</ol>\n</div>';
  
  // Replace the Jekyll TOC marker with our generated TOC
  html = html.replace(/1\.\s*TOC\s*\{:toc\}|\{:toc\}/gi, tocHtml);
  
  return html;
}

// Generate table of contents from HTML
export function generateTableOfContents(contentHtml) {
  const headingRegex = /<h([2-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[2-6]>/g;
  const toc = [];
  let match;
  
  while ((match = headingRegex.exec(contentHtml)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    const title = match[3].replace(/<[^>]*>/g, ''); // Strip any HTML tags
    
    toc.push({
      level,
      id,
      title,
      href: `#${id}`
    });
  }
  
  return toc;
}

export async function getAllContent() {
  const slugs = getAllContentSlugs()
  const allContent = await Promise.all(
    slugs.map(async (slug) => {
      return await getContentData(slug)
    })
  )
  
  // Filter out null results and sort by nav_order if available
  return allContent
    .filter(Boolean)
    .sort((a, b) => {
      if (a.nav_order && b.nav_order) {
        return a.nav_order - b.nav_order
      }
      return a.title.localeCompare(b.title)
    })
}

// Extract text content from HTML
function stripHtml(html) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Extract sections from HTML content
function extractSections(contentHtml, pageTitle, pageSlug) {
  const sections = []
  const headingRegex = /<h([2-6])[^>]*>(.*?)<\/h[2-6]>/gi
  let match
  let sectionIndex = 0
  
  while ((match = headingRegex.exec(contentHtml)) !== null) {
    const level = parseInt(match[1])
    const headingHtml = match[2]
    const headingText = stripHtml(headingHtml)
    
    if (headingText.trim()) {
      const sectionId = headingText.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      
      sections.push({
        id: `${pageSlug}-section-${sectionIndex}`,
        type: 'section',
        title: headingText,
        pageTitle,
        slug: pageSlug,
        sectionId,
        level,
        content: headingText,
        path: `/${pageSlug}#${sectionId}`,
        searchText: `${headingText} ${pageTitle}`.toLowerCase()
      })
      sectionIndex++
    }
  }
  
  return sections
}

// Build comprehensive search index
export async function buildSearchIndex() {
  const allContent = await getAllContent()
  const index = []
  
  allContent.forEach(page => {
    if (!page) return
    
    const textContent = stripHtml(page.contentHtml)
    
    // Index the main page
    index.push({
      id: page.slug,
      type: 'page',
      title: page.title,
      slug: page.slug,
      path: `/${page.slug}`,
      category: page.category || getCategory(page.slug),
      parent: page.parent,
      content: textContent,
      description: page.description || textContent.substring(0, 200) + '...',
      searchText: `${page.title} ${textContent}`.toLowerCase()
    })
    
    // Extract and index sections
    const sections = extractSections(page.contentHtml, page.title, page.slug)
    index.push(...sections)
  })
  
  return index
}

// Categorize content based on slug patterns
function getCategory(slug) {
  if (slug.includes('security') || slug.includes('vuln')) return 'security'
  if (slug.includes('proxy-basics')) return 'fundamentals'
  if (slug.includes('identification')) return 'analysis'
  if (slug.includes('deep-dive') || slug.includes('storage') || slug.includes('table') || slug.includes('list')) return 'advanced'
  if (slug.includes('delegatecall') || slug.includes('history')) return 'technical'
  if (slug === 'home') return 'overview'
  return 'general'
}

// Navigation structure builder
export function buildNavigation(content) {
  const navigationItems = [
    {
      id: 'home',
      title: 'yAcademy Proxies Research',
      icon: 'Book',
      path: '/',
      description: 'Introduction to proxy patterns and research goals'
    },
    {
      id: 'proxy-basics',
      title: 'Proxy Basics',
      icon: 'Code',
      path: '/proxy-basics',
      description: 'Fundamental concepts of proxy patterns'
    },
    {
      id: 'proxies-deep-dive',
      title: 'Proxies Deep Dive',
      icon: 'FileText',
      expandable: true,
      children: [
        {
          id: 'proxies-list',
          title: 'Proxies List',
          path: '/proxies-list'
        },
        {
          id: 'proxies-storage',
          title: 'Proxies Storage',
          path: '/proxies-storage'
        },
        {
          id: 'proxies-table',
          title: 'Proxies Table',
          path: '/proxies-table'
        },
        {
          id: 'delegatecall-history',
          title: 'History of Callcode and Delegatecall',
          path: '/delegatecall-history'
        }
      ]
    },
    {
      id: 'security-guide',
      title: 'Security Guide to Proxy Vulns',
      icon: 'Shield',
      expandable: true,
      children: [
        {
          id: 'proxy-identification',
          title: 'Proxy Identification Guide',
          path: '/proxy-identification'
        }
      ]
    }
  ]
  
  // Filter navigation items based on available content
  return navigationItems.filter(item => {
    if (item.children) {
      item.children = item.children.filter(child => 
        content.some(c => c.slug === child.id)
      )
      return item.children.length > 0
    }
    return content.some(c => c.slug === item.id) || item.id === 'home'
  })
}

// Fallback content for when markdown files aren't available
export function getFallbackContent() {
  return [
    {
      slug: 'home',
      title: 'yAcademy Proxies Research',
      category: 'overview',
      contentHtml: `
        <p>In Web3, the Proxy or Proxy Delegate is a <a href="https://en.wikipedia.org/wiki/Delegation_pattern">delegation pattern</a> commonly used to introduce upgradability in smart contracts. While it can be extremely powerful, it is also commonly misunderstood — leading to incorrect implementations and security issues.</p>
        
        <p>This research effort compiles proxy knowledge with the goal of improving the correctness of proxy implementations and providing a useful resource for security reviews of proxy contracts. By sharing knowledge, we hope to improve the security of smart contracts and the greater ecosystem.</p>
        
        <h2>Research Goals</h2>
        <p>Improve the correctness of proxy implementations and provide useful resources for security reviews of proxy contracts.</p>
        
        <h2>Getting Started</h2>
        <p>Browse the documentation using the sidebar navigation or use the search functionality to find specific topics.</p>
      `
    }
  ]
}