---
id: "markdown-module"
title: "Configurable Blog Implementation Based on Markdown"
slug: "markdown-module"
excerpt: "A detailed introduction to the Markdown-based blog system implementation in the Space-Brain project, including file structure, processing workflow, and related configurations."
tags: ["tutorials", "insights"]
author:
  name: "dibage"
  avatar: "/images/default.webp"
publishedAt: "2024-03-13"
imageUrl: "/images/default.webp"
featured: true
---

# Space-Brain Markdown Blog Implementation Guide

## 1. System Architecture

### 1.1 Directory Structure
```plaintext
space-brain/
├── public/
│   └── md/
│       ├── blog-config.json                     # Core metadata configuration file, auto-generated
│       ├── en/                                  # Original English Markdown files
│       └── zh/                                  # Original Chinese Markdown files
├── scripts/
│   ├── MdFrontMatter.sh                         # Markdown front-matter generation script
│   └── generate-blog-data.ts                    # Markdown post-metadata generation script
└── src/
    ├── app/
    │   └── [locale]/
    │       └── (marketing)/
    │           └── blog/
    │               ├── page.tsx                 # List page
    │               └── [slug]/
    │                   ├── page.tsx             # Detail page
    │                   └── BlogPostClient.tsx   # Markdown data fetching
    ├── components/
    │   └── blog/
    │       ├── BlogHeader.tsx                   # Header component
    │       ├── BlogFooter.tsx                   # Footer component
    │       └── BlogSidebar.tsx                  # Sidebar component
    └── types/
    │   └── blog-data.d.ts                       # Data type definitions
    └── lib/
        └── appConfig.ts                         # Tag type definitions    
```

### 1.2 Core Dependencies
```shell
# Content processing related
pnpm add gray-matter        # Markdown front-matter parsing
pnpm add remark remark-html # Markdown to HTML conversion
pnpm add rehype-raw         # HTML tag processing
pnpm add next-mdx-remote    # MDX support

# Development tools related
pnpm add -D @types/node fs-extra @types/fs-extra
```

## 2. Implementation Process
### 2.1 Content Creation Flow
1. Create Markdown File
    - Create .md file in `public/md/{locale}/` directory
    - Use `MdFrontMatter.sh` to generate front-matter template
2. Generate Blog Configuration
    - Run `generate-blog-data.ts` script
    - Scan all Markdown files and validate
    - Generate `blog-config.json` configuration file

### 2.2 Data Processing Flow
1. Front-matter Processing
```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  featured: boolean;
}
```

2. Markdown File Validation
    - Image path validation
    - Tag validity check
    - Reading time calculation
    - Error logging

### 2.3 Rendering Process
1. Blog List Page (`page.tsx`)
   - Load `blog-config.json` data
   - Support tag filtering
   - Support search functionality
   - Featured articles display
2. Blog Detail Page (`[slug]/page.tsx`)
   - Load corresponding Markdown file based on slug
   - Parse front-matter
   - Render article content
   - Support table of contents navigation

## 3. Key Feature Implementation
### 3.1 Multilingual Support
- Implemented based on next-intl
- Support through `[locale]` dynamic routing
- Separate language folders for Markdown files

### 3.2 Automation Tools
1. Front-matter Generator (`MdFrontMatter.sh`)
   - Auto-generate article template
   - Prevent duplicate additions
   - Support custom fields
2. Post-metadata Generation Script (`generate-blog-data.ts`)
   - Auto-scan all Markdown files
   - Validate article completeness
   - Generate configuration file
   - Error logging

### 3.3 Performance Optimization
- Image optimization: Using Next.js Image component
- Static Generation: Based on `getStaticProps` and `getStaticPaths`
- Incremental Static Regeneration: Support content updates

## 4. Usage Guide
### 4.1 Creating New Articles
```bash
# 1. Create Markdown file
touch public/md/zh/my-new-post.md
# 2. Generate front-matter
./scripts/MdFrontMatter.sh public/md/zh/my-new-post.md
# 3. Update blog configuration
pnpm generate-blog-data
```

### 4.2 Configuration Guide
- Front-matter Fields:
  - id: Article unique identifier
  - title: Article title
  - slug: URL path
  - excerpt: Article summary
  - tags: Article tags
  - author: Author information
  - publishedAt: Publication date
  - imageUrl: Cover image
  - featured: Whether it's a featured article

## 5. Important Notes
1. Image resources must be placed in the `public/images` directory
2. Tag values must be defined in `appConfig.ts`
3. Ensure Markdown files use UTF-8 encoding
4. Run validation scripts periodically to check content integrity