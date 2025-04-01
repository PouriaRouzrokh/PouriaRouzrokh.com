import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { PortfolioItem } from "@/lib/types";

export async function GET() {
  try {
    const portfolioDir = path.join(process.cwd(), "public/content/portfolio");
    const files = fs
      .readdirSync(portfolioDir)
      .filter((file) => file.endsWith(".json"));

    const portfolioItems: PortfolioItem[] = [];

    for (const file of files) {
      const filePath = path.join(portfolioDir, file);
      const fileContents = fs.readFileSync(filePath, "utf8");
      try {
        const projectData = JSON.parse(fileContents) as PortfolioItem;
        portfolioItems.push(projectData);
      } catch (parseError) {
        console.error(`Error parsing portfolio file ${file}:`, parseError);
      }
    }

    // Sort by year (most recent first)
    const sortedItems = portfolioItems.sort((a, b) => b.year - a.year);

    return NextResponse.json(sortedItems);
  } catch (error) {
    console.error("Error reading portfolio data:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch portfolio data" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
