// Profile types
export interface SocialLinks {
  twitter: string;
  github: string;
  linkedin: string;
  googleScholar: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Profile {
  name: string;
  title: string;
  email: string;
  bio: string;
  shortBio: string;
  image: string;
  social: SocialLinks;
  skills: SkillCategory[];
  interests: string[];
}

// Education types
export interface Degree {
  degree: string;
  institution: string;
  location: string;
  years: string;
  description: string;
  achievements: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface Education {
  degrees: Degree[];
  certifications: Certification[];
}

// Experience types
export interface Position {
  title: string;
  company: string;
  location: string;
  years: string;
  description: string;
  achievements: string[];
  logo: string;
  technologies: string[];
}

export interface VolunteerPosition {
  title: string;
  organization: string;
  years: string;
  description: string;
}

export interface Experience {
  positions: Position[];
  volunteering: VolunteerPosition[];
}

// Projects types
export interface ProjectLinks {
  github: string;
  demo?: string;
  paper?: string;
}

export interface Project {
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  image: string;
  tags: string[];
  links: ProjectLinks;
  featured?: boolean;
  year: number;
}

export interface Projects {
  featured: Project[];
  other: Project[];
}

// Research types
export interface AuthorMetrics {
  citations: number;
  h_index: number;
  i10_index: number;
  cited_by_5_years: number;
}

export interface Article {
  title: string;
  authors: string;
  year: number;
  journal?: string;
  volume?: string;
  number?: string;
  pages?: string;
  abstract?: string;
  num_citations: number;
  url?: string;
  doi?: string;
  bibtex: string;
}

export interface Research {
  author: string;
  metrics: AuthorMetrics;
  articles: Article[];
  total_articles: number;
  total_citations: number;
}

// Blog types
export interface BlogPostFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  image: string;
  author: string;
}

export interface BlogPost extends BlogPostFrontmatter {
  slug: string;
  content: string;
}

// Navigation type
export interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
}
