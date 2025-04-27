// Profile data types
export interface ProfileData {
  name: string;
  credentials?: string;
  title: string;
  email: string;
  bio: string;
  shortBio: string;
  image: string;
  social: {
    twitter: string;
    github: string;
    linkedin: string;
    googleScholar: string;
    researchGate: string;
    orcid: string;
  };
  skills: {
    category: string;
    items: string[];
  }[];
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

// Acknowledgment data types
export interface AcknowledgmentItem {
  name: string;
  credentials: string;
  years: string;
  title: string;
  affiliation: string;
  imageUrl?: string;
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
  description: string;
  logoUrl?: string;
}

// Achievement data types
export interface AchievementItem {
  title: string;
  organization: string;
  year: string;
  description: string;
  category: string; // "Award" or "Honor"
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

// Portfolio data types (renamed from Project)
export interface PortfolioItem {
  title: string;
  slug: string;
  description: string;
  abstract: string; // Detailed description for individual project pages
  year: number; // Year tag for the project
  technologies: string[];
  projectTags: string[]; // Tags for categorizing and filtering projects
  imageUrl: string;
  videoUrl?: string; // URL to a YouTube video or other video source
  githubUrl?: string;
  liveUrl?: string;
  publicationUrl?: string; // URL to related academic publication
  blogPostUrl?: string; // URL to related blog post
}

// For backward compatibility
export type ProjectItem = PortfolioItem;

// Blog post metadata from Notion
export interface BlogPostMetadata {
  id: string;
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  featuredImage: string;
  published: boolean;
}

// Full blog post with content
export interface BlogPost extends BlogPostMetadata {
  content: string;
  readingTime?: ReadingTime;
}

// Reading time estimate
export interface ReadingTime {
  text: string;
  minutes: number;
  time: number;
  words: number;
}

// Raw data interfaces - for internal use in data-fetching.ts
export interface RawProfileData {
  name?: string;
  credentials?: string;
  title?: string;
  email?: string;
  bio?: string;
  shortBio?: string;
  image?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    googleScholar?: string;
    researchGate?: string;
    orcid?: string;
  };
  skills?: Array<{ category: string; items: string[] }>;
  [key: string]: unknown;
}

export interface RawEducationData {
  degrees?: Array<{
    degree: string;
    institution: string;
    years: string;
    description: string;
    logo?: string;
    [key: string]: unknown;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    url?: string;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

export interface RawExperienceData {
  positions?: Array<{
    title: string;
    organization: string;
    location?: string;
    years: string;
    description: string;
    logo?: string;
    technologies?: string[];
    [key: string]: unknown;
  }>;
  volunteering?: Array<{
    title: string;
    organization: string;
    years: string;
    description: string;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

export interface RawAchievementData {
  awards?: Array<{
    title: string;
    organization: string;
    year: string;
    description: string;
    [key: string]: unknown;
  }>;
  honors?: Array<{
    title: string;
    organization: string;
    year: string;
    description: string;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

export interface RawResearchData {
  author?: string;
  metrics?: {
    citations?: number;
    h_index?: number;
    i10_index?: number;
    cited_by_5_years?: number;
    [key: string]: unknown;
  };
  articles?: Array<{
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
    [key: string]: unknown;
  }>;
  total_articles?: number;
  total_citations?: number;
  total_articles_processed?: number;
  total_citations_processed?: number;
  [key: string]: unknown;
}

export interface RawAcknowledgmentData {
  mentors?: Array<{
    name: string;
    credentials: string;
    years: string;
    title: string;
    affiliation: string;
    imageUrl?: string;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}
