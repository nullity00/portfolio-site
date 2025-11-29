import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const contentDirectory = path.join(process.cwd(), 'content')

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Updated function to clean LaTeX comments while preserving both types of code blocks
function cleanLatexComments(content: string): string {
  // First, let's create unique markers for code blocks
  const markers = {
    fenced: '___FENCED_CODE_BLOCK___',
    inline: '___INLINE_CODE___'
  };

  // Store code blocks
  const codeBlocks: string[] = [];
  const inlineBlocks: string[] = [];

  // Replace fenced code blocks with markers
  content = content.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return markers.fenced + (codeBlocks.length - 1);
  });

  // Replace inline code blocks with markers
  content = content.replace(/`[^`\n]+`/g, (match) => {
    inlineBlocks.push(match);
    return markers.inline + (inlineBlocks.length - 1);
  });

  // Restore inline code blocks
  content = content.replace(new RegExp(markers.inline + '(\\d+)', 'g'), (_, index) => {
    return inlineBlocks[parseInt(index)];
  });

  // Restore fenced code blocks
  content = content.replace(new RegExp(markers.fenced + '(\\d+)', 'g'), (_, index) => {
    return codeBlocks[parseInt(index)];
  });

  return content;
}

function remarkCodeBlocks() {
  return (tree: any) => {
    visit(tree, 'code', (node: any) => {
      // Set up data structure if it doesn't exist
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};

      // Special handling for mermaid code blocks
      if (node.lang === 'mermaid') {
        // For mermaid, we need to transform this differently
        // Mark this node as a mermaid diagram for special handling in rehype
        node.data.mermaidDiagram = true;
        // Set the class to mermaid without the language- prefix
        node.data.hProperties.className = 'mermaid no-highlight';
      } else {
        // Standard handling for other code blocks
        node.data.hProperties.className = `language-${node.lang || 'text'}`;
      }
    });
  };
}

function remarkTrimBackticks() {
  return (tree: any) => {
    visit(tree, 'inlineCode', (node: any) => {
      // Convert the node to plain text if it starts and ends with backticks
      const value = node.value;
      if (value.startsWith('`') && value.endsWith('`') && value.startsWith('```') === false) {
        node.value = value.slice(1, -1);
      }

      // Add classes for styling
      node.data = node.data || {};
      node.data.hProperties = {
        className: 'inline-code-block'
      };
    });
  };
}

// Interface for image nodes in the AST
interface ImageNode {
  type: 'image';
  url: string;
  title: string | null;
  alt: string | null;
}

// Plugin to replace image URLs
function remarkReplaceImageUrls() {
  return (tree: any) => {
    visit(tree, 'image', (node: ImageNode) => {
      const url = node.url;

      // Handle paths that start with ../public/assets/
      if (url.startsWith('../public/')) {
        // Remove ../public/assets/ prefix and convert to /assets/
        node.url = url.replace('../public/', '/');
      }

      // Handle paths that might already start with /assets/
      else if (url.startsWith('/')) {
        // Keep as is
        node.url = url;
      }
    });
  };
}

export async function processMarkdown(content: string) {
  const { data, content: markdownContent } = matter(content);

  // Clean up LaTeX comments while preserving code blocks
  const cleanedContent = cleanLatexComments(markdownContent);

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkReplaceImageUrls)
    .use(remarkMath)
    .use(remarkTrimBackticks)
    .use(remarkCodeBlocks)
    .use(remarkRehype, {
      allowDangerousHtml: true,
    })
    .use(rehypeKatex, {
      strict: false,
      trust: true,
      macros: {
        "\\eqref": "\\href{#1}{}",
      },
      errorColor: ' #cc0000',
      throwOnError: false,
      displayMode: false,
    })
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(cleanedContent);

  return {
    frontMatter: data,
    content: processedContent.toString()
  };
}

// Type definitions
export interface ContentData {
  slug: string
  title: string
  contentHtml: string
  category?: string
  nav_order?: number
  parent?: string
  description?: string
  [key: string]: any
}

export interface TableOfContentsItem {
  level: number
  id: string
  title: string
  href: string
}

export interface SearchIndexItem {
  id: string
  type: 'page' | 'section'
  title: string
  slug: string
  path: string
  category?: string
  parent?: string
  content?: string
  description?: string
  searchText: string
  pageTitle?: string
  sectionId?: string
  level?: number
}

export interface NavigationItem {
  id: string
  title: string
  icon?: string
  path?: string
  description?: string
  expandable?: boolean
  children?: NavigationItem[]
}

export interface Heading {
  level: number
  title: string
  id: string
  href: string
}

// Map Jekyll filenames to Next.js friendly slugs
const fileNameMapping: Record<string, string> = {
  'circom.md': 'change-circom-prime-field',
  'fiat-shamir.md': 'fiat-shamir-pitfalls',
  'trusted-setup.md': 'trusted-setup',
  'plonk.md': 'plonk',
  'folding.md': 'folding',
  'circom-pitfalls.md': 'circom-pitfalls',
  'neox-dkg.md': 'neox-dkg',
  'aleo-zvote.md': 'aleo-zvote',
  'Delegatecall-History.md': 'delegatecall-history',
  'Proxy-Basics.md': 'proxy-basics',
  'Proxy-Identification.md': 'proxy-identification',
  'Security-Guide.md': 'security-guide'
}

export function getAllContentSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(contentDirectory)
    return fileNames
      .filter((name) => name.endsWith('.md'))
      .map((fileName) => {
        // Check if there's a specific mapping for this file
        if (fileNameMapping[fileName]) {
          return fileNameMapping[fileName]
        }
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

export async function getContentData(slug: string): Promise<ContentData | null> {
  try {
    // Find the actual filename for this slug (reverse mapping)
    const reverseMapping = Object.fromEntries(
      Object.entries(fileNameMapping).map(([file, mappedSlug]) => [mappedSlug, file])
    )

    const fileName = reverseMapping[slug] || `${slug}.md`
    const fullPath = path.join(contentDirectory, fileName)

    if (!fs.existsSync(fullPath)) {
      throw new Error(`Content file not found for slug: ${slug}`)
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use the new unified markdown processor
    const { frontMatter, content: contentHtml } = await processMarkdown(fileContents)

    // Post-process HTML for better styling and functionality
    const enhancedHtml = enhanceMarkdownHtml(contentHtml)

    return {
      slug,
      contentHtml: enhancedHtml,
      title: frontMatter.title || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      ...frontMatter,
    }
  } catch (error) {
    console.error(`Error loading content for ${slug}:`, error)
    return null
  }
}

// Enhanced HTML post-processing for better styling and Jekyll-style TOC
function enhanceMarkdownHtml(html: string): string {
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
    // Style tables with wrapper for horizontal scrolling
    .replace(/<table>/g, '<div class="table-wrapper"><table class="markdown-table">')
    .replace(/<\/table>/g, '</table></div>')
    
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
function processJekyllTOC(html: string): string {
  // Look for Jekyll TOC pattern: 1. TOC\n{:toc} or just {:toc}
  const tocPattern = /1\.\s*TOC\s*\{:toc\}|\{:toc\}/gi;
  
  if (!tocPattern.test(html)) {
    return html;
  }
  
  // Extract all headings from the HTML (after the TOC marker)
  const headingRegex = /<h([2-6])[^>]*>(.*?)<\/h[2-6]>/g;
  const headings: Heading[] = [];
  
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
export function generateTableOfContents(contentHtml: string): TableOfContentsItem[] {
  const headingRegex = /<h([2-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[2-6]>/g;
  const toc: TableOfContentsItem[] = [];
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

export async function getAllContent(): Promise<ContentData[]> {
  const slugs = getAllContentSlugs()
  const allContent = await Promise.all(
    slugs.map(async (slug) => {
      return await getContentData(slug)
    })
  )
  
  // Filter out null results and sort by nav_order if available
  return allContent
    .filter((content): content is ContentData => content !== null)
    .sort((a, b) => {
      if (a.nav_order && b.nav_order) {
        return a.nav_order - b.nav_order
      }
      return a.title.localeCompare(b.title)
    })
}

// Extract text content from HTML
function stripHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Extract sections from HTML content
function extractSections(contentHtml: string, pageTitle: string, pageSlug: string): SearchIndexItem[] {
  const sections: SearchIndexItem[] = []
  const headingRegex = /<h([2-6])[^>]*>(.*?)<\/h[2-6]>/gi
  const matches = [...contentHtml.matchAll(headingRegex)]
  
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const level = parseInt(match[1])
    const headingHtml = match[2]
    const headingText = stripHtml(headingHtml)
    
    if (headingText.trim()) {
      const sectionId = headingText.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      
      // Extract content between this heading and the next heading
      const currentHeadingEnd = match.index! + match[0].length
      const nextHeadingStart = i < matches.length - 1 ? matches[i + 1].index! : contentHtml.length
      const sectionContent = contentHtml.substring(currentHeadingEnd, nextHeadingStart)
      const sectionText = stripHtml(sectionContent)
      
      sections.push({
        id: `${pageSlug}-section-${i}`,
        type: 'section',
        title: headingText,
        pageTitle,
        slug: pageSlug,
        sectionId,
        level,
        content: `${headingText} ${sectionText}`.substring(0, 500), // Limit content length
        path: `/${pageSlug}#${sectionId}`,
        searchText: `${headingText} ${sectionText} ${pageTitle}`.toLowerCase()
      })
    }
  }
  
  return sections
}

// Build comprehensive search index
export async function buildSearchIndex(): Promise<SearchIndexItem[]> {
  const allContent = await getAllContent()
  const index: SearchIndexItem[] = []
  
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
function getCategory(slug: string): string {
  if (slug === 'home') return 'overview'
  if (slug === 'about') return 'personal'
  if (slug === 'career') return 'professional'
  if (slug === 'learning') return 'education'
  if (slug === 'projects') return 'portfolio'
  if (slug === 'misc') return 'community'
  if (slug === 'blog') return 'blog'
  if (slug === 'contact') return 'contact'
  return 'general'
}

// Navigation structure builder
export function buildNavigation(content: ContentData[]): NavigationItem[] {
  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      title: 'Home',
      icon: 'Book',
      path: '/',
      description: 'Welcome to my portfolio'
    },
    {
      id: 'about',
      title: 'About',
      icon: 'Code',
      path: '/about',
      description: 'Learn more about me'
    },
    {
      id: 'career',
      title: 'Career',
      icon: 'FileText',
      path: '/career',
      description: 'Professional experience'
    },
    {
      id: 'learning',
      title: 'Learning',
      icon: 'FileText',
      path: '/learning',
      description: 'Educational background'
    },
    {
      id: 'projects',
      title: 'Projects',
      icon: 'FileText',
      path: '/projects',
      description: 'My development projects'
    },
    {
      id: 'misc',
      title: 'Misc',
      icon: 'FileText',
      path: '/misc',
      description: 'Talks and community'
    },
    {
      id: 'blog',
      title: 'Blog',
      icon: 'FileText',
      path: '/blog',
      description: 'Articles and content'
    },
    {
      id: 'contact',
      title: 'Contact',
      icon: 'Shield',
      path: '/contact',
      description: 'Get in touch'
    }
  ]
  
  // Filter navigation items based on available content
  return navigationItems.filter(item => {
    return content.some(c => c.slug === item.id) || ['home', 'about', 'career', 'learning', 'projects', 'misc', 'blog', 'contact'].includes(item.id)
  })
}

// Fallback content for when markdown files aren't available
export function getFallbackContent(): ContentData[] {
  return [
    {
      slug: 'home',
      title: 'Welcome',
      category: 'overview',
      contentHtml: `
        <h1>Welcome to My Portfolio</h1>
        <p>Hi, I'm Nullity, a passionate developer and technology enthusiast.</p>
        
        <h2>What I Do</h2>
        <p>I specialize in building modern web applications and exploring cutting-edge technologies.</p>
        
        <h2>Getting Started</h2>
        <p>Browse through my projects and feel free to get in touch if you'd like to collaborate.</p>
      `
    }
  ]
}