"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { getResponsiveImageUrl } from "@/lib/media";
import { BlogPostMetadata } from "@/lib/types";

interface BlogCardProps {
  post: BlogPostMetadata;
}

export default function BlogCard({ post }: BlogCardProps) {
  const { title, slug, date, summary, tags, featuredImage } = post;

  // Format the date
  const formattedDate = date ? format(new Date(date), "MMMM dd, yyyy") : "";

  // Get optimized image URL
  const imageUrl = featuredImage
    ? getResponsiveImageUrl(featuredImage, 600)
    : "/images/blog-placeholder.jpg";

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
        </div>
      </div>
    </div>
  );
}
