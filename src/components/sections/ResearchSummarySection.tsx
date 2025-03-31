import Link from "next/link";

export default function ResearchSummarySection() {
  // In a real implementation, this would fetch data from research.json
  const researchMetrics = {
    publications: 25,
    citations: 450,
    h_index: 9
  };

  return (
    <section className="py-8" id="research-summary">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">Research</h2>
        <Link 
          href="/research"
          className="text-primary hover:underline"
        >
          View All Publications →
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg shadow-sm text-center">
          <h3 className="text-4xl font-bold">{researchMetrics.publications}</h3>
          <p className="text-muted-foreground">Publications</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm text-center">
          <h3 className="text-4xl font-bold">{researchMetrics.citations}</h3>
          <p className="text-muted-foreground">Citations</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm text-center">
          <h3 className="text-4xl font-bold">{researchMetrics.h_index}</h3>
          <p className="text-muted-foreground">H-Index</p>
        </div>
      </div>
      
      <div className="bg-muted p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-3">Research Interests</h3>
        <div className="flex flex-wrap gap-2">
          <span className="bg-background px-3 py-1 text-sm rounded-full">Machine Learning</span>
          <span className="bg-background px-3 py-1 text-sm rounded-full">Computer Vision</span>
          <span className="bg-background px-3 py-1 text-sm rounded-full">Natural Language Processing</span>
          <span className="bg-background px-3 py-1 text-sm rounded-full">Medical Imaging</span>
          <span className="bg-background px-3 py-1 text-sm rounded-full">Healthcare AI</span>
        </div>
      </div>
    </section>
  );
} 