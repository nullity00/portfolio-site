import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '../../components/Navigation'
import { getContentData, getAllContentSlugs } from '../../../lib/content'
import '../../markdown.css'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const slugs = getAllContentSlugs()
  return slugs.map((slug) => ({
    slug: slug,
  }))
}

// Generate metadata for each blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getContentData(slug)
  
  if (!post) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  return {
    title: `${post.title} - Nullity Blog`,
    description: post.description || `Read "${post.title}" on Nullity's blog`,
    keywords: [
      'blog',
      'zero knowledge',
      'cryptography',
      'blockchain',
      'circom',
      'fiat-shamir',
      ...(post.title.toLowerCase().split(' '))
    ].join(', '),
    openGraph: {
      title: post.title,
      description: post.description || `Read "${post.title}" on Nullity's blog`,
      type: 'article',
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getContentData(slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      <Navigation currentPage="/blog" />
      
      <div className="min-h-screen bg-black text-white">
        <main className="max-w-4xl mx-auto px-4 py-6">
          <article>
            {/* Back to Blog Link */}
            <div className="mb-6">
              <Link 
                href="/blog"
                className="inline-flex items-center text-zinc-400 hover:text-white transition-colors text-sm"
              >
                ← Back to Blog
              </Link>
            </div>

            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">
                {post.title}
              </h1>
              
              {post.description && (
                <p className="text-lg text-zinc-400 leading-relaxed mb-4">
                  {post.description}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-zinc-500 pt-4 border-t border-zinc-800">
                <span>Category: {post.category || 'Blog'}</span>
                <span>•</span>
                <span>Slug: {post.slug}</span>
              </div>
            </header>

            {/* Article Content */}
            <div className="prose prose-invert max-w-none">
              <div 
                className="markdown-content"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />
            </div>

            {/* Article Footer */}
            <footer className="mt-12 pt-8 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <Link 
                  href="/blog"
                  className="inline-flex items-center text-zinc-400 hover:text-white transition-colors"
                >
                  ← Back to Blog
                </Link>
                
                <div className="text-sm text-zinc-500">
                  © 2024 Nullity. All rights reserved.
                </div>
              </div>
            </footer>
          </article>
        </main>
      </div>
    </>
  )
}