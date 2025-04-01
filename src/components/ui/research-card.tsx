"use client";

import { useState } from "react";
import Link from "next/link";
import { Article } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clipboard, ExternalLink, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResearchCardProps {
  article: Article;
  className?: string;
}

export function ResearchCard({ article, className }: ResearchCardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyBibTeX = () => {
    if (article.bibtex) {
      navigator.clipboard.writeText(article.bibtex);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Format authors list to show first 3 authors + "et al" if more than 3
  const formatAuthors = (authors: string[]) => {
    if (!authors || authors.length === 0) return "Unknown authors";
    if (typeof authors === "string") return authors; // Handle case where authors is already a string

    if (authors.length <= 3) {
      return authors.join(", ");
    }
    return `${authors.slice(0, 3).join(", ")} et al.`;
  };

  const formattedAuthors =
    typeof article.authors === "string"
      ? article.authors
      : formatAuthors(article.authors as string[]);

  return (
    <Card
      className={cn(
        "h-full flex flex-col transition-shadow hover:shadow-md",
        className
      )}
    >
      <CardHeader className="flex flex-col space-y-1.5 pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {article.title}
          </CardTitle>
          <span className="text-sm font-medium shrink-0">{article.year}</span>
        </div>
        <CardDescription className="text-sm line-clamp-2">
          {formattedAuthors}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            {article.journal}
            {article.volume && `, vol. ${article.volume}`}
            {article.number && `, no. ${article.number}`}
            {article.pages && `, pp. ${article.pages}`}
          </p>
          {article.abstract && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
              {article.abstract}
            </p>
          )}
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="secondary" className="whitespace-nowrap">
              Citations: {article.num_citations || 0}
            </Badge>
            {article.doi && (
              <Badge variant="outline" className="whitespace-nowrap">
                DOI: {article.doi}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-3 gap-2">
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyBibTeX}
                  disabled={!article.bibtex}
                >
                  <Clipboard className="h-4 w-4 mr-1" />
                  {isCopied ? "Copied!" : "BibTeX"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy BibTeX citation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {article.url && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View publication</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <Link href={`/research/${encodeURIComponent(article.doi)}`} passHref>
          <Button variant="secondary" size="sm">
            <Info className="h-4 w-4 mr-1" />
            Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
