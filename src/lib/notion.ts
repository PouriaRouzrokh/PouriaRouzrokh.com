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
    const posts = await getAllPosts();
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
      return null;
    }

    // Get the page blocks
    const mdblocks = await n2m.pageToMarkdown(post.id);
    const mdString = n2m.toMarkdownString(mdblocks);

    return {
      ...post,
      content: mdString.parent,
      readingTime: calculateReadingTime(mdString.parent),
    };
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
