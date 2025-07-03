'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Search, ChevronRight, ChevronDown, Book, Shield, Code, FileText, ExternalLink, Github, Menu, X, List } from 'lucide-react';
import dynamic from 'next/dynamic';
import '../markdown.css';

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
      <div className="w-full pl-10 pr-4 py-3 rounded-lg border bg-zinc-900 border-zinc-700 animate-pulse">
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
}) {
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
        className="w-full pl-10 pr-4 py-3 rounded-lg border bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-colors"
      />
      
      {isSearchFocused && (searchQuery || searchResults.length > 0) && (
        <div 
          ref={searchDropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border-zinc-700 border rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto"
          role="listbox"
          aria-label="Search results"
        >
          {searchResults.length > 0 ? (
            searchResults.map((result, idx) => (
              <button
                key={`${result.id}-${idx}`}
                onClick={() => handleSearchResultClick(result)}
                className="w-full text-left p-4 hover:bg-zinc-800 border-b border-zinc-800 last:border-b-0 transition-colors"
                role="option"
                aria-selected={false}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">
                    {result.pageTitle || result.title}
                  </span>
                  {result.type === 'section' && (
                    <>
                      <ChevronRight size={14} className="text-zinc-500" />
                      <span className="text-sm text-zinc-400">
                        {result.title}
                      </span>
                    </>
                  )}
                </div>
                <p 
                  className="text-sm text-zinc-400 line-clamp-2"
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
}) {
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
      <aside className={`fixed left-0 top-0 w-64 h-full bg-zinc-900 border-r border-zinc-800 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
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
}) {
  const handleItemClick = useCallback(() => {
    setCurrentPage(item.id);
    // Use the passed onItemClick with transition delay
    onItemClick?.();
  }, [item.id, setCurrentPage, onItemClick]);

  const handleToggleSection = useCallback((e) => {
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
          <span className="text-sm font-medium">{item.title}</span>
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
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
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
const ProxiesSiteDark = ({ 
  initialContent = [], 
  initialSearchIndex = []
}) => {
  // State management
  const [isClient, setIsClient] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => 
    initialContent.length > 0 ? initialContent[0].slug : 'home'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    'proxies-deep-dive': true,
    'security-guide': true
  });
  
  // Refs
  const searchInputRef = useRef(null);
  const searchDropdownRef = useRef(null);
  
  // Client-side hydration fix
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Utility functions (defined early to avoid initialization issues)
  const highlightSearchTerm = useCallback((text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }, []);
  
  // Memoized search index
  const searchIndex = useMemo(() => {
    if (initialSearchIndex.length > 0) {
      return initialSearchIndex;
    }
    if (initialContent.length > 0) {
      const index = [];
      initialContent.forEach(page => {
        index.push({
          id: page.slug,
          type: 'page',
          title: page.title,
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
        highlightedContent: highlightSearchTerm(item.content, searchQuery)
      }));
    
    setSearchResults(results);
  }, [searchQuery, searchIndex, highlightSearchTerm]);
  
  // Click outside handler for search dropdown
  useEffect(() => {
    if (!isClient) return;
    
    const handleClickOutside = (event) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target) &&
        !searchInputRef.current?.contains(event.target)
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
    
    const handleKeyDown = (e) => {
      if (e.key === '/' && e.target.tagName !== 'INPUT') {
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
  const toggleSection = useCallback((sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  }, []);
  
  const handleSearchResultClick = useCallback((result) => {
    const pageSlug = result.id.split('-section-')[0];
    setCurrentPage(pageSlug);
    setSearchQuery('');
    setIsSearchFocused(false);
  }, []);
  
  // Memoized sidebar items
  const sidebarItems = useMemo(() => [
    { id: 'home', title: 'yAcademy Proxies Research', icon: Book },
    { id: 'proxy-basics', title: 'Proxy Basics', icon: Code },
    { 
      id: 'proxies-deep-dive', 
      title: 'Proxies Deep Dive', 
      icon: FileText,
      children: [
        { id: 'proxies-storage', title: 'Proxies Storage' },
        { id: 'proxies-table', title: 'Proxies Table' },
        { id: 'delegatecall-history', title: 'History of Callcode and Delegatecall' }
      ]
    },
    { 
      id: 'security-guide', 
      title: 'Security Guide to Proxy Vulns', 
      icon: Shield,
      children: [
        { id: 'proxy-identification', title: 'Proxy Identification Guide' }
      ]
    }
  ], []);
  
  // Get current page data
  const getCurrentPageData = useCallback(() => {
    if (initialContent.length > 0) {
      const page = initialContent.find(page => page.slug === currentPage);
      if (page) return page;
    }
    
    // Handle special parent pages
    if (currentPage === 'proxies-deep-dive') {
      const proxiesListPage = initialContent.find(page => page.slug === 'proxies-list');
      if (proxiesListPage) {
        return {
          ...proxiesListPage,
          slug: 'proxies-deep-dive',
          title: 'Proxies Deep Dive'
        };
      }
    }
    
    if (currentPage === 'security-guide') {
      const securityGuidePage = initialContent.find(page => page.slug === 'security-guide');
      if (securityGuidePage) {
        return securityGuidePage;
      }
      
      return {
        slug: 'security-guide',
        title: 'Security Guide to Proxy Vulns',
        category: 'security',
        contentHtml: `
          <p>Note: If you are unsure which proxy type is in the scope of your audit or security review, see the <a href="/proxy-identification">proxy identification guide</a>.</p>
          
          <div class="jekyll-toc">
            <h2>Table of contents</h2>
            <ol class="toc-list">
              <li class="toc-item"><a href="#uninitialized-proxy-vulnerability" class="toc-link">Uninitialized Proxy Vulnerability</a></li>
              <li class="toc-item"><a href="#storage-collision-vulnerability" class="toc-link">Storage Collision Vulnerability</a></li>
              <li class="toc-item"><a href="#function-clashing-vulnerability" class="toc-link">Function Clashing Vulnerability</a></li>
              <li class="toc-item"><a href="#metamorphic-contract-rug-vulnerability" class="toc-link">Metamorphic Contract Rug Vulnerability</a></li>
            </ol>
          </div>
          
          <p>This section contains detailed information about various proxy security vulnerabilities that auditors should be aware of.</p>
        `,
        description: 'Comprehensive security guide covering common proxy vulnerabilities'
      };
    }
    
    return {
      slug: 'home',
      title: 'yAcademy Proxies Research',
      category: 'overview',
      contentHtml: `
        <p>In Web3, the Proxy or Proxy Delegate is a <a href="https://en.wikipedia.org/wiki/Delegation_pattern">delegation pattern</a> commonly used to introduce upgradability in smart contracts.</p>
        <p>This research effort compiles proxy knowledge with the goal of improving the correctness of proxy implementations and providing a useful resource for security reviews of proxy contracts.</p>
        <h2>Getting Started</h2>
        <p>To see the full content, please set up your markdown files in the content directory.</p>
      `,
      description: 'Comprehensive guide to smart contract proxy patterns and security'
    };
  }, [currentPage, initialContent]);
  
  const currentPageData = getCurrentPageData();
  
  // Floating TOC
  const floatingTOC = useMemo(() => {
    if (!currentPageData.contentHtml) return [];
    
    const tocRegex = /<div class="jekyll-toc">[\s\S]*?<\/div>/;
    const tocMatch = currentPageData.contentHtml.match(tocRegex);
    
    if (!tocMatch) return [];
    
    const linkRegex = /<a href="([^"]*)" class="toc-link">([^<]*)<\/a>/g;
    const links = [];
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
    
    if (currentPageData.sections?.length > 0) {
      return (
        <div>
          {currentPageData.sections.map((section, idx) => (
            <section key={idx} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
              <p className="leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>
      );
    }
    
    return (
      <p className="text-lg leading-relaxed mb-8">
        {currentPageData.description || 'Content not available.'}
      </p>
    );
  }, [currentPageData]);

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = useCallback((e) => {
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
            className="fixed top-4 left-4 z-50 p-2 bg-zinc-900 rounded-lg border border-zinc-700 md:hidden"
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
        <aside className="hidden md:block sticky top-0 w-72 h-screen bg-zinc-900 border-r border-zinc-800 overflow-y-auto">
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
            
            <div className="mt-8 pt-4 border-t border-zinc-800">
              <a
                href="https://yacademy.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <ExternalLink size={16} />
                yAcademy Website
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Search Section */}
          <div className="px-8 py-6 md:px-12 lg:px-16 border-b border-zinc-800">
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
            <div className="fixed right-8 top-24 bottom-4 w-64 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl z-30 overflow-y-auto p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-sm text-white">
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
                    className="block text-sm text-zinc-300 hover:text-white transition-colors"
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
                {/* Breadcrumb Navigation */}
                <nav className="flex items-center space-x-2 text-sm text-zinc-400 mb-6" aria-label="Breadcrumb">
                  <button
                    onClick={handleBreadcrumbClick}
                    className="hover:text-white transition-colors"
                  >
                    {sidebarItems.find(item => 
                      item.children?.some(child => child.id === currentPage)
                    )?.title || 'Security Guide to Proxy Vulns'}
                  </button>
                  <span>/</span>
                  <span className="text-white">
                    {currentPageData.title}
                  </span>
                </nav>
                
                {/* Page Content */}
                <div className="prose prose-invert max-w-none">
                  {renderContent()}
                </div>
                
                {/* Footer */}
                <footer className="mt-12 pt-8 border-t border-zinc-800">
                  <div className="flex items-center justify-between text-sm text-zinc-400">
                    <span>Research effort led by engn33r and devtooligan of yAcademy</span>
                    <a
                      href="https://github.com/YAcademy-Residents/Proxies-website"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <Github size={16} />
                      Edit on GitHub
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

export default ProxiesSiteDark;