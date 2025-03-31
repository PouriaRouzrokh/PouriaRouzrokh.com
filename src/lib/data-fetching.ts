import fs from "fs";
import path from "path";
import { 
  ProfileData, 
  EducationItem, 
  ExperienceItem,
  ResearchData,
  ProjectItem,
  BlogPostFrontmatter
} from "./types";

// Helper function to read and parse JSON files
const readJsonFile = <T>(filePath: string): T => {
  const fullPath = path.join(process.cwd(), filePath);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return JSON.parse(fileContents) as T;
};

// Profile data
export function getProfile(): ProfileData {
  return readJsonFile<ProfileData>("public/content/profile.json");
}

// Education data
export function getEducation(): EducationItem[] {
  return readJsonFile<EducationItem[]>("public/content/education.json");
}

// Experience data
export function getExperience(): ExperienceItem[] {
  return readJsonFile<ExperienceItem[]>("public/content/experience.json");
}

// Research data
export function getResearch(): ResearchData {
  return readJsonFile<ResearchData>("public/content/research.json");
}

// Projects data
export function getProjects(): ProjectItem[] {
  return readJsonFile<ProjectItem[]>("public/content/projects.json");
}

// Blog posts
// Note: This is a placeholder. Actual implementation will depend on
// how you set up MDX processing (e.g., with next-mdx-remote or @next/mdx)
export function getBlogPosts(): BlogPostFrontmatter[] {
  // This is a simplified version. In reality, you'd:
  // 1. Read all .mdx files from public/content/blog
  // 2. Parse frontmatter
  // 3. Return sorted by date
  return [];
}

export function getBlogPostBySlug(slug: string): {
  frontmatter: BlogPostFrontmatter;
  content: string;
} | null {
  // This is a placeholder implementation that will be replaced later
  console.log(`Blog post with slug "${slug}" requested, but function not yet implemented`);
  return null;
} 