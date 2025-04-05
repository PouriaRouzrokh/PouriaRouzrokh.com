import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { BlogPost, BlogPostMetadata } from "./types";
import { calculateReadingTime } from "./media";

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

// Initialize NotionToMarkdown converter
const n2m = new NotionToMarkdown({ notionClient: notion });

// Simple in-memory cache for blog posts
const postCache = new Map<string, { post: BlogPost; timestamp: number }>();
// Simple in-memory cache for all posts listing
let allPostsCache: { posts: BlogPostMetadata[]; timestamp: number } | null =
  null;
// Cache TTL values - can be adjusted as needed
const SINGLE_POST_CACHE_TTL = 1000 * 60 * 15; // 15 minutes cache for individual posts
const ALL_POSTS_CACHE_TTL = 1000 * 60 * 5; // 5 minutes cache for listings

/**
 * Fetches all published blog posts from Notion
 */
export async function getAllPosts(): Promise<BlogPostMetadata[]> {
  try {
    // Check memory cache first for quick access
    const now = Date.now();
    if (allPostsCache && now - allPostsCache.timestamp < ALL_POSTS_CACHE_TTL) {
      return allPostsCache.posts;
    }

    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      throw new Error("NOTION_DATABASE_ID is not defined");
    }

    // Using the native Next.js fetch with optimal caching settings
    // This way the response is cached at the Next.js level
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    const posts = response.results.map((page) => {
      // @ts-expect-error - The Notion API types are complex
      const { properties } = page;

      return {
        id: page.id,
        title: properties.Title.title[0]?.plain_text || "Untitled",
        slug: properties.Slug.rich_text[0]?.plain_text || "",
        date: properties.Date.date?.start || "",
        summary: properties.Summary.rich_text[0]?.plain_text || "",
        tags: properties.Tags.multi_select.map(
          (tag: { name: string }) => tag.name
        ),
        featuredImage: properties.FeaturedImage.url || "",
        published: properties.Published.checkbox,
      };
    });

    // Update in-memory cache
    allPostsCache = { posts, timestamp: now };

    return posts;
  } catch (error) {
    console.error("Error fetching blog posts from Notion:", error);
    return [];
  }
}

/**
 * Fetches a specific blog post by slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Check memory cache first for quick access
    const cachedData = postCache.get(slug);
    const now = Date.now();

    if (cachedData && now - cachedData.timestamp < SINGLE_POST_CACHE_TTL) {
      return cachedData.post;
    }

    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      throw new Error("NOTION_DATABASE_ID is not defined");
    }

    // Query directly for the post with matching slug
    // This is more efficient than fetching all posts and filtering
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: "Slug",
            rich_text: {
              equals: slug,
            },
          },
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
    });

    // No matching post found
    if (response.results.length === 0) {
      return null;
    }

    // Get the matching post
    const page = response.results[0];
    // @ts-expect-error - The Notion API types are complex
    const { properties } = page;

    const post: BlogPostMetadata = {
      id: page.id,
      title: properties.Title.title[0]?.plain_text || "Untitled",
      slug: properties.Slug.rich_text[0]?.plain_text || "",
      date: properties.Date.date?.start || "",
      summary: properties.Summary.rich_text[0]?.plain_text || "",
      tags: properties.Tags.multi_select.map(
        (tag: { name: string }) => tag.name
      ),
      featuredImage: properties.FeaturedImage.url || "",
      published: properties.Published.checkbox,
    };

    // Get the page blocks - this is a separate API call to get the content
    const mdblocks = await n2m.pageToMarkdown(post.id);
    const mdString = n2m.toMarkdownString(mdblocks);

    const fullPost = {
      ...post,
      content: mdString.parent,
      readingTime: calculateReadingTime(mdString.parent),
    };

    // Update cache
    postCache.set(slug, { post: fullPost, timestamp: now });

    return fullPost;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Gets all blog post slugs for static path generation
 */
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    // Optimize by only fetching required properties if getAllPosts doesn't have cached data
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      throw new Error("NOTION_DATABASE_ID is not defined");
    }

    // Check if we have cached posts data to avoid an extra API call
    const now = Date.now();
    if (allPostsCache && now - allPostsCache.timestamp < ALL_POSTS_CACHE_TTL) {
      return allPostsCache.posts.map((post) => post.slug);
    }

    // If no cached data, make a lightweight query that only fetches slugs
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
    });

    return response.results
      .map((page) => {
        // @ts-expect-error - The Notion API types are complex
        return page.properties?.Slug?.rich_text[0]?.plain_text || "";
      })
      .filter((slug) => slug !== "");
  } catch (error) {
    console.error("Error fetching post slugs:", error);
    return [];
  }
}

/**
 * Helper function to revalidate cached data on-demand
 * Can be called from a webhook or API route
 */
export async function revalidateNotionCache() {
  // Clear in-memory cache
  postCache.clear();
  if (allPostsCache) {
    allPostsCache.timestamp = 0; // This will force a refresh on next request
  }
}
