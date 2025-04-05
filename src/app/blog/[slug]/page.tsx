import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getPostBySlug, getAllPostSlugs } from "@/lib/notion";
import { getResponsiveImageUrl } from "@/lib/media";
import Markdown from "@/components/Markdown";

// Generate static params for all blog posts
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for each blog post
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found | Pouria AI",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: `${post.title} | Pouria AI Blog`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
      images: [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

// Set revalidation time - increased for better caching
export const revalidate = 43200; // 12 hours instead of 1 hour

// Specify page as static generation
export const dynamic = "force-static";

// Configure runtime to be server-side only for security
export const runtime = "nodejs";

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Format the date
  const formattedDate = post.date
    ? format(new Date(post.date), "MMMM dd, yyyy")
    : "";

  // Get optimized image URL
  const imageUrl = post.featuredImage
    ? getResponsiveImageUrl(post.featuredImage, 1200)
    : "/images/blog-placeholder.jpg";

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Back to blog link */}
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-primary hover:underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          Back to all posts
        </Link>
      </div>

      {/* Blog post header */}
      <header className="mb-12">
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/20"
            >
              {tag}
            </Link>
          ))}
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          {post.title}
        </h1>

        <div className="flex items-center text-muted-foreground">
          <time dateTime={post.date}>{formattedDate}</time>

          {post.readingTime && (
            <>
              <span className="mx-2">•</span>
              <span>{post.readingTime.text}</span>
            </>
          )}
        </div>
      </header>

      {/* Featured image */}
      <div className="mb-10 overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
          alt={post.title}
          width={1200}
          height={630}
          className="w-full"
          priority
        />
      </div>

      {/* Blog post content */}
      <article className="prose prose-lg dark:prose-invert mx-auto max-w-4xl">
        <Markdown content={post.content} />
      </article>
    </div>
  );
}
