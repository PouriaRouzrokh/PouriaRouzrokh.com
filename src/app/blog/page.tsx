import type { Metadata } from "next";
import { getAllPosts } from "@/lib/notion";
import ClientBlogList from "./ClientBlogList";

export const metadata: Metadata = {
  title: "Blog | Pouria AI",
  description:
    "Thoughts, insights, and research from Pouria on AI, machine learning, and more.",
};

// Set revalidation time
export const revalidate = 3600; // 1 hour

export default async function BlogPage() {
  // Fetch all blog posts
  const posts = await getAllPosts();

  // Extract all unique tags
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags))
  ).sort();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Blog
        </h1>
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">
          My personal thoughts and insights on AI, technology, radiology, and
          more...
        </p>
      </div>

      {posts.length > 0 ? (
        <ClientBlogList initialPosts={posts} allTags={allTags} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-2xl font-semibold">No blog posts found</h2>
          <p className="mt-2 text-muted-foreground">
            Check back soon for new content.
          </p>
        </div>
      )}
    </div>
  );
}
