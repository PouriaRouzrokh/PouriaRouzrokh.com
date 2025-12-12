import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { PortfolioItem } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    console.log("API: Fetching portfolio item with slug:", slug);

    const portfolioDir = path.join(process.cwd(), "public/content/portfolio");
    const files = fs
      .readdirSync(portfolioDir)
      .filter((file) => file.endsWith(".json"));

    // First try to find file with slug directly
    const slugFile = `${slug}.json`;
    const exactSlugMatch = files.find((file) => file === slugFile);

    if (exactSlugMatch) {
      const filePath = path.join(portfolioDir, exactSlugMatch);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const projectData = JSON.parse(fileContents) as PortfolioItem;
      return NextResponse.json(projectData);
    }

    // If not found, read all files and search by slug
    const decodedSlug = decodeURIComponent(slug);
    let foundProject: PortfolioItem | null = null;

    for (const file of files) {
      const filePath = path.join(portfolioDir, file);
      const fileContents = fs.readFileSync(filePath, "utf8");
      try {
        const projectData = JSON.parse(fileContents) as PortfolioItem;

        // Check for exact slug match
        if (projectData.slug === slug || projectData.slug === decodedSlug) {
          foundProject = projectData;
          break;
        }

        // Case-insensitive match as fallback
        if (
          !foundProject &&
          (projectData.slug.toLowerCase() === slug.toLowerCase() ||
            projectData.slug.toLowerCase() === decodedSlug.toLowerCase())
        ) {
          foundProject = projectData;
        }
      } catch (parseError) {
        console.error(`Error parsing portfolio file ${file}:`, parseError);
      }
    }

    if (!foundProject) {
      console.log("API: Portfolio item not found with slug:", slug);
      return new NextResponse(
        JSON.stringify({ error: "Portfolio item not found" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("API: Found portfolio item:", foundProject.title);
    return NextResponse.json(foundProject);
  } catch (error) {
    console.error("Error processing portfolio item request:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch portfolio item" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
