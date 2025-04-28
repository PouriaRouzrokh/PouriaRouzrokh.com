"use client";

import { useState, useEffect, useCallback } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ResearchCard } from "@/components/ui/research-card";
import { Article, ResearchData } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Type for sorting options
type SortOption = "year_desc" | "year_asc" | "citations_desc";

export function ResearchList() {
  const [researchData, setResearchData] = useState<ResearchData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("year_desc");
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch research data
  useEffect(() => {
    async function fetchResearchData() {
      try {
        console.log("Fetching research data...");
        const response = await fetch("/api/research");
        if (!response.ok) {
          throw new Error("Failed to fetch research data");
        }
        const data = await response.json();
        console.log("Research data fetched:", data);
        setResearchData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching research data:", error);
        setIsLoading(false);
      }
    }

    fetchResearchData();
  }, []);

  // Memoized filter function to improve performance
  const filterArticles = useCallback((articles: Article[], query: string) => {
    if (!query.trim()) return articles;

    console.log("Filtering articles with query:", query);

    const lowerQuery = query.toLowerCase().trim();
    return articles.filter((article) => {
      // Check title
      const titleMatch = article.title.toLowerCase().includes(lowerQuery);

      // Check authors (handle both string and array formats)
      let authorsMatch = false;
      if (typeof article.authors === "string") {
        authorsMatch = (article.authors as string)
          .toLowerCase()
          .includes(lowerQuery);
      } else if (Array.isArray(article.authors)) {
        authorsMatch = article.authors.some(
          (author) =>
            typeof author === "string" &&
            author.toLowerCase().includes(lowerQuery)
        );
      }

      // Check other fields - use optional chaining and nullish coalescing for safety
      const abstractMatch =
        article.abstract?.toLowerCase().includes(lowerQuery) ?? false;
      const journalMatch =
        article.journal?.toLowerCase().includes(lowerQuery) ?? false;
      const doiMatch = article.doi?.toLowerCase().includes(lowerQuery) ?? false;

      return (
        titleMatch || authorsMatch || abstractMatch || journalMatch || doiMatch
      );
    });
  }, []);

  // Sort function
  const sortArticles = useCallback(
    (articles: Article[], sortOption: SortOption) => {
      console.log("Sorting articles by:", sortOption);

      return [...articles].sort((a, b) => {
        switch (sortOption) {
          case "year_desc":
            return (b.year || 0) - (a.year || 0);
          case "year_asc":
            return (a.year || 0) - (b.year || 0);
          case "citations_desc":
            return (b.num_citations || 0) - (a.num_citations || 0);
          default:
            return 0;
        }
      });
    },
    []
  );

  // Filter and sort articles whenever dependencies change
  useEffect(() => {
    if (!researchData?.articles) {
      console.log("No research data available yet");
      return;
    }

    console.log("Filtering and sorting articles...");
    console.log("Current search query:", searchQuery);
    console.log("Current sort option:", sortBy);

    // First filter the articles based on search query
    const filtered = filterArticles(researchData.articles, searchQuery);
    console.log(`Filtered to ${filtered.length} articles`);

    // Then sort the filtered articles
    const sorted = sortArticles(filtered, sortBy);

    setFilteredArticles(sorted);
    console.log(`Set ${sorted.length} articles after filtering and sorting`);
  }, [researchData, searchQuery, sortBy, filterArticles, sortArticles]);

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    console.log("Search query changed to:", newQuery);
    setSearchQuery(newQuery);
  };

  // Handle sort selection change
  const handleSortChange = (value: string) => {
    console.log("Sort option changed to:", value);
    setSortBy(value as SortOption);
  };

  // Format metrics for display
  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 animate-pulse">
        <div className="h-12 w-1/3 bg-muted rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted rounded shadow-sm"></div>
          ))}
        </div>
        <div className="h-16 w-full bg-muted rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-muted rounded shadow-sm"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <SectionHeading
        title="Research"
        subtitle="Academic publications and citations"
        className="mb-8"
      />

      {researchData && (
        <>
          {/* Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold text-center">
                  {formatNumber(researchData.total_articles)}
                </CardTitle>
                <CardDescription className="text-center">
                  Publications
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold text-center">
                  {formatNumber(researchData.total_citations)}
                </CardTitle>
                <CardDescription className="text-center">
                  Citations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-4xl font-bold text-center">
                  {researchData.metrics.h_index}
                </CardTitle>
                <CardDescription className="text-center">
                  H-Index
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Search and Sort Controls */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <Label htmlFor="search" className="mb-2 block">
                Search Publications
              </Label>
              <Input
                id="search"
                type="text"
                placeholder="Search by title, authors, keywords..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>

            <div className="w-full md:w-64">
              <Label htmlFor="sort" className="mb-2 block">
                Sort By
              </Label>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger id="sort" className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year_desc">Newest First</SelectItem>
                  <SelectItem value="year_asc">Oldest First</SelectItem>
                  <SelectItem value="citations_desc">Most Cited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Publication List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <ResearchCard key={article.doi} article={article} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <p className="text-muted-foreground">
                  No publications match your search criteria. Try adjusting your
                  search.
                </p>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-6 text-sm text-muted-foreground">
            Showing {filteredArticles.length} of {researchData.articles.length}{" "}
            publications
          </div>
        </>
      )}
    </div>
  );
}
