"use client";

import { useState } from "react";

interface BlogTagFilterProps {
  allTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export default function BlogTagFilter({
  allTags,
  selectedTags,
  onTagToggle,
}: BlogTagFilterProps) {
  const [inputValue, setInputValue] = useState("");

  // Filter tags for search
  const filteredTags = inputValue
    ? allTags.filter((tag) =>
        tag.toLowerCase().includes(inputValue.toLowerCase())
      )
    : allTags;

  return (
    <div className="sticky top-4">
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-semibold">Filter by Tags</h2>

        {/* Search Input */}
        <div className="relative w-full">
          <input
            type="text"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Search tags..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />

          {inputValue && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setInputValue("")}
            >
              <span className="sr-only">Clear</span>
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

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {filteredTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`
                  inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors
                  ${
                    isSelected
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }
                `}
              >
                {tag}
                {isSelected && (
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
                    className="ml-1.5"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </button>
            );
          })}

          {filteredTags.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No tags found matching &quot;{inputValue}&quot;
            </p>
          )}
        </div>

        {/* Clear filters */}
        {selectedTags.length > 0 && (
          <button
            onClick={() => {
              // Clear all selected tags
              selectedTags.forEach((tag) => onTagToggle(tag));
            }}
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
