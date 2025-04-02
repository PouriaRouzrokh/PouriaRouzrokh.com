"use client";

import { useState, useEffect } from "react";
import BlogCard from "@/components/sections/BlogCard";
import BlogTagFilter from "@/components/sections/BlogTagFilter";
import { BlogPostMetadata } from "@/lib/types";

interface ClientBlogListProps {
  initialPosts: BlogPostMetadata[];
  allTags: string[];
}

export default function ClientBlogList({
  initialPosts,
  allTags,
}: ClientBlogListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [displayedPosts, setDisplayedPosts] =
    useState<BlogPostMetadata[]>(initialPosts);

  // Handle tag selection/deselection
  const handleTagToggle = (tag: string) => {
    setSelectedTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  // Filter posts based on search term and selected tags
  useEffect(() => {
    let filtered = initialPosts;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.summary.toLowerCase().includes(term) ||
          post.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) =>
        selectedTags.every((tag) => post.tags.includes(tag))
      );
    }

    setDisplayedPosts(filtered);
  }, [searchTerm, selectedTags, initialPosts]);

  return (
    <div>
      {/* Content and Sidebar Layout */}
      <div className="grid gap-8 md:grid-cols-12">
        {/* Tag filter sidebar */}
        <div className="md:col-span-3">
          <BlogTagFilter
            allTags={allTags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
          />
        </div>

        {/* Blog posts area with search bar on top */}
        <div className="md:col-span-9">
          {/* Search Bar - Full Width of Blog Content */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-4 py-3 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <span className="sr-only">Clear search</span>
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
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Blog posts grid */}
          {displayedPosts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayedPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <h3 className="text-lg font-medium">No matching blog posts</h3>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTags([]);
                }}
                className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
