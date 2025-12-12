import { NextResponse } from "next/server";
import { getResearch } from "@/lib/data-fetching";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ article_id: string }> }
) {
  try {
    const { article_id } = await params;
    const rawArticleId = article_id;
    const decodedArticleId = decodeURIComponent(article_id);
    const data = await getResearch();

    console.log("Raw article_id from params:", rawArticleId);
    console.log("Decoded article_id:", decodedArticleId);

    // Log the first few article_ids from the data for comparison
    console.log(
      "Sample article_ids from data:",
      data.articles.slice(0, 5).map((article) => article.article_id)
    );

    // Try different matching strategies
    let publication = data.articles.find(
      (article) => article.article_id === decodedArticleId
    );

    // If not found, try case-insensitive match
    if (!publication) {
      console.log("Trying case-insensitive match");
      publication = data.articles.find(
        (article) =>
          article.article_id.toLowerCase() === decodedArticleId.toLowerCase()
      );
    }

    // If still not found, try with the raw (encoded) article_id
    if (!publication) {
      console.log("Trying match with raw article_id");
      publication = data.articles.find(
        (article) =>
          article.article_id === rawArticleId ||
          article.article_id.toLowerCase() === rawArticleId.toLowerCase()
      );
    }

    if (!publication) {
      console.log("Publication not found for article_id:", decodedArticleId);
      console.log("Attempted with raw article_id:", rawArticleId);
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
