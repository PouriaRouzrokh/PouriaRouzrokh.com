// Profile data types
export interface ProfileData {
  name: string;
  tagline: string;
  bio: string;
  photoUrl: string;
  email: string;
  location: string;
  cvUrl?: string;
  credentials: string[];
  affiliations: Affiliation[];
  socialMedia: SocialMedia[];
}

export interface Affiliation {
  name: string;
  url: string;
  logoUrl?: string;
}

export interface SocialMedia {
  platform: string;
  url: string;
}

// Education data types
export interface EducationItem {
  degree: string;
  institution: string;
  years: string;
  description: string;
  logoUrl?: string;
}

// Experience data types
export interface ExperienceItem {
  role: string;
  organization: string;
  years: string;
  description: string[] | string;
  logoUrl?: string;
}

// Research data types
export interface ResearchData {
  author: string;
  metrics: ResearchMetrics;
  articles: Article[];
  total_articles: number;
  total_citations: number;
}

export interface ResearchMetrics {
  citations: number;
  h_index: number;
  i10_index: number;
  cited_by_5_years?: number;
}

export interface Article {
  title: string;
  authors: string[];
  year: number;
  journal: string;
  volume?: string;
  number?: string;
  pages?: string;
  abstract?: string;
  num_citations: number;
  url?: string;
  doi: string;
  bibtex: string;
}

// Project data types
export interface ProjectItem {
  title: string;
  slug: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  githubUrl?: string;
  liveUrl?: string;
}

// Blog post frontmatter
export interface BlogPostFrontmatter {
  title: string;
  date: string;
  author: string;
  tags: string[];
  summary: string;
  slug: string;
} 