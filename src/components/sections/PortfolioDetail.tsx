"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Calendar,
  FileText,
  BookOpen,
  Tag,
  Code,
} from "lucide-react";
import { notFound } from "next/navigation";
import { PortfolioItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

interface PortfolioDetailProps {
  slug: string;
}

export function PortfolioDetail({ slug }: PortfolioDetailProps) {
  const [project, setProject] = useState<PortfolioItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const decodedSlug = decodeURIComponent(slug);

  // Determine if image is from Cloudinary
  const isCloudinaryImage = project?.imageUrl?.includes("res.cloudinary.com");

  useEffect(() => {
    console.log("Project slug:", slug);
    console.log("Decoded slug:", decodedSlug);

    async function fetchProjectData() {
      try {
        console.log("Fetching from:", `/api/content/portfolio/${slug}`);
        let response = await fetch(`/api/content/portfolio/${slug}`);
        console.log("API response status:", response.status);

        if (!response.ok) {
          console.log("First attempt failed, trying with decoded slug");
          console.log(
            "Fetching from:",
            `/api/content/portfolio/${decodedSlug}`
          );
          response = await fetch(`/api/content/portfolio/${decodedSlug}`);
          console.log(
            "API response status (with decoded slug):",
            response.status
          );
        }

        if (!response.ok) {
          console.log("Both fetch attempts failed");
          setIsLoading(false);
          return; // Will trigger notFound() below
        }

        const data = await response.json();
        console.log("Project data received:", data);
        setProject(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching project data:", error);
        setIsLoading(false);
      }
    }

    fetchProjectData();
  }, [slug, decodedSlug]);

  // If loading is complete but no project was found, show 404
  if (!isLoading && !project) {
    notFound();
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 animate-pulse">
        <div className="h-6 w-32 bg-muted rounded mb-8"></div>
        <div className="h-12 w-3/4 bg-muted rounded mb-4"></div>
        <div className="h-6 w-1/2 bg-muted rounded mb-8"></div>
        <div className="h-80 bg-muted rounded mb-8"></div>
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
        href="/portfolio"
        className="flex items-center mb-6 text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Portfolio
      </Link>

      {project && (
        <>
          <div className="flex flex-wrap items-center justify-between mb-6">
            <SectionHeading
              title={project.title}
              subtitle={project.slug}
              className="mb-0"
            />
            <Badge
              variant="secondary"
              className="text-base px-3 py-1 mt-4 md:mt-0"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {project.year}
            </Badge>
          </div>

          {/* Project Image */}
          <div className="w-full flex justify-center mb-8">
            <div className="rounded-lg overflow-hidden shadow-md">
              <Image
                src={project.imageUrl || "/placeholder-profile.jpg"}
                alt={project.title}
                width={1200}
                height={675}
                className="max-w-full h-auto"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 1200px, 1200px"
                quality={isCloudinaryImage ? 90 : 75}
                priority
              />
            </div>
          </div>

          {/* Project Overview */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Overview</h3>
              <p className="text-lg leading-relaxed mb-6">
                {project.description}
              </p>
            </CardContent>
          </Card>

          {/* Project Abstract */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Project Details</h3>
              <div className="text-base space-y-4 leading-relaxed">
                {project.abstract.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Project Tags */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Project Tags</h3>
            <div className="flex flex-wrap gap-2">
              {project.projectTags &&
                project.projectTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-3 py-1 flex items-center"
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    {tag}
                  </Badge>
                ))}
            </div>
          </div>

          {/* Technologies */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech} className="px-3 py-1 flex items-center">
                  <Code className="h-4 w-4 mr-2" />
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4 mt-8">
            {project.githubUrl && (
              <Button asChild>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <Github className="h-4 w-4 mr-2" />
                  View Source Code
                </a>
              </Button>
            )}

            {project.liveUrl && (
              <Button variant="secondary" asChild>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Live Demo
                </a>
              </Button>
            )}

            {project.publicationUrl && (
              <Button variant="outline" asChild>
                <a
                  href={project.publicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Read Publication
                </a>
              </Button>
            )}

            {project.blogPostUrl && (
              <Button variant="outline" asChild>
                <a
                  href={project.blogPostUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Read Blog Post
                </a>
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
