import fs from "fs";
import path from "path";
import {
  ProfileData,
  EducationItem,
  ExperienceItem,
  ResearchData,
  PortfolioItem,
  AchievementItem,
  BlogPostFrontmatter,
} from "./types";

// Raw data interfaces
interface RawProfileData {
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
  };
  skills?: Array<{ category: string; items: string[] }>;
  interests?: string[];
  [key: string]: unknown;
}

interface RawEducationData {
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

interface RawExperienceData {
  positions?: Array<{
    title: string;
    company: string;
    location?: string;
    years: string;
    description: string;
    achievements?: string[];
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

interface RawAchievementData {
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

interface RawResearchData {
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

// Helper function to read and parse JSON files - only used on server
function readJsonFile<T>(filePath: string): T {
  // This function should only be called in a server context
  if (typeof window !== "undefined") {
    throw new Error("readJsonFile should only be called on the server");
  }

  const fullPath = path.join(process.cwd(), filePath);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return JSON.parse(fileContents) as T;
}

// Profile data
export async function getProfile(): Promise<ProfileData> {
  // For client components, fetch data from an API route
  if (typeof window !== "undefined") {
    const response = await fetch("/api/content/profile");
    if (!response.ok) throw new Error("Failed to fetch profile data");
    return response.json();
  }

  // Server-side call
  const profileData = readJsonFile<RawProfileData>(
    "public/content/profile.json"
  );
  return {
    name: profileData.name || "Portfolio Owner",
    credentials: profileData.credentials,
    title: profileData.title || "Professional",
    email: profileData.email || "contact@example.com",
    bio: profileData.bio || "Welcome to my portfolio.",
    shortBio: profileData.shortBio || "Portfolio owner.",
    image: profileData.image || "/placeholder-profile.jpg",
    social: {
      twitter: profileData.social?.twitter || "",
      github: profileData.social?.github || "",
      linkedin: profileData.social?.linkedin || "",
      googleScholar: profileData.social?.googleScholar || "",
    },
    skills: Array.isArray(profileData.skills) ? profileData.skills : [],
    interests: Array.isArray(profileData.interests)
      ? profileData.interests
      : [],
  };
}

// Education data
export async function getEducation(): Promise<EducationItem[]> {
  // For client components, fetch data from an API route
  if (typeof window !== "undefined") {
    const response = await fetch("/api/content/education");
    if (!response.ok) throw new Error("Failed to fetch education data");
    return response.json();
  }

  // Server-side call
  const educationData = readJsonFile<RawEducationData>(
    "public/content/education.json"
  );

  // Extract the degrees array and map to EducationItem format
  if (
    educationData &&
    educationData.degrees &&
    Array.isArray(educationData.degrees)
  ) {
    return educationData.degrees.map((item) => ({
      degree: item.degree,
      institution: item.institution,
      years: item.years,
      description: item.description,
      logoUrl: item.logo || undefined,
    }));
  }

  console.error(
    "Education data doesn't have the expected structure:",
    educationData
  );
  return [];
}

// Experience data
export async function getExperience(): Promise<ExperienceItem[]> {
  // For client components, fetch data from an API route
  if (typeof window !== "undefined") {
    const response = await fetch("/api/content/experience");
    if (!response.ok) throw new Error("Failed to fetch experience data");
    return response.json();
  }

  // Server-side call
  const experienceData = readJsonFile<RawExperienceData>(
    "public/content/experience.json"
  );

  // Extract the positions array and map to ExperienceItem format
  if (
    experienceData &&
    experienceData.positions &&
    Array.isArray(experienceData.positions)
  ) {
    return experienceData.positions.map((position) => {
      // If there are achievements, use them as the description array
      // Otherwise, use the description string
      const description =
        position.achievements && position.achievements.length > 0
          ? position.achievements
          : position.description;

      return {
        role: position.title,
        organization: position.company,
        years: position.years,
        description: description,
        logoUrl: position.logo,
      };
    });
  }

  console.error(
    "Experience data doesn't have the expected structure:",
    experienceData
  );
  return [];
}

// Achievements data
export async function getAchievements(): Promise<AchievementItem[]> {
  // For client components, fetch data from an API route
  if (typeof window !== "undefined") {
    const response = await fetch("/api/content/achievements");
    if (!response.ok) throw new Error("Failed to fetch achievements data");
    return response.json();
  }

  // Server-side call
  const achievementsData = readJsonFile<RawAchievementData>(
    "public/content/achievements.json"
  );
  let results: AchievementItem[] = [];

  // Extract and process awards
  if (
    achievementsData &&
    achievementsData.awards &&
    Array.isArray(achievementsData.awards)
  ) {
    const awards = achievementsData.awards.map((item) => ({
      title: item.title,
      organization: item.organization,
      year: item.year,
      description: item.description,
      category: "Award",
    }));
    results = [...results, ...awards];
  }

  // Extract and process honors
  if (
    achievementsData &&
    achievementsData.honors &&
    Array.isArray(achievementsData.honors)
  ) {
    const honors = achievementsData.honors.map((item) => ({
      title: item.title,
      organization: item.organization,
      year: item.year,
      description: item.description,
      category: "Honor",
    }));
    results = [...results, ...honors];
  }

  // Sort by year (descending)
  results.sort((a, b) => {
    const yearA = parseInt(a.year);
    const yearB = parseInt(b.year);
    return yearB - yearA;
  });

  return results;
}

// Research data
export async function getResearch(): Promise<ResearchData> {
  // For client components, fetch data from an API route
  if (typeof window !== "undefined") {
    const response = await fetch("/api/content/research");
    if (!response.ok) throw new Error("Failed to fetch research data");
    return response.json();
  }

  // Server-side call
  const researchData = readJsonFile<RawResearchData>(
    "public/content/research.json"
  );

  // Calculate total articles and citations if not provided
  const articles = Array.isArray(researchData.articles)
    ? researchData.articles
    : [];

  // Use processed totals from the JSON file if available, otherwise calculate from articles
  const totalArticles =
    researchData.total_articles_processed ||
    researchData.total_articles ||
    articles.length;

  const totalCitations =
    researchData.total_citations_processed ||
    researchData.total_citations ||
    articles.reduce(
      (sum: number, article: { num_citations: number }) =>
        sum + (article.num_citations || 0),
      0
    );

  return {
    author: researchData.author || "Researcher",
    metrics: {
      citations: researchData.metrics?.citations || 0,
      h_index: researchData.metrics?.h_index || 0,
      i10_index: researchData.metrics?.i10_index || 0,
    },
    articles,
    total_articles: totalArticles,
    total_citations: totalCitations,
  };
}

// Portfolio data (renamed from Projects)
export async function getPortfolio(): Promise<PortfolioItem[]> {
  // For client components, fetch data from an API route
  if (typeof window !== "undefined") {
    const response = await fetch("/api/content/portfolio");
    if (!response.ok) throw new Error("Failed to fetch portfolio data");
    return response.json();
  }

  // Server-side call
  return readJsonFile<PortfolioItem[]>("public/content/portfolio.json");
}

// For backward compatibility
export const getProjects = getPortfolio;

// Blog posts
export async function getBlogPosts(): Promise<BlogPostFrontmatter[]> {
  // For client components, fetch data from an API route
  if (typeof window !== "undefined") {
    const response = await fetch("/api/content/blog-posts");
    if (!response.ok) throw new Error("Failed to fetch blog posts");
    return response.json();
  }

  // This is a simplified version. In reality, you'd:
  // 1. Read all .mdx files from public/content/blog
  // 2. Parse frontmatter
  // 3. Return sorted by date
  return [];
}

export async function getBlogPostBySlug(slug: string): Promise<{
  frontmatter: BlogPostFrontmatter;
  content: string;
} | null> {
  // For client components, fetch data from an API route
  if (typeof window !== "undefined") {
    const response = await fetch(`/api/content/blog-posts/${slug}`);
    if (!response.ok) return null;
    return response.json();
  }

  // This is a placeholder implementation that will be replaced later
  console.log(
    `Blog post with slug "${slug}" requested, but function not yet implemented`
  );
  return null;
}
