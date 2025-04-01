import { Metadata } from "next";
import { PublicationDetail } from "@/components/sections/PublicationDetail";
import { getResearch } from "@/lib/data-fetching";

interface PublicationPageProps {
  params: {
    doi: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { doi: string };
}): Promise<Metadata> {
  try {
    const rawDoi = params.doi;
    console.log("Generating metadata for DOI param:", rawDoi);
    const decodedDoi = decodeURIComponent(params.doi);
    console.log("Decoded DOI for metadata:", decodedDoi);

    // Server component can directly use the data fetching function
    const data = await getResearch();

    // Log some sample DOIs for debugging
    console.log(
      "Sample DOIs from data:",
      data.articles.slice(0, 3).map((article) => article.doi)
    );

    // Try different matching strategies
    let publication = data.articles.find(
      (article) => article.doi === decodedDoi
    );

    // If not found, try case-insensitive match
    if (!publication) {
      console.log("Metadata: Trying case-insensitive match");
      publication = data.articles.find(
        (article) => article.doi.toLowerCase() === decodedDoi.toLowerCase()
      );
    }

    // If still not found, try with the raw (encoded) DOI
    if (!publication) {
      console.log("Metadata: Trying match with raw DOI");
      publication = data.articles.find(
        (article) =>
          article.doi === rawDoi ||
          article.doi.toLowerCase() === rawDoi.toLowerCase()
      );
    }

    if (!publication) {
      console.log("Publication not found for metadata");
      console.log("Attempted with raw DOI:", rawDoi);
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
  console.log("Rendering PublicationPage with DOI:", params.doi);
  return <PublicationDetail doi={params.doi} />;
}
