// app/page.js
import ProxiesSite from './components/ProxiesSite'

// Load content data at build time
async function getPageData() {
  try {
    // Import content functions - no need for navigation anymore
    const { getAllContent, buildSearchIndex } = await import('../lib/content')
    
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

export default async function Home() {
  const { content, searchIndex } = await getPageData()
  
  return (
    <ProxiesSite 
      initialContent={content}
      initialSearchIndex={searchIndex}
      // Removed navigation prop - using static nav in component
    />
  )
}

// Enhanced metadata for SEO
export const metadata = {
  title: 'yAcademy Proxies Research | Smart Contract Proxy Patterns & Security',
  description: 'Comprehensive guide to smart contract proxy patterns, security vulnerabilities, and best practices for Web3 developers and auditors. Research by yAcademy.',
  keywords: [
    'smart contracts',
    'proxy patterns', 
    'Web3 security',
    'Ethereum',
    'blockchain',
    'yAcademy',
    'delegatecall',
    'upgradeable contracts',
    'proxy vulnerabilities',
    'smart contract auditing'
  ].join(', '),
  authors: [{ name: 'yAcademy', url: 'https://yacademy.dev' }],
  openGraph: {
    title: 'yAcademy Proxies Research',
    description: 'Comprehensive guide to smart contract proxy patterns and security vulnerabilities',
    url: 'https://proxies.yacademy.dev',
    siteName: 'yAcademy Proxies Research',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png', // Add this image to your public folder
        width: 1200,
        height: 630,
        alt: 'yAcademy Proxies Research',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'yAcademy Proxies Research',
    description: 'Comprehensive guide to smart contract proxy patterns and security',
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