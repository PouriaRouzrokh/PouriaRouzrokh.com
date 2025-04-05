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
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes cache

/**
 * Fetches all published blog posts from Notion
 */
export async function getAllPosts(): Promise<BlogPostMetadata[]> {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      throw new Error("NOTION_DATABASE_ID is not defined");
    }

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
    // Check cache first
    const cachedData = postCache.get(slug);
    const now = Date.now();

    if (cachedData && now - cachedData.timestamp < CACHE_TTL) {
      return cachedData.post;
    }

    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      throw new Error("NOTION_DATABASE_ID is not defined");
    }

    // Query directly for the post with matching slug
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

    // Get the page blocks
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
    const posts = await getAllPosts();
    return posts.map((post) => post.slug);
  } catch (error) {
    console.error("Error fetching post slugs:", error);
    return [];
  }
}
