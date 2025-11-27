'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { ContentData } from '../../lib/content';

interface BlogListingProps {
  blogPosts: ContentData[];
}

function stripHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function generateExcerpt(content: string, maxLength: number = 200): string {
  const plainText = stripHtml(content);
  if (plainText.length <= maxLength) return plainText;
  
  const excerpt = plainText.substring(0, maxLength);
  const lastSpace = excerpt.lastIndexOf(' ');
  return lastSpace > 0 ? excerpt.substring(0, lastSpace) + '...' : excerpt + '...';
}

function extractHeadings(content: string): string[] {
  const headingRegex = /<h([2-6])[^>]*>(.*?)<\/h[2-6]>/gi;
  const headings: string[] = [];
  let match;
  
  while ((match = headingRegex.exec(content)) !== null && headings.length < 4) {
    const headingText = stripHtml(match[2]);
    if (headingText.trim()) {
      headings.push(headingText);
    }
  }
  
  return headings;
}

function estimateReadingTime(content: string): number {
  const wordCount = stripHtml(content).split(/\s+/).length;
  const wordsPerMinute = 200;
  return Math.ceil(wordCount / wordsPerMinute);
}

export default function BlogListing({ blogPosts }: BlogListingProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(blogPosts);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = blogPosts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.description?.toLowerCase().includes(query) ||
      stripHtml(post.contentHtml).toLowerCase().includes(query)
    );
    
    setFilteredPosts(filtered);
  }, [searchQuery, blogPosts]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Blog</h1>
          <p className="text-zinc-400 mb-6">
            Articles about zero-knowledge proofs, cryptography, and blockchain development
          </p>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
            />
          </div>
        </div>

        {/* Blog Posts */}
        <div className="space-y-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => {
              const headings = extractHeadings(post.contentHtml);
              
              return (
                <article 
                  key={post.slug}
                  className="rounded-lg p-6 hover:bg-zinc-900 transition-colors"
                >
                  {/* Post Header */}
                  <header className="mb-4">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <h2 className="text-xl font-bold text-white group-hover:text-zinc-300 transition-colors mb-2">
                        {post.title}
                      </h2>
                    </Link>

                    {post.description && (
                      <p className="text-white/80 text-base leading-relaxed">
                        {post.description}
                      </p>
                    )}
                  </header>

                  {/* Read More Link */}
                  <div className="pt-4">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-white hover:text-zinc-300 transition-colors text-base font-medium"
                    >
                      Read full article →
                    </Link>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="text-center py-12">
              <p className="text-zinc-400">
                {searchQuery ? `No blog posts found for "${searchQuery}"` : 'No blog posts available'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredPosts.length > 0 && (
          <div className="mt-12 pt-8 text-center">
            <p className="text-zinc-500 text-base">
              {filteredPosts.length} blog post{filteredPosts.length !== 1 ? 's' : ''}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}