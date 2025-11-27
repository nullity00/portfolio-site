'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Search, ChevronRight, ChevronDown, Book, Shield, Code, FileText, ExternalLink, Github, Menu, X, List, LucideIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { ContentData, SearchIndexItem } from '../../lib/content';
import '../markdown.css';

// Type definitions
interface SearchResult extends SearchIndexItem {
  highlightedContent: string;
}

interface SidebarItem {
  id: string;
  title: string;
  icon: LucideIcon;
  children?: SidebarChildItem[];
}

interface SidebarChildItem {
  id: string;
  title: string;
}

interface TOCItem {
  href: string;
  title: string;
}

interface SearchComponentProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
  handleSearchResultClick: (result: SearchResult) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  searchDropdownRef: React.RefObject<HTMLDivElement | null>;
}

interface MobileMenuComponentProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  sidebarItems: SidebarItem[];
  currentPage: string;
  setCurrentPage: (page: string) => void;
  expandedSections: Record<string, boolean>;
  toggleSection: (sectionId: string) => void;
}

interface SidebarItemProps {
  item: SidebarItem;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  expandedSections: Record<string, boolean>;
  toggleSection: (sectionId: string) => void;
  onItemClick?: () => void;
}

interface PortfolioSiteProps {
  initialContent?: ContentData[];
  initialSearchIndex?: SearchIndexItem[];
}

// Separate client-only components to prevent hydration issues
const ClientOnlySearch = dynamic(() => Promise.resolve(SearchComponent), {
  ssr: false,
  loading: () => <SearchSkeleton />
});

const ClientOnlyMobileMenu = dynamic(() => Promise.resolve(MobileMenuComponent), {
  ssr: false,
  loading: () => null
});

// Search skeleton component
function SearchSkeleton() {
  return (
    <div className="relative max-w-6xl">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={18} />
      <div className="w-full pl-10 pr-4 py-3 rounded-lg bg-zinc-900 animate-pulse">
        <div className="h-6 bg-zinc-700 rounded w-48"></div>
      </div>
    </div>
  );
}

// Extracted search component
function SearchComponent({ 
  searchQuery, 
  setSearchQuery, 
  searchResults, 
  isSearchFocused, 
  setIsSearchFocused,
  handleSearchResultClick,
  searchInputRef,
  searchDropdownRef
}: SearchComponentProps) {
  const handleSearchFocus = useCallback(() => {
    setIsSearchFocused(true);
  }, [setIsSearchFocused]);

  return (
    <div className="relative max-w-6xl">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={18} />
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search documentation... (Press / to focus)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={handleSearchFocus}
        className="w-full pl-10 pr-4 py-3 rounded-lg bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
      />
      
      {isSearchFocused && (searchQuery || searchResults.length > 0) && (
        <div 
          ref={searchDropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto"
          role="listbox"
          aria-label="Search results"
        >
          {searchResults.length > 0 ? (
            searchResults.map((result, idx) => (
              <button
                key={`${result.id}-${idx}`}
                onClick={() => handleSearchResultClick(result)}
                className="w-full text-left p-4 hover:bg-zinc-800 transition-colors"
                role="option"
                aria-selected={false}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base font-medium text-white">
                    {result.pageTitle || result.title}
                  </span>
                  {result.type === 'section' && (
                    <>
                      <ChevronRight size={14} className="text-zinc-500" />
                      <span className="text-base text-zinc-400">
                        {result.title}
                      </span>
                    </>
                  )}
                </div>
                <p
                  className="text-base text-zinc-400 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: result.highlightedContent }}
                />
              </button>
            ))
          ) : searchQuery ? (
            <div className="p-4 text-center text-zinc-500">
              No results found for &quot;{searchQuery}&quot;
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// Extracted mobile menu component
function MobileMenuComponent({ 
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  sidebarItems, 
  currentPage, 
  setCurrentPage, 
  expandedSections, 
  toggleSection 
}: MobileMenuComponentProps) {
  const handleClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, [setIsMobileMenuOpen]);

  const handleItemClick = useCallback(() => {
    // Add a small delay for smooth transition before closing
    setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 150);
  }, [setIsMobileMenuOpen]);

  if (!isMobileMenuOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
      isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Backdrop with fade transition */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isMobileMenuOpen ? 'bg-opacity-50' : 'bg-opacity-0'
        }`} 
        onClick={handleClose} 
      />
      
      {/* Sidebar with slide transition */}
      <aside className={`fixed left-0 top-0 w-64 h-full bg-zinc-900 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">Menu</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors duration-200"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                onItemClick={handleItemClick}
              />
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
}

// Extracted sidebar item component
function SidebarItem({ 
  item, 
  currentPage, 
  setCurrentPage, 
  expandedSections, 
  toggleSection, 
  onItemClick 
}: SidebarItemProps) {
  const handleItemClick = useCallback(() => {
    setCurrentPage(item.id);
    // Use the passed onItemClick with transition delay
    onItemClick?.();
  }, [item.id, setCurrentPage, onItemClick]);

  const handleToggleSection = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSection(item.id);
  }, [item.id, toggleSection]);

  return (
    <div>
      <div className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        currentPage === item.id
          ? 'bg-white text-black'
          : 'hover:bg-zinc-800 text-zinc-300'
      }`}>
        <button
          onClick={handleItemClick}
          className="flex items-center gap-3 flex-1 text-left"
          aria-current={currentPage === item.id ? 'page' : undefined}
        >
          <item.icon size={18} />
          <span className="text-base font-medium">{item.title}</span>
        </button>
        
        {item.children && (
          <button
            onClick={handleToggleSection}
            className="p-1 hover:bg-zinc-700 rounded transition-colors"
            aria-expanded={expandedSections[item.id]}
            aria-label={`${expandedSections[item.id] ? 'Collapse' : 'Expand'} ${item.title} section`}
          >
            {expandedSections[item.id] ? 
              <ChevronDown size={16} /> : 
              <ChevronRight size={16} />
            }
          </button>
        )}
      </div>
      
      {item.children && expandedSections[item.id] && (
        <div className="ml-6 mt-2 space-y-1">
          {item.children.map((child) => (
            <button
              key={child.id}
              onClick={() => {
                setCurrentPage(child.id);
                // Add transition delay for child items too
                setTimeout(() => {
                  onItemClick?.();
                }, 150);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-base transition-colors ${
                currentPage === child.id
                  ? 'bg-white text-black'
                  : 'hover:bg-zinc-800 text-zinc-400'
              }`}
              aria-current={currentPage === child.id ? 'page' : undefined}
            >
              {child.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Main component
const PortfolioSite: React.FC<PortfolioSiteProps> = ({ 
  initialContent = [], 
  initialSearchIndex = []
}) => {
  // State management
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => 
    initialContent.length > 0 ? initialContent[0].slug : 'home'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  
  // Client-side hydration fix
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Utility functions (defined early to avoid initialization issues)
  const highlightSearchTerm = useCallback((text: string, term: string): string => {
    if (!term) return text;
    
    // Find the first occurrence of the search term
    const lowerText = text.toLowerCase();
    const lowerTerm = term.toLowerCase();
    const index = lowerText.indexOf(lowerTerm);
    
    if (index === -1) return text;
    
    // Extract context around the term (150 characters before and after)
    const start = Math.max(0, index - 150);
    const end = Math.min(text.length, index + term.length + 150);
    
    let snippet = text.substring(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';
    
    // Highlight the search term
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return snippet.replace(regex, '<mark class="search-highlight">$1</mark>');
  }, []);
  
  // Memoized search index
  const searchIndex = useMemo(() => {
    if (initialSearchIndex.length > 0) {
      return initialSearchIndex;
    }
    if (initialContent.length > 0) {
      const index: SearchIndexItem[] = [];
      initialContent.forEach(page => {
        index.push({
          id: page.slug,
          type: 'page',
          title: page.title,
          slug: page.slug,
          path: `/${page.slug}`,
          category: page.category || 'general',
          content: page.contentHtml ? page.contentHtml.replace(/<[^>]*>/g, '') : '',
          searchText: `${page.title} ${page.contentHtml ? page.contentHtml.replace(/<[^>]*>/g, '') : ''}`.toLowerCase()
        });
      });
      return index;
    }
    return [];
  }, [initialSearchIndex, initialContent]);
  
  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const results = searchIndex
      .filter(item => item.searchText.includes(query))
      .slice(0, 10)
      .map(item => ({
        ...item,
        highlightedContent: highlightSearchTerm(item.content || '', searchQuery)
      }));
    
    setSearchResults(results);
  }, [searchQuery, searchIndex, highlightSearchTerm]);
  
  // Click outside handler for search dropdown
  useEffect(() => {
    if (!isClient) return;
    
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(target) &&
        !searchInputRef.current?.contains(target)
      ) {
        setIsSearchFocused(false);
        setSearchQuery('');
      }
    };

    if (isSearchFocused) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isSearchFocused, isClient]);
  
  // Keyboard shortcuts
  useEffect(() => {
    if (!isClient) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
        setSearchQuery('');
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isClient]);
  
  // Other utility functions
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, []);
  
  const handleSearchResultClick = useCallback((result: SearchResult) => {
    const pageSlug = result.id.split('-section-')[0];
    setCurrentPage(pageSlug);
    setSearchQuery('');
    setIsSearchFocused(false);
    
    // If it's a section result, scroll to that section after a brief delay
    if (result.type === 'section' && result.sectionId) {
      setTimeout(() => {
        const element = document.getElementById(result.sectionId!);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Add a brief highlight effect
          element.style.backgroundColor = '#374151';
          setTimeout(() => {
            element.style.backgroundColor = '';
          }, 2000);
        }
      }, 100);
    }
  }, []);
  
  // Memoized sidebar items - show blog content when available
  const sidebarItems = useMemo<SidebarItem[]>(() => {
    // If we have blog content, create sidebar items from blog posts
    if (initialContent && initialContent.length > 0) {
      return initialContent.map(content => ({
        id: content.slug,
        title: content.title,
        icon: FileText
      }));
    }
    
    // Fallback to navigation items
    return [
      { id: 'home', title: 'Home', icon: Book },
      { id: 'about', title: 'About', icon: Code },
      { id: 'career', title: 'Career', icon: FileText },
      { id: 'learning', title: 'Learning', icon: FileText },
      { id: 'projects', title: 'Projects', icon: FileText },
      { id: 'misc', title: 'Misc', icon: FileText },
      { id: 'blog', title: 'Blog', icon: FileText },
      { id: 'contact', title: 'Contact', icon: Shield }
    ];
  }, [initialContent]);
  
  // Get current page data
  const getCurrentPageData = useCallback((): ContentData => {
    if (initialContent.length > 0) {
      const page = initialContent.find(page => page.slug === currentPage);
      if (page) return page;
    }
    
    // Handle other pages
    if (currentPage === 'blog') {
      return {
        slug: 'blog',
        title: 'Blog',
        category: 'blog',
        contentHtml: `
          <h2>Blog</h2>
          <p>Welcome to my blog where I share insights and experiences from my development journey.</p>
        `,
        description: 'Articles and content from my development journey'
      };
    }
    
    if (currentPage === 'about') {
      return {
        slug: 'about',
        title: 'About',
        category: 'personal',
        contentHtml: `
          <h2>About Me</h2>
          <p>Math graduate with a strong interest in applied cryptography, zero knowledge proofs & its application in the Ethereum ecosystem.</p>
        `,
        description: 'Learn more about my background and experience'
      };
    }
    
    if (currentPage === 'career') {
      return {
        slug: 'career',
        title: 'Career',
        category: 'professional',
        contentHtml: `
          <h2>Career</h2>
          <p>Professional experience in ZK research, blockchain development, and cryptography.</p>
        `,
        description: 'Professional experience and work history'
      };
    }
    
    if (currentPage === 'learning') {
      return {
        slug: 'learning',
        title: 'Learning',
        category: 'education',
        contentHtml: `
          <h2>Learning</h2>
          <p>Educational background including ZK bootcamps, cryptography courses, and formal mathematics education.</p>
        `,
        description: 'Educational background and continuous learning'
      };
    }
    
    if (currentPage === 'projects') {
      return {
        slug: 'projects',
        title: 'Projects',
        category: 'portfolio',
        contentHtml: `
          <h2>Projects</h2>
          <p>Portfolio of ZK projects, Solidity implementations, audit reports, and blockchain applications.</p>
        `,
        description: 'A showcase of my development projects'
      };
    }
    
    if (currentPage === 'misc') {
      return {
        slug: 'misc',
        title: 'Misc',
        category: 'community',
        contentHtml: `
          <h2>Misc</h2>
          <p>Talks, community involvement, and other activities in the ZK and blockchain space.</p>
        `,
        description: 'Talks and community involvement'
      };
    }
    
    if (currentPage === 'contact') {
      return {
        slug: 'contact',
        title: 'Contact',
        category: 'contact',
        contentHtml: `
          <h2>Get in Touch</h2>
          <p>Feel free to reach out for collaborations, questions about ZK circuits, or just to say hi!</p>
        `,
        description: 'Contact information and ways to reach me'
      };
    }
    
    return {
      slug: 'home',
      title: 'Nullity',
      category: 'overview',
      contentHtml: `
        <h1>Welcome to My Portfolio</h1>
        <p>Hi, I'm Nullity, a passionate developer and technology enthusiast.</p>
        <h2>What I Do</h2>
        <p>I specialize in building modern web applications and exploring cutting-edge technologies.</p>
        <h2>Getting Started</h2>
        <p>Browse through my projects and feel free to get in touch if you'd like to collaborate.</p>
      `,
      description: 'Personal portfolio and showcase of development work'
    };
  }, [currentPage, initialContent]);
  
  const currentPageData = getCurrentPageData();
  
  // Floating TOC
  const floatingTOC = useMemo<TOCItem[]>(() => {
    if (!currentPageData.contentHtml) return [];
    
    const tocRegex = /<div class="jekyll-toc">[\s\S]*?<\/div>/;
    const tocMatch = currentPageData.contentHtml.match(tocRegex);
    
    if (!tocMatch) return [];
    
    const linkRegex = /<a href="([^"]*)" class="toc-link">([^<]*)<\/a>/g;
    const links: TOCItem[] = [];
    let match;
    
    while ((match = linkRegex.exec(tocMatch[0])) !== null) {
      links.push({
        href: match[1],
        title: match[2]
      });
    }
    
    return links;
  }, [currentPageData.contentHtml]);

  // Render content
  const renderContent = useCallback(() => {
    if (currentPageData.contentHtml) {
      let processedHtml = currentPageData.contentHtml;
      processedHtml = processedHtml.replace(
        /<table/g, 
        '<div class="table-wrapper"><table'
      );
      processedHtml = processedHtml.replace(
        /<\/table>/g, 
        '</table></div>'
      );
      
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: processedHtml }}
          className="markdown-content leading-relaxed"
        />
      );
    }
    
    return (
      <p className="text-lg leading-relaxed mb-8">
        {currentPageData.description || 'Content not available.'}
      </p>
    );
  }, [currentPageData]);

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const parentPage = sidebarItems.find(item => 
      item.children?.some(child => child.id === currentPage)
    );
    if (parentPage) {
      setCurrentPage(parentPage.id);
    }
  }, [currentPage, sidebarItems]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto flex relative">
        
        {/* Mobile Menu Button */}
        {isClient && (
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="fixed top-4 left-4 z-50 p-2 bg-zinc-900 rounded-lg md:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        )}
        
        {/* Mobile Menu */}
        {isClient && (
          <ClientOnlyMobileMenu
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            sidebarItems={sidebarItems}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          />
        )}
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:block sticky top-0 w-72 h-screen bg-zinc-900 overflow-y-auto">
          <div className="p-6">
            <nav className="space-y-2" role="navigation" aria-label="Main navigation">
              {sidebarItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  expandedSections={expandedSections}
                  toggleSection={toggleSection}
                />
              ))}
            </nav>
            
            <div className="mt-8 pt-4">
              <a
                href="https://github.com/nullity"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-base text-zinc-400 hover:text-white transition-colors"
              >
                <ExternalLink size={16} />
                GitHub Profile
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Search Section */}
          <div className="px-8 py-6 md:px-12 lg:px-16">
            <div className="max-w-4xl"> 
              {isClient ? (
                <ClientOnlySearch
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  searchResults={searchResults}
                  isSearchFocused={isSearchFocused}
                  setIsSearchFocused={setIsSearchFocused}
                  handleSearchResultClick={handleSearchResultClick}
                  searchInputRef={searchInputRef}
                  searchDropdownRef={searchDropdownRef}
                />
              ) : (
                <SearchSkeleton />
              )}
            </div>
          </div>

          {/* Floating TOC */}
          {showTableOfContents && floatingTOC.length > 0 && (
            <div className="fixed right-8 top-24 bottom-4 w-64 bg-zinc-900 rounded-lg shadow-2xl z-30 overflow-y-auto p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-base text-white">
                  Table of Contents
                </h3>
                <button
                  onClick={() => setShowTableOfContents(false)}
                  className="text-zinc-400 hover:text-white transition-colors"
                  aria-label="Close table of contents"
                >
                  <X size={16} />
                </button>
              </div>
              <nav className="space-y-1">
                {floatingTOC.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="block text-base text-zinc-300 hover:text-white transition-colors"
                    onClick={() => setShowTableOfContents(false)}
                  >
                    {item.title}
                  </a>
                ))}
              </nav>
            </div>
          )}
          
          {/* Content */}
          <div className="px-8 py-8 md:px-12 lg:px-16">
            <div className="content-container">
              <article>
                {/* Page Title */}
                <header className="mb-6">
                  <h1 className="text-3xl font-bold text-white">
                    {currentPageData.title}
                  </h1>
                </header>
                
                {/* Page Content */}
                <div className="prose prose-invert max-w-none">
                  {renderContent()}
                </div>
                
                {/* Footer */}
                <footer className="mt-12 pt-8">
                  <div className="flex items-center justify-between text-base text-zinc-400">
                    <span>© 2024 Nullity. All rights reserved.</span>
                    <a
                      href="https://github.com/nullity"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <Github size={16} />
                      GitHub
                    </a>
                  </div>
                </footer>
              </article>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PortfolioSite;