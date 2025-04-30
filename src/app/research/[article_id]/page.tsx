import { Metadata } from "next";
import { PublicationDetail } from "@/components/sections/PublicationDetail";
import { getResearch } from "@/lib/data-fetching";

interface PublicationPageProps {
  params: {
    article_id: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { article_id: string };
}): Promise<Metadata> {
  try {
    const rawArticleId = params.article_id;
    console.log("Generating metadata for article ID param:", rawArticleId);
    const decodedArticleId = decodeURIComponent(params.article_id);
    console.log("Decoded article ID for metadata:", decodedArticleId);

    // Server component can directly use the data fetching function
    const data = await getResearch();

    // Log some sample article IDs for debugging
    console.log(
      "Sample article IDs from data:",
      data.articles.slice(0, 3).map((article) => article.article_id)
    );

    // Try different matching strategies
    let publication = data.articles.find(
      (article) => article.article_id === decodedArticleId
    );

    // If not found, try case-insensitive match
    if (!publication) {
      console.log("Metadata: Trying case-insensitive match");
      publication = data.articles.find(
        (article) =>
          article.article_id.toLowerCase() === decodedArticleId.toLowerCase()
      );
    }

    // If still not found, try with the raw (encoded) article ID
    if (!publication) {
      console.log("Metadata: Trying match with raw article ID");
      publication = data.articles.find(
        (article) =>
          article.article_id === rawArticleId ||
          article.article_id.toLowerCase() === rawArticleId.toLowerCase()
      );
    }

    if (!publication) {
      console.log("Publication not found for metadata");
      console.log("Attempted with raw article ID:", rawArticleId);
      return {
        title: "Publication Not Found",
        description: "The requested publication could not be found.",
      };
    }

    console.log("Found publication for metadata:", publication.title);

    return {
      title: publication.title,
      description:
        publication.abstract ||
        `${publication.title} - Published in ${publication.journal}`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Research Publication",
      description: "View details of this academic publication.",
    };
  }
}

export default function PublicationPage({ params }: PublicationPageProps) {
  console.log("Rendering PublicationPage with article ID:", params.article_id);
  return <PublicationDetail articleId={params.article_id} />;
}
