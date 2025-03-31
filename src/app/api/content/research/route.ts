import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { ResearchData } from "@/lib/types";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "public/content/research.json");
    const fileContents = fs.readFileSync(filePath, "utf8");

    // Parse the JSON and ensure it's in the expected format
    let data: ResearchData;
    try {
      const jsonData = JSON.parse(fileContents);
      console.log("Raw research data:", jsonData);

      // Ensure the data has the required structure
      data = {
        author: jsonData.author || "Researcher",
        metrics: jsonData.metrics || {
          citations: 0,
          h_index: 0,
          i10_index: 0,
        },
        articles: Array.isArray(jsonData.articles) ? jsonData.articles : [],
        total_articles: jsonData.total_articles || 0,
        total_citations: jsonData.total_citations || 0,
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
