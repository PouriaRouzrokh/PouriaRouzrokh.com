"use client";

import { useState, useEffect } from "react";
import { Article } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Clipboard, ArrowLeft, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

interface PublicationDetailProps {
  articleId: string;
}

export function PublicationDetail({ articleId }: PublicationDetailProps) {
  const [publication, setPublication] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    async function fetchPublicationData() {
      try {
        setLoading(true);
        // Use the main research endpoint and filter by article_id client-side
        // instead of using the individual article_id endpoint
        const response = await fetch("/api/content/research");

        if (!response.ok) {
          throw new Error("Failed to fetch research data");
        }

        const data = await response.json();
        const decodedArticleId = decodeURIComponent(articleId);

        // Find the matching article from all articles
        const article = data.articles.find(
          (article: Article) =>
            article.article_id === decodedArticleId ||
            article.article_id.toLowerCase() === decodedArticleId.toLowerCase()
        );

        if (!article) {
          throw new Error("Publication not found");
        }

        setPublication(article);
        setError(null);
      } catch (error) {
        console.error("Error fetching publication:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch publication details"
        );
      } finally {
        setLoading(false);
      }
    }

    if (articleId) {
      fetchPublicationData();
    }
  }, [articleId]);

  const handleCopyBibTeX = () => {
    if (publication?.bibtex) {
      navigator.clipboard.writeText(publication.bibtex);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Format authors list for display
  const formatAuthors = (authors: string[] | string) => {
    if (!authors || (Array.isArray(authors) && authors.length === 0))
      return "Unknown authors";
    if (typeof authors === "string") return authors;
    return authors.join(", ");
  };

  if (loading) {
    return (
      <div className="container py-12 mx-auto">
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Loading publication details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !publication) {
    return (
      <div className="container py-12 mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <h1 className="text-4xl font-bold mb-6 text-center">
            Publication Not Found
          </h1>
          <p className="text-lg text-muted-foreground mb-8 text-center">
            The publication you are looking for could not be found or does not
            exist.
          </p>
          <Link href="/research" passHref>
            <Button variant="default">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Publications
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <Link
        href="/research"
        className="flex items-center mb-6 text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Publications
      </Link>

      {publication && (
        <>
          <SectionHeading
            title={publication.title}
            subtitle={publication.journal}
            className="mb-6"
          />

          <div className="mb-8">
            {/* Publication metadata */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">Year: {publication.year}</Badge>
              <Badge variant="secondary">
                Citations: {publication.num_citations || 0}
              </Badge>
              {publication.doi && (
                <Badge variant="outline">DOI: {publication.doi}</Badge>
              )}
            </div>

            {/* Authors */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Authors</h3>
              <p className="text-muted-foreground">
                {formatAuthors(publication.authors)}
              </p>
            </div>

            {/* Journal info */}
            {(publication.journal ||
              publication.volume ||
              publication.number ||
              publication.pages) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">
                  Publication Details
                </h3>
                <p className="text-muted-foreground">
                  {publication.journal}
                  {publication.volume && `, Volume ${publication.volume}`}
                  {publication.number && `, Number ${publication.number}`}
                  {publication.pages && `, Pages ${publication.pages}`}
                </p>
              </div>
            )}

            {/* Abstract */}
            {publication.abstract && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Abstract</h3>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">
                      {publication.abstract}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* BibTeX citation */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">BibTeX Citation</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyBibTeX}
                  disabled={!publication.bibtex}
                >
                  <Clipboard className="h-4 w-4 mr-2" />
                  {isCopied ? "Copied!" : "Copy"}
                </Button>
              </div>
              <Card>
                <CardContent className="pt-6 overflow-x-auto">
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                    {publication.bibtex || "BibTeX citation not available"}
                  </pre>
                </CardContent>
              </Card>
            </div>

            {/* External link */}
            {publication.url && (
              <div className="flex justify-center mt-8">
                <Button asChild>
                  <a
                    href={publication.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Publication
                  </a>
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
