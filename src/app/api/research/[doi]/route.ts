import { NextResponse } from "next/server";
import { getResearch } from "@/lib/data-fetching";

export async function GET(
  request: Request,
  { params }: { params: { doi: string } }
) {
  try {
    const rawDoi = params.doi;
    const decodedDoi = decodeURIComponent(params.doi);
    const data = await getResearch();

    console.log("Raw DOI from params:", rawDoi);
    console.log("Decoded DOI:", decodedDoi);

    // Log the first few DOIs from the data for comparison
    console.log(
      "Sample DOIs from data:",
      data.articles.slice(0, 5).map((article) => article.doi)
    );

    // Try different matching strategies
    let publication = data.articles.find(
      (article) => article.doi === decodedDoi
    );

    // If not found, try case-insensitive match
    if (!publication) {
      console.log("Trying case-insensitive match");
      publication = data.articles.find(
        (article) => article.doi.toLowerCase() === decodedDoi.toLowerCase()
      );
    }

    // If still not found, try with the raw (encoded) DOI
    if (!publication) {
      console.log("Trying match with raw DOI");
      publication = data.articles.find(
        (article) =>
          article.doi === rawDoi ||
          article.doi.toLowerCase() === rawDoi.toLowerCase()
      );
    }

    if (!publication) {
      console.log("Publication not found for DOI:", decodedDoi);
      console.log("Attempted with raw DOI:", rawDoi);
      return NextResponse.json(
        { error: "Publication not found" },
        { status: 404 }
      );
    }

    console.log("Publication found:", publication.title);
    return NextResponse.json(publication);
  } catch (error) {
    console.error("Error fetching publication:", error);
    return NextResponse.json(
      { error: "Failed to fetch publication" },
      { status: 500 }
    );
  }
}
