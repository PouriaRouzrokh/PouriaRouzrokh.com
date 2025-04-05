"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { getResponsiveImageUrl } from "@/lib/media";
import { BlogPostMetadata } from "@/lib/types";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

interface BlogCardProps {
  post: BlogPostMetadata;
}

export default function BlogCard({ post }: BlogCardProps) {
  const { title, slug, date, summary, tags, featuredImage } = post;
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  // Format the date
  const formattedDate = date ? format(new Date(date), "MMMM dd, yyyy") : "";

  // Get optimized image URL
  const imageUrl = featuredImage
    ? getResponsiveImageUrl(featuredImage, 600)
    : "/images/blog-placeholder.jpg";

  // Preload data when user hovers over the card
  const handlePreload = useCallback(() => {
    router.prefetch(`/blog/${slug}`);
  }, [router, slug]);

  // Handle click with immediate feedback
  const handleReadClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsNavigating(true);
      router.push(`/blog/${slug}`);
    },
    [router, slug]
  );

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800/50">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
              >
                {tag}
              </span>
            ))}

            {tags.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                +{tags.length - 3}
              </span>
            )}
          </div>

          <Link href={`/blog/${slug}`} className="mt-2 block">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            <p className="mt-3 text-base text-gray-500 dark:text-gray-400 line-clamp-3">
              {summary}
            </p>
          </Link>
        </div>

        <div className="mt-6 flex items-center">
          <div className="flex-shrink-0">
            <span className="sr-only">Publication date</span>
            <time
              dateTime={date}
              className="text-sm text-gray-500 dark:text-gray-400"
            >
              {formattedDate}
            </time>
          </div>
          <div className="ml-auto">
            <button
              onClick={handleReadClick}
              disabled={isNavigating}
              title={`Read ${title}`}
              onMouseEnter={handlePreload}
              className={`inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 ${
                isNavigating ? "cursor-wait opacity-80" : ""
              }`}
            >
              {isNavigating ? (
                <>
                  Loading
                  <svg
                    className="ml-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </>
              ) : (
                <>
                  Read Now
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
