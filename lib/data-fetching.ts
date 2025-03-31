import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  Profile,
  Education,
  Experience,
  Projects,
  Research,
  BlogPost,
  BlogPostFrontmatter,
} from "./types";

// Helper function to read JSON file
const readJsonFile = async <T>(filePath: string): Promise<T> => {
  try {
    const fileContents = await fs.promises.readFile(filePath, "utf8");
    return JSON.parse(fileContents) as T;
  } catch (error) {
    console.error(`Error reading file at ${filePath}:`, error);
    throw new Error(`Failed to read data from ${filePath}`);
  }
};

// Get profile data
export async function getProfile(): Promise<Profile> {
  return readJsonFile<Profile>(
    path.join(process.cwd(), "public/content/profile.json")
  );
}

// Get education data
export async function getEducation(): Promise<Education> {
  return readJsonFile<Education>(
    path.join(process.cwd(), "public/content/education.json")
  );
}

// Get experience data
export async function getExperience(): Promise<Experience> {
  return readJsonFile<Experience>(
    path.join(process.cwd(), "public/content/experience.json")
  );
}

// Get projects data
export async function getProjects(): Promise<Projects> {
  return readJsonFile<Projects>(
    path.join(process.cwd(), "public/content/projects.json")
  );
}

// Get research data
export async function getResearch(): Promise<Research> {
  return readJsonFile<Research>(
    path.join(process.cwd(), "public/content/research.json")
  );
}

// Get all blog posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  const blogDirectory = path.join(process.cwd(), "public/content/blog");

  try {
    const fileNames = await fs.promises.readdir(blogDirectory);
    const mdxFiles = fileNames.filter((fileName) => fileName.endsWith(".mdx"));

    const allPostsData = await Promise.all(
      mdxFiles.map(async (fileName) => {
        // Get slug from filename
        const slug = fileName.replace(/\.mdx$/, "");

        // Read MDX file
        const fullPath = path.join(blogDirectory, fileName);
        const fileContents = await fs.promises.readFile(fullPath, "utf8");

        // Use gray-matter to parse the metadata section
        const { data, content } = matter(fileContents);

        // Combine the data with the slug
        return {
          slug,
          content,
          ...(data as BlogPostFrontmatter),
        };
      })
    );

    // Sort posts by date
    return allPostsData.sort((a, b) => {
      if (new Date(a.date) < new Date(b.date)) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error("Error reading blog posts:", error);
    return [];
  }
}

// Get a single blog post by slug
export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(
      process.cwd(),
      "public/content/blog",
      `${slug}.mdx`
    );
    const fileContents = await fs.promises.readFile(fullPath, "utf8");

    const { data, content } = matter(fileContents);

    return {
      slug,
      content,
      ...(data as BlogPostFrontmatter),
    };
  } catch (error) {
    console.error(`Error reading blog post with slug ${slug}:`, error);
    return null;
  }
}

// Get project by slug
export async function getProjectBySlug(
  slug: string
): Promise<Projects["featured"][0] | Projects["other"][0] | null> {
  const projects = await getProjects();

  // Check featured projects
  const featuredProject = projects.featured.find(
    (project) => project.slug === slug
  );
  if (featuredProject) return featuredProject;

  // Check other projects
  const otherProject = projects.other.find((project) => project.slug === slug);
  if (otherProject) return otherProject;

  return null;
}

// Get article by DOI
export async function getArticleByDoi(
  doi: string
): Promise<Research["articles"][0] | null> {
  const research = await getResearch();

  const article = research.articles.find((article) => article.doi === doi);
  return article || null;
}
