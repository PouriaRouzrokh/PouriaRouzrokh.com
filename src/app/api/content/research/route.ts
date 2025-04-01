import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ResearchData, Article } from "@/lib/types";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public/content/research.json");
    const fileContents = fs.readFileSync(filePath, "utf8");

    // Parse the JSON and ensure it's in the expected format
    let data: ResearchData;
    try {
      const jsonData = JSON.parse(fileContents);
      console.log("Raw research data:", jsonData);

      // Get articles array
      const articles = Array.isArray(jsonData.articles)
        ? jsonData.articles
        : [];

      // Use processed totals from the JSON file if available, otherwise calculate from articles
      const totalArticles =
        jsonData.total_articles_processed ||
        jsonData.total_articles ||
        articles.length;

      const totalCitations =
        jsonData.total_citations_processed ||
        jsonData.total_citations ||
        articles.reduce(
          (sum: number, article: Article) => sum + (article.num_citations || 0),
          0
        );

      // Ensure the data has the required structure
      data = {
        author: jsonData.author || "Researcher",
        metrics: jsonData.metrics || {
          citations: 0,
          h_index: 0,
          i10_index: 0,
        },
        articles,
        total_articles: totalArticles,
        total_citations: totalCitations,
      };
    } catch (parseError) {
      console.error("Error parsing research JSON:", parseError);
      // Provide default data if parsing fails
      data = {
        author: "Researcher",
        metrics: { citations: 0, h_index: 0, i10_index: 0 },
        articles: [],
        total_articles: 0,
        total_citations: 0,
      };
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading research data:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch research data" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
