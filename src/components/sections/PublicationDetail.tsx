"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Clipboard, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { Article } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

interface PublicationDetailProps {
  doi: string;
}

export function PublicationDetail({ doi }: PublicationDetailProps) {
  const [publication, setPublication] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const decodedDoi = decodeURIComponent(doi);

  useEffect(() => {
    console.log("Raw DOI from URL param:", doi);
    console.log("Decoded DOI in client:", decodedDoi);

    async function fetchPublicationData() {
      try {
        // Use the raw DOI from the URL parameter
        console.log("Fetching from:", `/api/research/${doi}`);
        let response = await fetch(`/api/research/${doi}`);
        console.log("API response status (with raw DOI):", response.status);

        // If that fails, try with the decoded DOI
        if (!response.ok) {
          console.log("First attempt failed, trying with decoded DOI");
          console.log("Fetching from:", `/api/research/${decodedDoi}`);
          response = await fetch(`/api/research/${decodedDoi}`);
          console.log(
            "API response status (with decoded DOI):",
            response.status
          );
        }

        if (!response.ok) {
          console.log("Both fetch attempts failed");
          setIsLoading(false);
          return; // Will trigger notFound() below
        }

        const data = await response.json();
        console.log("Publication data received:", data);
        setPublication(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching publication data:", error);
        setIsLoading(false);
      }
    }

    fetchPublicationData();
  }, [doi, decodedDoi]);

  // Copy BibTeX citation to clipboard
  const handleCopyBibTeX = () => {
    if (publication?.bibtex) {
      navigator.clipboard.writeText(publication.bibtex);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // If loading is complete but no publication was found, show 404
  if (!isLoading && !publication) {
    notFound();
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 animate-pulse">
        <div className="h-6 w-32 bg-muted rounded mb-8"></div>
        <div className="h-12 w-3/4 bg-muted rounded mb-4"></div>
        <div className="h-6 w-1/2 bg-muted rounded mb-8"></div>
        <div className="h-60 bg-muted rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-40 bg-muted rounded"></div>
          <div className="h-40 bg-muted rounded"></div>
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
                {typeof publication.authors === "string"
                  ? publication.authors
                  : Array.isArray(publication.authors)
                    ? publication.authors.join(", ")
                    : "Unknown authors"}
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
