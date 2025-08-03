// app/blog/page.tsx
import BlogListing from '../components/BlogListing'
import Navigation from '../components/Navigation'
import { ContentData, SearchIndexItem } from '../../lib/content'
import { Metadata } from 'next'

interface PageData {
  content: ContentData[]
  searchIndex: SearchIndexItem[]
}

// Load content data at build time
async function getPageData(): Promise<PageData> {
  try {
    // Import content functions - no need for navigation anymore
    const { getAllContent, buildSearchIndex } = await import('../../lib/content')
    
    const content = await getAllContent()
    console.log(`Loaded ${content.length} content pages`)
    
    if (content.length === 0) {
      console.log('No content found, using fallback')
      return {
        content: [],
        searchIndex: []
      }
    }
    
    const searchIndex = await buildSearchIndex()
    
    console.log(`Built search index with ${searchIndex.length} entries`)
    
    return {
      content,
      searchIndex
    }
  } catch (error) {
    console.error('Error loading content:', error)
    
    // Return empty data if content loader fails
    return {
      content: [],
      searchIndex: []
    }
  }
}

export default async function BlogPage() {
  const { content } = await getPageData()
  
  return (
    <>
      <Navigation currentPage="/blog" />
      <BlogListing blogPosts={content} />
    </>
  )
}

// Enhanced metadata for SEO
export const metadata: Metadata = {
  title: 'Blog - Nullity Portfolio',
  description: 'Articles and content from my development journey',
  keywords: [
    'blog',
    'developer',
    'articles',
    'programming',
    'technology',
    'web development',
    'software engineering'
  ].join(', '),
  openGraph: {
    title: 'Blog - Nullity Portfolio',
    description: 'Articles and content from my development journey',
    url: 'https://nullity.tech/blog',
    siteName: 'Nullity Portfolio',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nullity Portfolio Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Nullity Portfolio',
    description: 'Articles and content from my development journey',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}