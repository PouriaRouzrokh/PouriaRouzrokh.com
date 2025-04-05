"use client";

import Link from "next/link";
import Image from "next/image";
import { PortfolioItem } from "@/lib/types";
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
  ExternalLink,
  Github,
  ArrowRight,
  Calendar,
  FileText,
  BookOpen,
  Tag,
  YoutubeIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PortfolioCardProps {
  project: PortfolioItem;
  className?: string;
}

export function PortfolioCard({ project, className }: PortfolioCardProps) {
  // Calculate how many action buttons we have to adjust the layout
  const linkCount = [
    project.githubUrl,
    project.liveUrl,
    project.publicationUrl,
    project.blogPostUrl,
  ].filter(Boolean).length;

  // Determine if image is from Cloudinary
  const isCloudinaryImage = project.imageUrl?.includes("res.cloudinary.com");

  // Check if we have a YouTube video
  const hasVideo = Boolean(project.videoUrl);

  return (
    <Card
      className={cn(
        "h-full flex flex-col overflow-hidden group relative border-2 hover:border-primary/50 transition-all",
        className
      )}
    >
      {/* Project Media (Image or Video indicator) */}
      <div className="w-full h-48 overflow-hidden relative">
        <Image
          src={project.imageUrl || "/placeholder-profile.jpg"}
          alt={project.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={isCloudinaryImage ? 90 : 75}
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

        {/* YouTube Video Indicator */}
        {hasVideo && (
          <div className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 shadow-md">
            <YoutubeIcon className="h-4 w-4" />
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold line-clamp-1">
            {project.title}
          </CardTitle>
          <Badge variant="secondary" className="ml-2 shrink-0">
            <Calendar className="mr-1 h-3 w-3" />
            {project.year}
          </Badge>
        </div>
        <CardDescription className="text-sm">{project.slug}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {project.projectTags &&
            project.projectTags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="flex items-center">
                <Tag className="h-3 w-3 mr-1 opacity-70" />
                {tag}
              </Badge>
            ))}
          {project.projectTags && project.projectTags.length > 3 && (
            <Badge variant="outline">+{project.projectTags.length - 3}</Badge>
          )}
        </div>
      </CardContent>

      <CardFooter
        className={cn(
          "flex gap-2 border-t pt-4",
          linkCount >= 3 ? "flex-col" : "justify-between"
        )}
      >
        <div className="flex flex-wrap gap-2">
          {project.githubUrl && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4 mr-1" />
                Code
              </a>
            </Button>
          )}

          {project.liveUrl && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Demo
              </a>
            </Button>
          )}

          {project.publicationUrl && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.publicationUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileText className="h-4 w-4 mr-1" />
                Paper
              </a>
            </Button>
          )}

          {project.blogPostUrl && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.blogPostUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BookOpen className="h-4 w-4 mr-1" />
                Blog
              </a>
            </Button>
          )}
        </div>

        <Link href={`/portfolio/${project.slug}`} passHref>
          <Button
            variant="default"
            size="sm"
            className={linkCount >= 3 ? "w-full justify-center mt-2" : ""}
          >
            Learn More
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
