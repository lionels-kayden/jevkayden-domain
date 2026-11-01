export type BlogLanguage = "vi" | "en";
export type BlogTheme = "ieee" | "neo" | "obsidian";

export interface BlogBilingualString {
  vi: string;
  en: string;
}

export interface CategorySubNode {
  id: string;
  name: BlogBilingualString;
  description?: BlogBilingualString;
}

export interface CategoryTreeNode {
  id: string;
  name: BlogBilingualString;
  subCategories: CategorySubNode[];
}

export interface BlogPost {
  id: string;
  slug: string;
  paperId: string;
  title: BlogBilingualString;
  excerpt: BlogBilingualString;
  content: BlogBilingualString;
  parentCategory: string;
  subCategory: string;
  tags: string[];
  status: "PUBLISHED" | "DRAFT";
  pinned?: boolean;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
}

export interface BlogData {
  categoryTree: CategoryTreeNode[];
  posts: BlogPost[];
  lastUpdated: string;
}
