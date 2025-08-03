# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js portfolio site for Nullity, showcasing development projects and technical expertise. The site serves as a personal portfolio with a clean, modern interface.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run TypeScript type checking
npm run type-check
```

## Architecture & Structure

### Core Components
- **PortfolioSite.tsx**: Main client-side component that handles the entire application UI, including navigation and content rendering
- **content.ts**: Content management system that processes markdown files from the `/content` directory using gray-matter and remark

### Content System
- Markdown files in `/content/` are processed with gray-matter for frontmatter and remark for HTML conversion
- All content is loaded at build time for optimal performance
- Simple navigation structure for portfolio sections

### Key Features
- **Static Site Generation**: All content is pre-rendered at build time
- **Mobile-First Design**: Responsive layout with mobile menu and touch-friendly navigation
- **Client-Side Navigation**: Single-page application with smooth transitions
- **Markdown Processing**: Enhanced markdown processing for content pages

### Technology Stack
- **Next.js 15**: React framework with App Router
- **TypeScript**: Static type checking for improved developer experience
- **Tailwind CSS 4**: Utility-first CSS framework
- **Outfit Font**: Google Fonts typography for clean, modern design
- **Gray-matter**: YAML frontmatter parsing
- **Remark**: Markdown processing with GitHub Flavored Markdown support
- **Lucide React**: Icon library

### File Structure
```
app/
├── components/PortfolioSite.tsx # Main application component
├── blog/
│   └── page.tsx                # Blog page with content loading
├── layout.tsx                  # Root layout with metadata
├── page.tsx                    # Minimal home page
├── globals.css                 # Global styles
└── markdown.css                # Markdown-specific styling

content/                        # Markdown content files
lib/content.ts                  # Content processing utilities with TypeScript types
tsconfig.json                   # TypeScript configuration
```

### Content Processing Pipeline
1. Markdown files are read from `/content/` directory
2. Gray-matter extracts frontmatter metadata
3. Remark processes markdown to HTML with GFM support
4. HTML is enhanced with CSS classes for styling
5. Content is displayed on the `/blog` page

### State Management
The application uses React hooks for state management:
- Content data is loaded at build time
- Client-side state handles UI interactions (navigation, mobile menu)
- No external state management library is used

## Development Notes

- **TypeScript**: Full type safety with interfaces for content data and component props
- The home page (`/`) is minimal and loads quickly
- The blog page (`/blog`) contains the full PortfolioSite component with content loading
- The site uses dynamic imports for client-only components to prevent hydration issues
- All content is loaded synchronously at build time for optimal performance
- Simple navigation structure for portfolio sections
- Mobile menu components are conditionally rendered to avoid SSR issues
- Type checking is available via `npm run type-check` before builds