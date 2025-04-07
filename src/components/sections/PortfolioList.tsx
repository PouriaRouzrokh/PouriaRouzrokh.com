"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { PortfolioCard } from "@/components/ui/portfolio-card";
import { PortfolioItem } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PortfolioList() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<string>("all");
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch portfolio data
  useEffect(() => {
    async function fetchPortfolioData() {
      try {
        console.log("Fetching portfolio data...");
        const response = await fetch("/api/content/portfolio");
        if (!response.ok) {
          throw new Error("Failed to fetch portfolio data");
        }
        const data = await response.json();
        console.log("Portfolio data fetched:", data);
        setPortfolioItems(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
        setIsLoading(false);
      }
    }

    fetchPortfolioData();
  }, []);

  // Extract unique project tags from all portfolio items
  const uniqueProjectTags = useMemo(() => {
    if (!portfolioItems.length) return [];

    // Create a Set to automatically handle duplicates
    const tagSet = new Set<string>();

    // Collect all tags from all projects
    portfolioItems.forEach((item) => {
      if (Array.isArray(item.projectTags)) {
        item.projectTags.forEach((tag) => tagSet.add(tag));
      }
    });

    // Convert the Set to an array and sort alphabetically
    return Array.from(tagSet).sort();
  }, [portfolioItems]);

  // Memoized filter function to improve performance
  const filterPortfolioItems = useCallback(
    (items: PortfolioItem[], query: string, filter: string) => {
      // First apply text search
      let filtered = items;

      if (query.trim()) {
        const lowerQuery = query.toLowerCase().trim();
        filtered = items.filter((item) => {
          const titleMatch = item.title.toLowerCase().includes(lowerQuery);
          const descriptionMatch = item.description
            .toLowerCase()
            .includes(lowerQuery);
          const techMatch = item.technologies.some((tech) =>
            tech.toLowerCase().includes(lowerQuery)
          );
          const tagMatch = item.projectTags?.some((tag) =>
            tag.toLowerCase().includes(lowerQuery)
          );

          return titleMatch || descriptionMatch || techMatch || tagMatch;
        });
      }

      // Then apply tag filter
      if (filter !== "all") {
        filtered = filtered.filter((item) => {
          return (
            Array.isArray(item.projectTags) && item.projectTags.includes(filter)
          );
        });
      }

      return filtered;
    },
    []
  );

  // Filter items whenever dependencies change
  useEffect(() => {
    if (!portfolioItems.length) {
      return;
    }

    const filtered = filterPortfolioItems(
      portfolioItems,
      searchQuery,
      filterBy
    );
    setFilteredItems(filtered);
  }, [portfolioItems, searchQuery, filterBy, filterPortfolioItems]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
  };

  // Handle filter selection change
  const handleFilterChange = (value: string) => {
    setFilterBy(value);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 animate-pulse">
        <div className="h-12 w-1/3 bg-muted rounded mb-8"></div>
        <div className="h-16 w-full bg-muted rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 bg-muted rounded shadow-sm"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <SectionHeading
        title="Portfolio"
        subtitle="Explore my coding projects and developed products..."
        className="mb-8"
      />

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow">
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-60">
          <Select value={filterBy} onValueChange={handleFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {uniqueProjectTags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <p className="text-sm text-muted-foreground mb-6">
        Showing {filteredItems.length} of {portfolioItems.length} projects
      </p>

      {/* Portfolio Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((project) => (
            <PortfolioCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-xl font-medium">No projects found</p>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
