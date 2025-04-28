import { NextResponse } from "next/server";
import { getResearch } from "@/lib/data-fetching";

export async function GET(
  request: Request,
  { params }: { params: { doi: string } }
) {
  try {
    // params.doi should already be decoded by Next.js
    const doi = params.doi;
    const data = await getResearch();

    console.log("Received DOI param:", doi);

    // Log the first few DOIs from the data for comparison
    console.log(
      "Sample DOIs from data:",
      data.articles.slice(0, 5).map((article) => article.doi)
    );

    // Try exact match first
    let publication = data.articles.find((article) => article.doi === doi);

    // If not found, try case-insensitive match
    if (!publication) {
      console.log("Trying case-insensitive match for:", doi);
      publication = data.articles.find(
        (article) => article.doi.toLowerCase() === doi.toLowerCase()
      );
    }

    // Removed the check for rawDoi as it's unlikely to work correctly
    // and params.doi should be decoded.

    if (!publication) {
      console.log("Publication not found for DOI:", doi);
      return NextResponse.json(
        { error: "Publication not found" },
        { status: 404 }
      );
    }

    console.log("Publication found:", publication.title);
    return NextResponse.json(publication);
  } catch (error) {
    console.error("Error fetching publication:", error);
    // Log the specific DOI that caused the error
    console.error("DOI causing error:", params?.doi);
    return NextResponse.json(
      { error: "Failed to fetch publication" },
      { status: 500 }
    );
  }
}
