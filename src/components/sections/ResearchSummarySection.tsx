import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";

export default function ResearchSummarySection() {
  // In a real implementation, this would fetch data from research.json
  const researchMetrics = {
    publications: 25,
    citations: 450,
    h_index: 9,
  };

  return (
    <section className="py-8" id="research-summary">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <SectionHeading
          title="Research"
          subtitle="Academic publications and research metrics"
          className="mb-0"
        />
        <Link
          href="/research"
          className="text-primary hover:underline flex items-center"
        >
          View All Publications
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-1"
          >
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg shadow-sm text-center border hover:shadow-md transition-shadow duration-300">
          <h3 className="text-4xl font-bold">{researchMetrics.publications}</h3>
          <p className="text-muted-foreground">Publications</p>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm text-center border hover:shadow-md transition-shadow duration-300">
          <h3 className="text-4xl font-bold">{researchMetrics.citations}</h3>
          <p className="text-muted-foreground">Citations</p>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm text-center border hover:shadow-md transition-shadow duration-300">
          <h3 className="text-4xl font-bold">{researchMetrics.h_index}</h3>
          <p className="text-muted-foreground">H-Index</p>
        </div>
      </div>

      <div className="bg-muted p-6 rounded-lg border">
        <h3 className="text-xl font-semibold mb-3">Research Interests</h3>
        <div className="flex flex-wrap gap-2">
          <span className="bg-background px-3 py-1 text-sm rounded-full border">
            Machine Learning
          </span>
          <span className="bg-background px-3 py-1 text-sm rounded-full border">
            Computer Vision
          </span>
          <span className="bg-background px-3 py-1 text-sm rounded-full border">
            Natural Language Processing
          </span>
          <span className="bg-background px-3 py-1 text-sm rounded-full border">
            Medical Imaging
          </span>
          <span className="bg-background px-3 py-1 text-sm rounded-full border">
            Healthcare AI
          </span>
        </div>
      </div>
    </section>
  );
}
