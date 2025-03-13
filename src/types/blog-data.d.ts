export interface Author {
  name: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  author: Author;
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  featured: boolean;
}

export interface BlogData {
  [locale: string]: {
    posts: BlogPost[];
    tags: string[];
  }
}

declare module '*/blog-config.json' {
  const value: BlogData;
  export default value;
} 